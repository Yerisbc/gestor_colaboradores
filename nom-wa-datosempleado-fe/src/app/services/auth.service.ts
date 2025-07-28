import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { 
  User, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  AuthState 
} from '../models/auth.model';
import { ApiResponse } from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:3000/api/auth'; 
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';

  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userJson = localStorage.getItem(this.userKey);
    
    if (token && userJson) {
      try {
        const user: User = JSON.parse(userJson);
        
        this.authStateSubject.next({
          isAuthenticated: true,
          user,
          token
        });
      } catch (error) {
        console.error('AuthService - Error al parsear usuario del localStorage:', error);
        this.logout();
      }
    } else {
      this.authStateSubject.next({
        isAuthenticated: false,
        user: null,
        token: null
      });
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.baseUrl}/login`, credentials)
      .pipe(
        map(response => response.data),
        tap(loginResponse => {
          this.setAuthData(loginResponse);
        }),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<User> {
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/register`, userData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    
    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      token: null
    });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/me`)
      .pipe(
        map(response => response.data),
        tap(user => {
          const currentState = this.authStateSubject.value;
          this.authStateSubject.next({
            ...currentState,
            user
          });
          localStorage.setItem(this.userKey, JSON.stringify(user));
        }),
        catchError(this.handleError)
      );
  }

  refreshToken(): Observable<LoginResponse> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.baseUrl}/refresh`, {})
      .pipe(
        map(response => response.data),
        tap(loginResponse => {
          this.setAuthData(loginResponse);
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  getToken(): string | null {
    return this.authStateSubject.value.token;
  }

  getUser(): User | null {
    return this.authStateSubject.value.user;
  }

  public setAuthData(loginResponse: LoginResponse): void {
    localStorage.setItem(this.tokenKey, loginResponse.token);
    localStorage.setItem(this.userKey, JSON.stringify(loginResponse.user));
    
    this.authStateSubject.next({
      isAuthenticated: true,
      user: loginResponse.user,
      token: loginResponse.token
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en AuthService:', error);
    let errorMessage = 'Error de autenticación';
    
    if (error.error?.msg) {
      // Si viene del backend con formato { ok: false, msg: "mensaje" }
      errorMessage = error.error.msg;
    } else if (error.error?.errors && Array.isArray(error.error.errors)) {
      // Si viene del backend con errores de validación
      const validationErrors = error.error.errors.map((err: any) => err.msg).join(', ');
      errorMessage = `Errores de validación: ${validationErrors}`;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 401) {
      errorMessage = 'Credenciales inválidas';
    } else if (error.status === 0) {
      errorMessage = 'No se puede conectar con el servidor. Verifica que el backend esté corriendo.';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
