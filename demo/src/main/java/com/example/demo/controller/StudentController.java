package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Student;
import com.example.demo.service.StudentService;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:4200")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> showDashboard(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        String nombre = (email != null)
            ? studentService.findByEmail(email).map(s -> s.getNombre()).orElse(email)
            : "Estudiante";
        java.util.Map<String, Object> data = new java.util.HashMap<>();
        data.put("studentName", nombre);
        data.put("activePage", "dashboard");
        return ResponseEntity.ok(data);
    }

    @GetMapping("/profile")
    public ResponseEntity<Student> getProfile(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        if (email != null) {
            return studentService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        }
        return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
    }

    @PutMapping("/profile")
    public ResponseEntity<Student> updateProfile(Authentication authentication, @RequestBody Student changes) {
        String email = authentication.getName();
        Student student = studentService.findByEmail(email).orElseThrow(() -> new IllegalStateException("Estudiante no encontrado"));
        return ResponseEntity.ok(studentService.update(student.getId(), changes));
    }

    // Agrega métodos para las otras vistas (ayuda, etc.) de la misma manera
}