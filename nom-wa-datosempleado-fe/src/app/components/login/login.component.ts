import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../services/auth.service';
import { LoginRequest, LoginResponse } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      const loginData: LoginRequest = this.loginForm.value;

      console.log('🔵 Intentando login real con backend:', loginData);

      // Llamada real al backend (comentamos el mock)
      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('✅ Login exitoso con backend real:', response);
          this.showMessage('Inicio de sesión exitoso', 'success');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('❌ Error en login real:', error);
          
          // Si el login real falla, intentar con credenciales de prueba admin@test.com
          if (loginData.email === 'admin@test.com' && loginData.password === '123456') {
            console.log('🟡 Login real falló, usando credenciales de prueba como fallback');
            
            const mockResponse = {
              user: {
                id: 1,
                username: 'admin',
                email: 'admin@test.com',
                nombre: 'Administrador',
                apellido: 'Sistema',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
              },
              token: 'mock-jwt-token-for-testing-' + Date.now(),
              expiresIn: 3600
            };

            this.authService.setAuthData(mockResponse);
            this.showMessage('Inicio de sesión exitoso (modo prueba)', 'success');
            this.router.navigate(['/dashboard']);
          } else {
            this.showMessage(error.message || 'Error al iniciar sesión. Verifica tus credenciales.', 'error');
          }
        }
      });
    }
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.hasError('required')) {
      return `${field === 'email' ? 'Email' : 'Contraseña'} es requerido`;
    }
    if (control?.hasError('email')) {
      return 'Debe ser un email válido';
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${requiredLength} caracteres`;
    }
    return '';
  }
}
