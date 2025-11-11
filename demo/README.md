# Documentación del Backend (Spring Boot)

Este documento ofrece una visión general de la aplicación backend construida con Spring Boot, enfocándose en el mecanismo de autenticación basado en JSON Web Tokens (JWT).

## Estructura del Proyecto

Los archivos y paquetes clave para la autenticación se encuentran en la ruta `src/main/java/com/example/demo/`:

-   **`config/`**: Este paquete contiene las clases de configuración para la seguridad y JWT.
    -   `SecurityConfig.java`: Es la clase principal de configuración de Spring Security. Aquí se definen las reglas de seguridad, como qué endpoints son públicos y cuáles requieren autenticación, se configura el `AuthenticationManager` y se especifica qué filtros de seguridad aplicar.
    -   `JwtAuthenticationEntryPoint.java`: Maneja los errores de autenticación. Si un usuario no autenticado intenta acceder a un recurso protegido, esta clase se encarga de devolver una respuesta de error 401 (Unauthorized).
    -   `JwtRequestFilter.java`: Este es un filtro que se ejecuta una vez por cada solicitud. Su responsabilidad es interceptar las peticiones entrantes, extraer el token JWT de la cabecera `Authorization`, validarlo y, si es válido, establecer el contexto de seguridad de Spring.
    -   `JwtTokenUtil.java`: Una clase de utilidad con métodos para realizar operaciones con JWT, como generar un nuevo token a partir de los detalles de un usuario, validar un token existente y extraer información (como el nombre de usuario) de un token.
-   **`controller/`**: Contiene los controladores REST que exponen los endpoints de la API.
    -   `JwtAuthenticationController.java`: Expone el endpoint público `/authenticate`. Este es el punto de entrada para que los usuarios inicien sesión. Recibe las credenciales y, si son válidas, devuelve un token JWT.
-   **`service/`**: Contiene la lógica de negocio de la aplicación.
    -   `JwtUserDetailsService.java`: Implementa la interfaz `UserDetailsService` de Spring Security. Su única responsabilidad es cargar los datos de un usuario (incluida su contraseña cifrada y sus roles) desde la base de datos a partir de su nombre de usuario.
-   **`model/`**: Contiene las clases de modelo (entidades y DTOs).
    -   `JwtRequest.java`: Un Objeto de Transferencia de Datos (DTO) que representa la estructura del cuerpo de la solicitud de autenticación (JSON con `username` y `password`).
    -   `JwtResponse.java`: Un DTO que representa la estructura de la respuesta de autenticación exitosa (JSON con el `token` JWT).

## Flujo de Autenticación

1.  **Endpoint de Inicio de Sesión**: El cliente (frontend) envía una solicitud POST al endpoint `/authenticate`, gestionado por `JwtAuthenticationController`. El cuerpo de la solicitud contiene el nombre de usuario y la contraseña en un objeto `JwtRequest`.
2.  **Autenticación de Credenciales**: El controlador utiliza el `AuthenticationManager` de Spring Security para validar las credenciales. El `AuthenticationManager` a su vez utiliza el `JwtUserDetailsService` para buscar al usuario en la base de datos y comparar la contraseña proporcionada con la almacenada (usando Bcrypt).
3.  **Carga de Detalles del Usuario**: Durante la autenticación, se invoca a `JwtUserDetailsService` para obtener los detalles completos del usuario desde la base de datos.
4.  **Generación del Token**: Si la autenticación es exitosa (las credenciales son correctas), el `JwtAuthenticationController` utiliza `JwtTokenUtil` para generar un nuevo token JWT, firmándolo con una clave secreta y estableciendo una fecha de expiración.
5.  **Respuesta con el Token**: El controlador devuelve una respuesta HTTP 200 OK al cliente, incluyendo el token JWT generado dentro de un objeto `JwtResponse`.
6.  **Filtrado de Solicitudes Posteriores**: Para cualquier solicitud futura a un endpoint protegido, el `JwtRequestFilter` se activa. Extrae el token de la cabecera `Authorization`, verifica su firma y fecha de expiración usando `JwtTokenUtil`. Si el token es válido, el filtro establece la identidad del usuario en el contexto de seguridad de Spring (`SecurityContextHolder`), permitiendo que la solicitud continúe hacia el controlador correspondiente.
