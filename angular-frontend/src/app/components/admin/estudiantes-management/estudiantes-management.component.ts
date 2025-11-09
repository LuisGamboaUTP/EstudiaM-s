import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Student } from '../../../services/admin.service';

@Component({
  selector: 'app-estudiantes-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiantes-management.component.html',
  styleUrl: './estudiantes-management.component.css'
})
export class EstudiantesManagementComponent implements OnInit {
  @Input() students: Student[] = [];
  showModal = false;
  showEditModal = false;
  currentStudent: Student | null = null;
  studentForm: Student = {
    nombre: '',
    codigo: '',
    email: '',
    password: ''
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.adminService.getAllStudents().subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (error) => {
        console.error('Error loading students:', error);
      }
    });
  }

  openAddModal(): void {
    this.studentForm = { nombre: '', codigo: '', email: '', password: '' };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.showEditModal = false;
    this.currentStudent = null;
  }

  saveStudent(): void {
    this.adminService.createStudent(this.studentForm).subscribe({
      next: () => {
        this.closeModal();
        this.loadStudents();
      },
      error: (error) => {
        console.error('Error saving student:', error);
        alert('Error al guardar estudiante');
      }
    });
  }

  openEditModal(student: Student): void {
    this.currentStudent = { ...student };
    this.studentForm = { ...student };
    this.showEditModal = true;
  }

  updateStudent(): void {
    if (this.currentStudent?.id) {
      const updateData = { ...this.studentForm };
      if (!updateData.password) {
        delete updateData.password;
      }
      this.adminService.updateStudent(this.currentStudent.id, updateData).subscribe({
        next: () => {
          this.closeModal();
          this.loadStudents();
        },
        error: (error) => {
          console.error('Error updating student:', error);
          alert('Error al actualizar estudiante');
        }
      });
    }
  }

  deleteStudent(id: number | undefined): void {
    if (id && confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
      this.adminService.deleteStudent(id).subscribe({
        next: () => {
          this.loadStudents();
        },
        error: (error) => {
          console.error('Error deleting student:', error);
          alert('Error al eliminar estudiante');
        }
      });
    }
  }
}

