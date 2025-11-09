package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Admin;
import com.example.demo.model.Student;
import com.example.demo.model.Professor;
import com.example.demo.model.Curso;
import com.example.demo.model.EstadoCurso;

import com.example.demo.service.AdminService;
import com.example.demo.service.StudentService;
import com.example.demo.service.ProfessorService;

import com.example.demo.repository.CursoRepository;
import com.example.demo.repository.ProfessorRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    private final AdminService adminService;
    private final StudentService studentService;
    private final ProfessorService professorService;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    public AdminController(AdminService adminService,
                           StudentService studentService,
                           ProfessorService professorService,
                           CursoRepository cursoRepository,
                           ProfessorRepository professorRepository) {
        this.adminService = adminService;
        this.studentService = studentService;
        this.professorService = professorService;
        this.cursoRepository = cursoRepository;
        this.professorRepository = professorRepository;
    }

    // ===========================
    // DASHBOARD
    // ===========================
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("students", studentService.findAll());
        List<Professor> professors = professorService.findAll();
        data.put("professors", professors);
        data.put("profesores", professors);
        data.put("admins", adminService.findAll());
        data.put("cursos", cursoRepository.findAll());
        return ResponseEntity.ok(data);
    }

    // ===========================
    // CRUD STUDENTS
    // ===========================
    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.findAll());
    }

    @PostMapping("/students")
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        return ResponseEntity.ok(studentService.save(student));
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<Student> getStudent(@PathVariable Long id) {
        return studentService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student student) {
        return ResponseEntity.ok(studentService.update(id, student));
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long id) {
        studentService.delete(id);
        return ResponseEntity.ok("Estudiante eliminado");
    }

    // ===========================
    // CRUD PROFESSORS
    // ===========================
    @GetMapping("/profesores")
    public ResponseEntity<List<Professor>> getAllProfessors() {
        return ResponseEntity.ok(professorService.findAll());
    }

    @PostMapping("/profesores")
    public ResponseEntity<Professor> createProfessor(@RequestBody Professor professor) {
        return ResponseEntity.ok(professorService.create(professor));
    }

    @GetMapping("/profesores/{id}")
    public ResponseEntity<Professor> getProfessor(@PathVariable Long id) {
        return professorService.getById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profesores/{id}")
    public ResponseEntity<Professor> updateProfessor(@PathVariable Long id, @RequestBody Professor professor) {
        return ResponseEntity.ok(professorService.update(id, professor));
    }

    @DeleteMapping("/profesores/{id}")
    public ResponseEntity<String> deleteProfessor(@PathVariable Long id) {
        professorService.delete(id);
        return ResponseEntity.ok("Profesor eliminado");
    }

    // ===========================
    // CRUD ADMINS
    // ===========================
    @GetMapping("/admins")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(adminService.findAll());
    }

    @PostMapping("/admins")
    public ResponseEntity<Admin> createAdmin(@RequestBody Admin admin) {
        return ResponseEntity.ok(adminService.create(admin));
    }

    @GetMapping("/admins/{id}")
    public ResponseEntity<Admin> getAdmin(@PathVariable Long id) {
        return adminService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/admins/{id}")
    public ResponseEntity<Admin> updateAdmin(@PathVariable Long id, @RequestBody Admin admin) {
        return ResponseEntity.ok(adminService.update(id, admin));
    }

    @DeleteMapping("/admins/{id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable Long id) {
        adminService.delete(id);
        return ResponseEntity.ok("Administrador eliminado");
    }

    // ===========================
    // CRUD CURSOS
    // ===========================
    @GetMapping("/cursos")
    public ResponseEntity<List<Curso>> getAllCursos() {
        return ResponseEntity.ok(cursoRepository.findAll());
    }

    @PostMapping("/cursos")
    public ResponseEntity<?> createCurso(@RequestBody Map<String, Object> payload) {
        try {
            Curso curso = new Curso();
            curso.setNombre((String) payload.get("nombre"));
            curso.setCodigo((String) payload.get("codigo"));
            curso.setDescripcion((String) payload.get("descripcion"));

            if (payload.get("estado") != null) {
                curso.setEstado(EstadoCurso.valueOf((String) payload.get("estado")));
            }

            if (payload.get("profesor") != null) {
                Map<String, Object> profesorMap = (Map<String, Object>) payload.get("profesor");
                if (profesorMap.get("id") != null && !profesorMap.get("id").toString().isEmpty()) {
                    Long profesorId = Long.valueOf(profesorMap.get("id").toString());
                    professorRepository.findById(profesorId).ifPresent(curso::setProfesor);
                }
            }

            Curso savedCurso = cursoRepository.save(curso);
            return ResponseEntity.ok(savedCurso);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creando curso: " + e.getMessage());
        }
    }

    @GetMapping("/cursos/{id}")
    public ResponseEntity<Curso> getCurso(@PathVariable Long id) {
        Optional<Curso> curso = cursoRepository.findById(id);
        return curso.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/cursos/{id}")
    public ResponseEntity<?> updateCurso(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Optional<Curso> cursoExistenteOpt = cursoRepository.findById(id);

            if (!cursoExistenteOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado");
            }

            Curso curso = cursoExistenteOpt.get();
            curso.setNombre(payload.get("nombre").toString());
            curso.setCodigo(payload.get("codigo").toString());
            curso.setDescripcion(payload.get("descripcion").toString());

            if (payload.get("estado") != null) {
                curso.setEstado(EstadoCurso.valueOf(payload.get("estado").toString()));
            }

            if (payload.get("profesor") != null) {
                Map<String, Object> profesorMap = (Map<String, Object>) payload.get("profesor");
                if (profesorMap.get("id") != null && !profesorMap.get("id").toString().isEmpty()) {
                    Long profesorId = Long.valueOf(profesorMap.get("id").toString());
                    professorRepository.findById(profesorId).ifPresent(curso::setProfesor);
                } else {
                    curso.setProfesor(null);
                }
            } else {
                curso.setProfesor(null);
            }

            Curso updatedCurso = cursoRepository.save(curso);
            return ResponseEntity.ok(updatedCurso);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar curso: " + e.getMessage());
        }
    }

    @DeleteMapping("/cursos/{id}")
    public ResponseEntity<String> deleteCurso(@PathVariable Long id) {
        try {
            if (cursoRepository.existsById(id)) {
                cursoRepository.deleteById(id);
                return ResponseEntity.ok("Curso eliminado exitosamente");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Curso no encontrado");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar curso: " + e.getMessage());
        }
    }
}
