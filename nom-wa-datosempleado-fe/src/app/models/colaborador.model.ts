export interface Colaborador {
  idcolaborador?: number;
  numeroEmpleado?: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaNacimiento: string; // Formato YYYY-MM-DD
  fechaIngreso: string; // Formato YYYY-MM-DD
  salario: number;
  edad?: number; // Calculado en el backend
  sexoId: number;
  profesionId: number;
  estadoCivilId: number;
  areaId: number;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Relaciones populadas
  sexo?: Sexo;
  profesion?: Profesion;
  estadoCivil?: EstadoCivil;
  area?: Area;
}

export interface Sexo {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Profesion {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface EstadoCivil {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Area {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface ColaboradorCreateRequest {
  numeroEmpleado?: string; // Opcional porque se genera automáticamente
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaNacimiento: string; // Formato YYYY-MM-DD
  fechaIngreso: string; // Formato YYYY-MM-DD
  salario: number;
  sexoId: number;
  profesionId: number;
  estadoCivilId: number;
  areaId: number;
}

export interface ColaboradorUpdateRequest extends Partial<ColaboradorCreateRequest> {
  idcolaborador: number;
}

export type NivelRiesgo = 'FUERA DE PELIGRO' | 'TENGA CUIDADO, TOME TODAS LAS MEDIDAS DE PREVENCIÓN' | 'POR FAVOR QUEDARSE EN CASA';

export interface ColaboradorWithRisk extends Colaborador {
  nivelRiesgo: NivelRiesgo;
}
