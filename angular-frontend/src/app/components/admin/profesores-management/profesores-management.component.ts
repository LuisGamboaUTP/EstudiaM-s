import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Professor } from '../../../services/admin.service';

@Component({
  selector: 'app-profesores-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profesores-management.component.html',
  styleUrl: './profesores-management.component.css'
})
export class ProfesoresManagementComponent implements OnInit {
  @Input() professors: Professor[] = [];
  showModal = false;
  showEditModal = false;
  currentProfessor: Professor | null = null;
  professorForm: Professor = {
    nombre: '',
    codigo: '',
    email: '',
    especialidad: '',
    password: ''
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadProfessors();
  }

  loadProfessors(): void {
    this.adminService.getAllProfessors().subscribe({
      next: (professors) => {
        this.professors = professors;
      },
      error: (error) => {
        console.error('Error loading professors:', error);
      }
    });
  }

  openAddModal(): void {
    this.professorForm = { nombre: '', codigo: '', email: '', especialidad: '', password: '' };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.showEditModal = false;
    this.currentProfessor = null;
  }

  saveProfessor(): void {
    this.adminService.createProfessor(this.professorForm).subscribe({
      next: () => {
        this.closeModal();
        this.loadProfessors();
      },
      error: (error) => {
        console.error('Error saving professor:', error);
        alert('Error al guardar profesor');
      }
    });
  }

  openEditModal(professor: Professor): void {
    this.currentProfessor = { ...professor };
    this.professorForm = { ...professor };
    this.showEditModal = true;
  }

  updateProfessor(): void {
    if (this.currentProfessor?.id) {
      const updateData = { ...this.professorForm };
      if (!updateData.password) {
        delete updateData.password;
      }
      this.adminService.updateProfessor(this.currentProfessor.id, updateData).subscribe({
        next: () => {
          this.closeModal();
          this.loadProfessors();
        },
        error: (error) => {
          console.error('Error updating professor:', error);
          alert('Error al actualizar profesor');
        }
      });
    }
  }

  deleteProfessor(id: number | undefined): void {
    if (id && confirm('¿Estás seguro de que quieres eliminar este profesor?')) {
      this.adminService.deleteProfessor(id).subscribe({
        next: () => {
          this.loadProfessors();
        },
        error: (error) => {
          console.error('Error deleting professor:', error);
          alert('Error al eliminar profesor');
        }
      });
    }
  }
}

