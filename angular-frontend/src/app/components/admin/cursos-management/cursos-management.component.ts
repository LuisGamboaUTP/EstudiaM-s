import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Curso, Professor } from '../../../services/admin.service';

@Component({
  selector: 'app-cursos-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos-management.component.html',
  styleUrl: './cursos-management.component.css'
})
export class CursosManagementComponent implements OnInit {
  @Input() cursos: Curso[] = [];
  @Input() professors: Professor[] = [];
  showModal = false;
  showEditModal = false;
  currentCurso: Curso | null = null;
  cursoForm: any = {
    nombre: '',
    codigo: '',
    descripcion: '',
    estado: 'ACTIVO',
    profesor: null
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadCursos();
  }

  loadCursos(): void {
    this.adminService.getAllCursos().subscribe({
      next: (cursos) => { this.cursos = cursos; },
      error: (error) => { console.error('Error loading cursos:', error); }
    });
  }

  openAddModal(): void {
    this.cursoForm = { nombre: '', codigo: '', descripcion: '', estado: 'ACTIVO', profesor: null };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.showEditModal = false;
    this.currentCurso = null;
  }

  saveCurso(): void {
    const payload = {
      nombre: this.cursoForm.nombre,
      codigo: this.cursoForm.codigo,
      descripcion: this.cursoForm.descripcion,
      estado: this.cursoForm.estado,
      profesor: this.cursoForm.profesorId ? { id: this.cursoForm.profesorId } : null
    };
    this.adminService.createCurso(payload).subscribe({
      next: () => { this.closeModal(); this.loadCursos(); },
      error: () => { alert('Error al guardar curso'); }
    });
  }

  openEditModal(curso: Curso): void {
    this.currentCurso = { ...curso };
    this.cursoForm = {
      nombre: curso.nombre,
      codigo: curso.codigo,
      descripcion: curso.descripcion || '',
      estado: curso.estado || 'ACTIVO',
      profesorId: curso.profesor?.id || null
    };
    this.showEditModal = true;
  }

  updateCurso(): void {
    if (this.currentCurso?.id) {
      const payload = {
        nombre: this.cursoForm.nombre,
        codigo: this.cursoForm.codigo,
        descripcion: this.cursoForm.descripcion,
        estado: this.cursoForm.estado,
        profesor: this.cursoForm.profesorId ? { id: this.cursoForm.profesorId } : null
      };
      this.adminService.updateCurso(this.currentCurso.id, payload).subscribe({
        next: () => { this.closeModal(); this.loadCursos(); },
        error: () => { alert('Error al actualizar curso'); }
      });
    }
  }

  deleteCurso(id: number | undefined): void {
    if (id && confirm('¿Eliminar curso?')) {
      this.adminService.deleteCurso(id).subscribe({
        next: () => { this.loadCursos(); },
        error: () => { alert('Error al eliminar curso'); }
      });
    }
  }
}

