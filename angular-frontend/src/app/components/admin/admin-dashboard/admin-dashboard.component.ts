import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AdminService, DashboardData } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';
import { EstudiantesManagementComponent } from '../estudiantes-management/estudiantes-management.component';
import { ProfesoresManagementComponent } from '../profesores-management/profesores-management.component';
import { AdminsManagementComponent } from '../admins-management/admins-management.component';
import { CursosManagementComponent } from '../cursos-management/cursos-management.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    EstudiantesManagementComponent,
    ProfesoresManagementComponent,
    AdminsManagementComponent,
    CursosManagementComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  dashboardData: DashboardData | null = null;
  activeSection = 'estudiantes';
  loading = true;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.adminService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.loading = false;
      }
    });
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

