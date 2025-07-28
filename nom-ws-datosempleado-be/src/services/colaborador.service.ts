import prisma from '../utils/database';
import { ColaboradorRequest, ColaboradorResponse, PaginationParams, PaginatedResponse } from '../types/api.types';

export class ColaboradorService {
  /**
   * Método helper para validar unicidad de email
   */
  private static async validateEmailUniqueness(email: string, excludeId?: number): Promise<void> {
    const existingEmail = await prisma.colaborador.findFirst({
      where: {
        email: email.toLowerCase(),
        activo: true,
        ...(excludeId && { NOT: { id: excludeId } })
      }
    });

    if (existingEmail) {
      throw new Error('El email ya está registrado');
    }
  }

  /**
   * Método helper para validar unicidad de número de empleado
   */
  private static async validateNumeroEmpleadoUniqueness(numeroEmpleado: string, excludeId?: number): Promise<void> {
    const existingNumero = await prisma.colaborador.findFirst({
      where: {
        numeroEmpleado,
        activo: true,
        ...(excludeId && { NOT: { id: excludeId } })
      }
    });

    if (existingNumero) {
      throw new Error('El número de empleado ya existe');
    }
  }

  /**
   * Obtiene todos los colaboradores con paginación y filtros
   */
  static async getColaboradores(params: PaginationParams): Promise<PaginatedResponse<ColaboradorResponse>> {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params;

    const skip = (page - 1) * limit;

    // Construir filtro de búsqueda
    const searchFilter = search ? {
      OR: [
        { nombre: { contains: search, mode: 'insensitive' as const } },
        { apellidos: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { numeroEmpleado: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    // Configurar ordenamiento
    const orderBy = { [sortBy]: sortOrder };

    // Obtener colaboradores
    const [colaboradores, total] = await Promise.all([
      prisma.colaborador.findMany({
        where: {
          activo: true,
          ...searchFilter
        },
        include: {
          sexo: true,
          profesion: true,
          estadoCivil: true,
          area: true
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.colaborador.count({
        where: {
          activo: true,
          ...searchFilter
        }
      })
    ]);

    // Mapear datos y calcular edad y riesgo
    const colaboradoresResponse = colaboradores.map(ColaboradorService.mapColaboradorToResponse);

    return {
      data: colaboradoresResponse,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Obtiene un colaborador por ID
   */
  static async getColaboradorById(id: number): Promise<ColaboradorResponse> {
    const colaborador = await prisma.colaborador.findFirst({
      where: {
        id,
        activo: true
      },
      include: {
        sexo: true,
        profesion: true,
        estadoCivil: true,
        area: true
      }
    });

    if (!colaborador) {
      throw new Error('Colaborador no encontrado');
    }

    return ColaboradorService.mapColaboradorToResponse(colaborador);
  }

  /**
   * Crea un nuevo colaborador
   */
  static async createColaborador(data: ColaboradorRequest): Promise<ColaboradorResponse> {
    // Verificar que el email no exista
    await ColaboradorService.validateEmailUniqueness(data.email);

    // Crear colaborador sin número de empleado primero
    const colaborador = await prisma.colaborador.create({
      data: {
        numeroEmpleado: 'TEMP', // Temporal, se actualizará después
        nombre: data.nombre,
        apellidos: data.apellidos,
        email: data.email.toLowerCase(),
        telefono: data.telefono,
        fechaNacimiento: new Date(data.fechaNacimiento),
        fechaIngreso: new Date(data.fechaIngreso),
        salario: data.salario,
        sexoId: data.sexoId,
        profesionId: data.profesionId,
        estadoCivilId: data.estadoCivilId,
        areaId: data.areaId
      },
      include: {
        sexo: true,
        profesion: true,
        estadoCivil: true,
        area: true
      }
    });

    // Actualizar el número de empleado con 'EMP' + ID
    const colaboradorActualizado = await prisma.colaborador.update({
      where: { id: colaborador.id },
      data: {
        numeroEmpleado: `EMP${colaborador.id}`
      },
      include: {
        sexo: true,
        profesion: true,
        estadoCivil: true,
        area: true
      }
    });

    return ColaboradorService.mapColaboradorToResponse(colaboradorActualizado);
  }

  /**
   * Actualiza un colaborador (actualización parcial)
   */
  static async updateColaborador(id: number, data: Partial<ColaboradorRequest>): Promise<ColaboradorResponse> {
    // Verificar que el colaborador existe
    const existingColaborador = await prisma.colaborador.findFirst({
      where: { id, activo: true }
    });

    if (!existingColaborador) {
      throw new Error('Colaborador no encontrado');
    }

    // Verificar unicidad del número de empleado solo si se está actualizando
    if (data.numeroEmpleado && data.numeroEmpleado !== existingColaborador.numeroEmpleado) {
      await ColaboradorService.validateNumeroEmpleadoUniqueness(data.numeroEmpleado, id);
    }

    // Verificar unicidad del email solo si se está actualizando
    if (data.email && data.email.toLowerCase() !== existingColaborador.email) {
      await ColaboradorService.validateEmailUniqueness(data.email, id);
    }

    // Preparar datos para actualización (solo campos presentes)
    const updateData: any = {};
    
    if (data.numeroEmpleado !== undefined) updateData.numeroEmpleado = data.numeroEmpleado;
    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.apellidos !== undefined) updateData.apellidos = data.apellidos;
    if (data.email !== undefined) updateData.email = data.email.toLowerCase();
    if (data.telefono !== undefined) updateData.telefono = data.telefono;
    if (data.fechaNacimiento !== undefined) updateData.fechaNacimiento = new Date(data.fechaNacimiento);
    if (data.fechaIngreso !== undefined) updateData.fechaIngreso = new Date(data.fechaIngreso);
    if (data.salario !== undefined) updateData.salario = data.salario;
    if (data.sexoId !== undefined) updateData.sexoId = data.sexoId;
    if (data.profesionId !== undefined) updateData.profesionId = data.profesionId;
    if (data.estadoCivilId !== undefined) updateData.estadoCivilId = data.estadoCivilId;
    if (data.areaId !== undefined) updateData.areaId = data.areaId;

    // Actualizar colaborador solo con los campos proporcionados
    const colaborador = await prisma.colaborador.update({
      where: { id },
      data: updateData,
      include: {
        sexo: true,
        profesion: true,
        estadoCivil: true,
        area: true
      }
    });

    return ColaboradorService.mapColaboradorToResponse(colaborador);
  }

  /**
   * Elimina (desactiva) un colaborador
   */
  static async deleteColaborador(id: number): Promise<void> {
    const colaborador = await prisma.colaborador.findFirst({
      where: { id, activo: true }
    });

    if (!colaborador) {
      throw new Error('Colaborador no encontrado');
    }

    await prisma.colaborador.update({
      where: { id },
      data: { activo: false }
    });
  }

  /**
   * Mapea un colaborador de Prisma a la respuesta de la API
   */
  private static mapColaboradorToResponse(colaborador: any): ColaboradorResponse {
    // Calcular edad
    const today = new Date();
    const birthDate = new Date(colaborador.fechaNacimiento);
    let edad = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      edad--;
    }

    // Calcular riesgo
    let riesgo: 'Bajo' | 'Medio' | 'Alto';
    if (edad <= 27) riesgo = 'Alto';
    else if (edad <= 35) riesgo = 'Medio';
    else riesgo = 'Bajo';

    return {
      id: colaborador.id,
      numeroEmpleado: colaborador.numeroEmpleado,
      nombre: colaborador.nombre,
      apellidos: colaborador.apellidos,
      email: colaborador.email,
      telefono: colaborador.telefono,
      fechaNacimiento: colaborador.fechaNacimiento.toISOString().split('T')[0],
      fechaIngreso: colaborador.fechaIngreso.toISOString().split('T')[0],
      salario: Number(colaborador.salario),
      activo: colaborador.activo,
      sexo: {
        id: colaborador.sexo.id,
        nombre: colaborador.sexo.nombre,
        activo: colaborador.sexo.activo
      },
      profesion: {
        id: colaborador.profesion.id,
        nombre: colaborador.profesion.nombre,
        activo: colaborador.profesion.activo
      },
      estadoCivil: {
        id: colaborador.estadoCivil.id,
        nombre: colaborador.estadoCivil.nombre,
        activo: colaborador.estadoCivil.activo
      },
      area: {
        id: colaborador.area.id,
        nombre: colaborador.area.nombre,
        activo: colaborador.area.activo
      },
      edad,
      riesgo,
      createdAt: colaborador.createdAt.toISOString(),
      updatedAt: colaborador.updatedAt.toISOString()
    };
  }

}
