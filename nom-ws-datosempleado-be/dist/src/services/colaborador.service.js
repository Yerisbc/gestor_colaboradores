"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColaboradorService = void 0;
const database_1 = __importDefault(require("../utils/database"));
class ColaboradorService {
    /**
     * Método helper para validar unicidad de email
     */
    static validateEmailUniqueness(email, excludeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingEmail = yield database_1.default.colaborador.findFirst({
                where: Object.assign({ email: email.toLowerCase(), activo: true }, (excludeId && { NOT: { id: excludeId } }))
            });
            if (existingEmail) {
                throw new Error('El email ya está registrado');
            }
        });
    }
    /**
     * Método helper para validar unicidad de número de empleado
     */
    static validateNumeroEmpleadoUniqueness(numeroEmpleado, excludeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingNumero = yield database_1.default.colaborador.findFirst({
                where: Object.assign({ numeroEmpleado, activo: true }, (excludeId && { NOT: { id: excludeId } }))
            });
            if (existingNumero) {
                throw new Error('El número de empleado ya existe');
            }
        });
    }
    /**
     * Obtiene todos los colaboradores con paginación y filtros
     */
    static getColaboradores(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = params;
            const skip = (page - 1) * limit;
            // Construir filtro de búsqueda
            const searchFilter = search ? {
                OR: [
                    { nombre: { contains: search, mode: 'insensitive' } },
                    { apellidos: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { numeroEmpleado: { contains: search, mode: 'insensitive' } }
                ]
            } : {};
            // Configurar ordenamiento
            const orderBy = { [sortBy]: sortOrder };
            // Obtener colaboradores
            const [colaboradores, total] = yield Promise.all([
                database_1.default.colaborador.findMany({
                    where: Object.assign({ activo: true }, searchFilter),
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
                database_1.default.colaborador.count({
                    where: Object.assign({ activo: true }, searchFilter)
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
        });
    }
    /**
     * Obtiene un colaborador por ID
     */
    static getColaboradorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const colaborador = yield database_1.default.colaborador.findFirst({
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
        });
    }
    /**
     * Crea un nuevo colaborador
     */
    static createColaborador(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar que el email no exista
            yield ColaboradorService.validateEmailUniqueness(data.email);
            // Crear colaborador sin número de empleado primero
            const colaborador = yield database_1.default.colaborador.create({
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
            const colaboradorActualizado = yield database_1.default.colaborador.update({
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
        });
    }
    /**
     * Actualiza un colaborador (actualización parcial)
     */
    static updateColaborador(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar que el colaborador existe
            const existingColaborador = yield database_1.default.colaborador.findFirst({
                where: { id, activo: true }
            });
            if (!existingColaborador) {
                throw new Error('Colaborador no encontrado');
            }
            // Verificar unicidad del número de empleado solo si se está actualizando
            if (data.numeroEmpleado && data.numeroEmpleado !== existingColaborador.numeroEmpleado) {
                yield ColaboradorService.validateNumeroEmpleadoUniqueness(data.numeroEmpleado, id);
            }
            // Verificar unicidad del email solo si se está actualizando
            if (data.email && data.email.toLowerCase() !== existingColaborador.email) {
                yield ColaboradorService.validateEmailUniqueness(data.email, id);
            }
            // Preparar datos para actualización (solo campos presentes)
            const updateData = {};
            if (data.numeroEmpleado !== undefined)
                updateData.numeroEmpleado = data.numeroEmpleado;
            if (data.nombre !== undefined)
                updateData.nombre = data.nombre;
            if (data.apellidos !== undefined)
                updateData.apellidos = data.apellidos;
            if (data.email !== undefined)
                updateData.email = data.email.toLowerCase();
            if (data.telefono !== undefined)
                updateData.telefono = data.telefono;
            if (data.fechaNacimiento !== undefined)
                updateData.fechaNacimiento = new Date(data.fechaNacimiento);
            if (data.fechaIngreso !== undefined)
                updateData.fechaIngreso = new Date(data.fechaIngreso);
            if (data.salario !== undefined)
                updateData.salario = data.salario;
            if (data.sexoId !== undefined)
                updateData.sexoId = data.sexoId;
            if (data.profesionId !== undefined)
                updateData.profesionId = data.profesionId;
            if (data.estadoCivilId !== undefined)
                updateData.estadoCivilId = data.estadoCivilId;
            if (data.areaId !== undefined)
                updateData.areaId = data.areaId;
            // Actualizar colaborador solo con los campos proporcionados
            const colaborador = yield database_1.default.colaborador.update({
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
        });
    }
    /**
     * Elimina (desactiva) un colaborador
     */
    static deleteColaborador(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const colaborador = yield database_1.default.colaborador.findFirst({
                where: { id, activo: true }
            });
            if (!colaborador) {
                throw new Error('Colaborador no encontrado');
            }
            yield database_1.default.colaborador.update({
                where: { id },
                data: { activo: false }
            });
        });
    }
    /**
     * Mapea un colaborador de Prisma a la respuesta de la API
     */
    static mapColaboradorToResponse(colaborador) {
        // Calcular edad
        const today = new Date();
        const birthDate = new Date(colaborador.fechaNacimiento);
        let edad = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            edad--;
        }
        // Calcular riesgo
        let riesgo;
        if (edad <= 27)
            riesgo = 'Alto';
        else if (edad <= 35)
            riesgo = 'Medio';
        else
            riesgo = 'Bajo';
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
exports.ColaboradorService = ColaboradorService;
