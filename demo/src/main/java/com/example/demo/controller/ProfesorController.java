package com.example.demo.controller;

import com.example.demo.model.Professor;
import com.example.demo.model.Curso;
import com.example.demo.service.ProfessorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/profesor")
@CrossOrigin(origins = "http://localhost:4200")
public class ProfesorController {

    private final ProfessorService service;
    private final com.example.demo.repository.CursoRepository cursoRepository;

    public ProfesorController(ProfessorService service, com.example.demo.repository.CursoRepository cursoRepository) {
        this.service = service;
        this.cursoRepository = cursoRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(Authentication authentication) {
        String email = (authentication != null) ? authentication.getName() : null;
        if (email != null) {
            Optional<Professor> opt = service.findByEmail(email);
            if (opt.isPresent()) {
                Professor profesor = opt.get();
                java.util.List<Curso> cursos = cursoRepository.findByProfesorId(profesor.getId());
                java.util.Map<String, Object> data = new java.util.HashMap<>();
                data.put("profesor", profesor);
                data.put("cursos", cursos);
                return ResponseEntity.ok(data);
            }
        }
        return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).body("Profesor no encontrado");
    }

    @GetMapping("/profile")
    public ResponseEntity<Professor> getProfile(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        if (email != null) {
            return service.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        }
        return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
    }

    @PutMapping("/profile")
    public ResponseEntity<Professor> updateProfile(Authentication authentication, @RequestBody Professor changes) {
        String email = authentication.getName();
        Professor professor = service.findByEmail(email).orElseThrow(() -> new IllegalStateException("Profesor no encontrado"));
        return ResponseEntity.ok(service.update(professor.getId(), changes));
    }

    @GetMapping
    public List<Professor> all() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Professor> one(@PathVariable Long id) {
        return service.getById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Professor> create(@RequestBody Professor p) {
        Professor created = service.create(p);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Professor> update(@PathVariable Long id, @RequestBody Professor p) {
        Professor updated = service.update(id, p);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
