// Tipos para la API de Colaboradores

export interface ApiResponse<T = any> {
  ok: boolean;
  msg: string;
  data?: T;
  errors?: any;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    email: string;
    nombre: string;
  };
}

export interface ColaboradorRequest {
  numeroEmpleado?: string; // Opcional, se genera automáticamente si no se proporciona
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  fechaNacimiento: string; // ISO date string
  fechaIngreso: string; // ISO date string
  salario: number;
  sexoId: number;
  profesionId: number;
  estadoCivilId: number;
  areaId: number;
}

export interface ColaboradorResponse {
  id: number;
  numeroEmpleado: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  fechaNacimiento: string;
  fechaIngreso: string;
  salario: number;
  activo: boolean;
  sexo: CatalogoItem;
  profesion: CatalogoItem;
  estadoCivil: CatalogoItem;
  area: CatalogoItem;
  edad?: number;
  riesgo?: 'Bajo' | 'Medio' | 'Alto';
  createdAt: string;
  updatedAt: string;
}

export interface CatalogoItem {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
