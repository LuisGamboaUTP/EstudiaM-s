# Documentación del Frontend (Angular)

Este documento proporciona una descripción detallada de la aplicación frontend de Angular, centrándose específicamente en el flujo de autenticación de usuarios.

## Estructura del Proyecto

Los archivos principales relacionados con la autenticación se encuentran en el directorio `src/app/`:

-   **`components/login/`**: Aquí reside el `LoginComponent`, que es responsable de renderizar el formulario de inicio de sesión y capturar las credenciales del usuario (nombre de usuario y contraseña).
-   **`services/auth.service.ts`**: Este servicio actúa como un intermediario entre los componentes y el backend. Contiene la lógica para enviar las solicitudes de inicio de sesión, almacenar el token JWT recibido y gestionar el estado de autenticación del usuario.
-   **`interceptors/jwt.interceptor.ts`**: Un interceptor de HTTP que se ejecuta para cada solicitud saliente. Su función es añadir automáticamente el token JWT en la cabecera `Authorization` de las peticiones dirigidas a rutas protegidas del backend. Esto evita tener que añadir el token manualmente en cada llamada.
-   **`guards/auth.guard.ts`**: Es un "guardián de ruta". Antes de que el usuario pueda acceder a una ruta protegida (como un dashboard), este guardián comprueba si existe un token de autenticación válido. Si el usuario no está autenticado, lo redirige a la página de inicio de sesión.

## Flujo de Autenticación

El proceso de inicio de sesión sigue estos pasos:

1.  **Ingreso de Credenciales**: El usuario introduce su nombre de usuario y contraseña en el formulario presentado por `LoginComponent`.
2.  **Llamada al Servicio de Autenticación**: Al enviar el formulario, `LoginComponent` invoca el método `login()` del `AuthService`, pasándole las credenciales.
3.  **Solicitud a la API del Backend**: `AuthService` realiza una solicitud HTTP POST al endpoint `/authenticate` del backend. El cuerpo de esta solicitud contiene las credenciales del usuario en formato JSON.
4.  **Almacenamiento del Token**: Si las credenciales son correctas, el backend responde con un token JWT. El `AuthService` recibe este token y lo guarda de forma segura en el almacenamiento local (`localStorage`) del navegador.
5.  **Intercepción de Solicitudes Futuras**: A partir de este momento, cada vez que la aplicación necesite acceder a un recurso protegido del backend, el `JwtInterceptor` interceptará la solicitud HTTP y añadirá el token JWT en la cabecera `Authorization` con el formato `Bearer [token]`.
6.  **Protección de Rutas**: Si el usuario intenta navegar directamente a una URL protegida, el `AuthGuard` se activa. Verifica la presencia y validez del token en `localStorage`. Si el token no es válido o no existe, el guardián cancela la navegación y redirige al usuario a la página de inicio de sesión.
