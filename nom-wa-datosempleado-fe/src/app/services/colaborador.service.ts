import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { 
  Colaborador, 
  ColaboradorCreateRequest, 
  ColaboradorUpdateRequest,
  ColaboradorWithRisk,
  NivelRiesgo,
  Sexo,
  Profesion,
  EstadoCivil,
  Area
} from '../models/colaborador.model';
import { ApiResponse, PaginatedResponse } from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  private readonly baseUrl = 'http://localhost:3000/api'; // Ajustar según la URL del backend

  constructor(private http: HttpClient) {}

  // Colaboradores CRUD
  getColaboradores(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Colaborador>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Colaborador>>>(`${this.baseUrl}/colaboradores`, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  getAllColaboradores(): Observable<Colaborador[]> {
    console.log('🔍 Llamando a getAllColaboradores con paginación:', `${this.baseUrl}/colaboradores`);
    // Usar parámetros de paginación para obtener todos los colaboradores
    const params = new HttpParams()
      .set('page', '1')
      .set('limit', '100'); // Obtener hasta 100 colaboradores por ahora

    return this.http.get<any>(`${this.baseUrl}/colaboradores`, { params })
      .pipe(
        map(response => {
          console.log('✅ Respuesta del backend:', response);
          
          // Manejar la estructura de respuesta del backend: {ok: true, data: {data: [...], total, page, limit}}
          if (response.ok && response.data && response.data.data && Array.isArray(response.data.data)) {
            return response.data.data;
          }
          
          // Fallback: si la respuesta es directamente un array
          if (Array.isArray(response)) {
            return response;
          }
          
          // Fallback: si viene en formato { data: [...] }
          if (response.data && Array.isArray(response.data)) {
            return response.data;
          }
          
          console.warn('⚠️ Estructura de respuesta inesperada:', response);
          return [];
        }),
        catchError(error => {
          console.error('❌ Error en getAllColaboradores:', error);
          return this.handleError(error);
        })
      );
  }

  getColaboradorById(id: number): Observable<Colaborador> {
    return this.http.get<ApiResponse<Colaborador>>(`${this.baseUrl}/colaboradores/${id}`)
      .pipe(
        map(response => {
          const data = response.data;
          if (data && 'id' in data && !('idcolaborador' in data)) {
            (data as any).idcolaborador = (data as any).id;
          }
          return data;
        }),
        catchError(this.handleError)
      );
  }

  createColaborador(colaborador: ColaboradorCreateRequest): Observable<Colaborador> {
    return this.http.post<ApiResponse<Colaborador>>(`${this.baseUrl}/colaboradores`, colaborador)
      .pipe(
        map(response => {
          const data = response.data;
          if (data && 'id' in data && !('idcolaborador' in data)) {
            (data as any).idcolaborador = (data as any).id;
          }
          return data;
        }),
        catchError(this.handleError)
      );
  }

  updateColaborador(colaborador: ColaboradorUpdateRequest): Observable<Colaborador> {
    return this.http.put<ApiResponse<Colaborador>>(`${this.baseUrl}/colaboradores/${colaborador.idcolaborador}`, colaborador)
      .pipe(
        map(response => {
          const data = response.data;
          if (data && 'id' in data && !('idcolaborador' in data)) {
            (data as any).idcolaborador = (data as any).id;
          }
          return data;
        }),
        catchError(this.handleError)
      );
  }

  deleteColaborador(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/colaboradores/${id}`)
      .pipe(
        map(() => undefined),
        catchError(this.handleError)
      );
  }

  // Catálogos
  getSexos(): Observable<Sexo[]> {
    return this.http.get<ApiResponse<Sexo[]>>(`${this.baseUrl}/catalogos/sexos`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  getProfesiones(): Observable<Profesion[]> {
    return this.http.get<ApiResponse<Profesion[]>>(`${this.baseUrl}/catalogos/profesiones`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  getEstadosCiviles(): Observable<EstadoCivil[]> {
    return this.http.get<ApiResponse<EstadoCivil[]>>(`${this.baseUrl}/catalogos/estados_civiles`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  getAreas(): Observable<Area[]> {
    return this.http.get<ApiResponse<Area[]>>(`${this.baseUrl}/catalogos/areas`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  // Utilidades
  calculateNivelRiesgo(edad: number): NivelRiesgo {
    if (edad >= 18 && edad <= 25) {
      return 'FUERA DE PELIGRO';
    } else if (edad >= 26 && edad <= 50) {
      return 'TENGA CUIDADO, TOME TODAS LAS MEDIDAS DE PREVENCIÓN';
    } else {
      return 'POR FAVOR QUEDARSE EN CASA';
    }
  }

  calculateEdadFromFechaNacimiento(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }

  getColaboradoresWithRisk(): Observable<ColaboradorWithRisk[]> {
    return this.getAllColaboradores().pipe(
      map(colaboradores => 
        colaboradores.map(colaborador => {
          const edad = colaborador.edad || this.calculateEdadFromFechaNacimiento(colaborador.fechaNacimiento);
          const nivelRiesgo = this.calculateNivelRiesgo(edad);

          return {
            ...colaborador,
            idcolaborador: (colaborador as any).id || colaborador.idcolaborador,
            edad,
            nivelRiesgo
          };
        })
      )
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en ColaboradorService:', error);
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error?.msg) {
      // Si viene del backend con formato { ok: false, msg: "mensaje" }
      errorMessage = error.error.msg;
      
      // Si hay errores de validación específicos, los agregamos
      if (error.error?.errors && Array.isArray(error.error.errors)) {
        const validationErrors = error.error.errors
          .map((err: any) => `${err.path}: ${err.msg}`)
          .join('\n');
        errorMessage = `${error.error.msg}:\n\n${validationErrors}`;
      }
    } else if (error.error?.errors && Array.isArray(error.error.errors)) {
      // Si solo vienen errores de validación sin mensaje principal
      const validationErrors = error.error.errors
        .map((err: any) => `${err.path}: ${err.msg}`)
        .join('\n');
      errorMessage = `Errores de validación:\n\n${validationErrors}`;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado';
    } else if (error.status === 401) {
      errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
    } else if (error.status === 0) {
      errorMessage = 'No se puede conectar con el servidor. Verifica que el backend esté corriendo.';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
