import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, take, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.authState$.pipe(
      take(1), // Solo tomar el primer valor emitido
      map(authState => {
        console.log('AuthGuard - Estado de autenticación:', authState); // Para debugging
        
        if (authState.isAuthenticated) {
          return true;
        } else {
          console.log('AuthGuard - Usuario no autenticado, redirigiendo a login');
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
