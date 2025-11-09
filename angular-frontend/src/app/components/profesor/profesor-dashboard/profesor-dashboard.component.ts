import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProfesorService } from '../../../services/profesor.service';
import { AuthService } from '../../../services/auth.service';
import { Curso } from '../../../services/admin.service';

@Component({
  selector: 'app-profesor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profesor-dashboard.component.html',
  styleUrl: './profesor-dashboard.component.css'
})
export class ProfesorDashboardComponent implements OnInit {
  cursos: Curso[] = [];
  profesor: any = null;
  loading = true;

  constructor(
    private profesorService: ProfesorService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.profesorService.getDashboard().subscribe({
      next: (data) => {
        this.profesor = data.profesor;
        this.cursos = data.cursos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

