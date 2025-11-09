import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };
  errorMessage = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.authService.login(this.credentials).subscribe({
      next: () => {
        // Determinar el tipo de usuario y redirigir
        const username = this.authService.getUsername();
        if (username) {
          // Por ahora redirigir a admin, luego se puede mejorar la lógica
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (error) => {
        this.errorMessage = 'Credenciales inválidas. Por favor, intente nuevamente.';
        console.error('Login error:', error);
      }
    });
  }
}

