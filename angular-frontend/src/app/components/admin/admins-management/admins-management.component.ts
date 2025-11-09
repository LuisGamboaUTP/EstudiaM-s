import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Admin } from '../../../services/admin.service';

@Component({
  selector: 'app-admins-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admins-management.component.html',
  styleUrl: './admins-management.component.css'
})
export class AdminsManagementComponent implements OnInit {
  @Input() admins: Admin[] = [];
  showModal = false;
  showEditModal = false;
  currentAdmin: Admin | null = null;
  adminForm: Admin = { nombre: '', codigo: '', email: '', password: '' };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.adminService.getAllAdmins().subscribe({
      next: (admins) => { this.admins = admins; },
      error: (error) => { console.error('Error loading admins:', error); }
    });
  }

  openAddModal(): void {
    this.adminForm = { nombre: '', codigo: '', email: '', password: '' };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.showEditModal = false;
    this.currentAdmin = null;
  }

  saveAdmin(): void {
    this.adminService.createAdmin(this.adminForm).subscribe({
      next: () => { this.closeModal(); this.loadAdmins(); },
      error: () => { alert('Error al guardar administrador'); }
    });
  }

  openEditModal(admin: Admin): void {
    this.currentAdmin = { ...admin };
    this.adminForm = { ...admin };
    this.showEditModal = true;
  }

  updateAdmin(): void {
    if (this.currentAdmin?.id) {
      const updateData = { ...this.adminForm };
      if (!updateData.password) delete updateData.password;
      this.adminService.updateAdmin(this.currentAdmin.id, updateData).subscribe({
        next: () => { this.closeModal(); this.loadAdmins(); },
        error: () => { alert('Error al actualizar administrador'); }
      });
    }
  }

  deleteAdmin(id: number | undefined): void {
    if (id && confirm('¿Eliminar administrador?')) {
      this.adminService.deleteAdmin(id).subscribe({
        next: () => { this.loadAdmins(); },
        error: () => { alert('Error al eliminar administrador'); }
      });
    }
  }
}

