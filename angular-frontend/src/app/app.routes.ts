import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      }
    ]
  },
  {
    path: 'profesor',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/profesor/profesor-dashboard/profesor-dashboard.component').then(m => m.ProfesorDashboardComponent)
      },
      {
        path: 'calendario',
        loadComponent: () => import('./components/profesor/profesor-dashboard/profesor-dashboard.component').then(m => m.ProfesorDashboardComponent)
      },
      {
        path: 'chat',
        loadComponent: () => import('./components/profesor/profesor-dashboard/profesor-dashboard.component').then(m => m.ProfesorDashboardComponent)
      },
      {
        path: 'configuracion',
        loadComponent: () => import('./components/profesor/profesor-dashboard/profesor-dashboard.component').then(m => m.ProfesorDashboardComponent)
      }
    ]
  },
  {
    path: 'student',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/student/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
      },
      {
        path: 'calendario',
        loadComponent: () => import('./components/student/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
      },
      {
        path: 'chat',
        loadComponent: () => import('./components/student/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
      },
      {
        path: 'configuracion',
        loadComponent: () => import('./components/student/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
      }
    ]
  }
];
