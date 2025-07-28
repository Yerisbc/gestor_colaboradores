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
exports.CatalogoService = void 0;
const database_1 = __importDefault(require("../utils/database"));
class CatalogoService {
    /**
     * Obtiene todos los catálogos activos
     */
    static getAllCatalogos() {
        return __awaiter(this, void 0, void 0, function* () {
            const [sexos, profesiones, estadosCiviles, areas] = yield Promise.all([
                this.getSexos(),
                this.getProfesiones(),
                this.getEstadosCiviles(),
                this.getAreas()
            ]);
            return {
                sexos,
                profesiones,
                estadosCiviles,
                areas
            };
        });
    }
    /**
     * Obtiene todos los sexos activos
     */
    static getSexos() {
        return __awaiter(this, void 0, void 0, function* () {
            const sexos = yield database_1.default.sexo.findMany({
                where: { activo: true },
                orderBy: { nombre: 'asc' }
            });
            return sexos.map((item) => ({
                id: item.id,
                nombre: item.nombre,
                activo: item.activo
            }));
        });
    }
    /**
     * Obtiene todas las profesiones activas
     */
    static getProfesiones() {
        return __awaiter(this, void 0, void 0, function* () {
            const profesiones = yield database_1.default.profesion.findMany({
                where: { activo: true },
                orderBy: { nombre: 'asc' }
            });
            return profesiones.map((item) => ({
                id: item.id,
                nombre: item.nombre,
                activo: item.activo
            }));
        });
    }
    /**
     * Obtiene todos los estados civiles activos
     */
    static getEstadosCiviles() {
        return __awaiter(this, void 0, void 0, function* () {
            const estadosCiviles = yield database_1.default.estadoCivil.findMany({
                where: { activo: true },
                orderBy: { nombre: 'asc' }
            });
            return estadosCiviles.map((item) => ({
                id: item.id,
                nombre: item.nombre,
                activo: item.activo
            }));
        });
    }
    /**
     * Obtiene todas las áreas activas
     */
    static getAreas() {
        return __awaiter(this, void 0, void 0, function* () {
            const areas = yield database_1.default.area.findMany({
                where: { activo: true },
                orderBy: { nombre: 'asc' }
            });
            return areas.map((item) => ({
                id: item.id,
                nombre: item.nombre,
                activo: item.activo
            }));
        });
    }
    /**
     * Crear datos iniciales de catálogos (seed)
     */
    static seedCatalogos() {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar si ya existen datos
            const [sexosCount, profesionesCount, estadosCount, areasCount] = yield Promise.all([
                database_1.default.sexo.count(),
                database_1.default.profesion.count(),
                database_1.default.estadoCivil.count(),
                database_1.default.area.count()
            ]);
            // Crear sexos si no existen
            if (sexosCount === 0) {
                yield database_1.default.sexo.createMany({
                    data: [
                        { nombre: 'Masculino' },
                        { nombre: 'Femenino' },
                        { nombre: 'Otro' }
                    ]
                });
            }
            // Crear profesiones si no existen
            if (profesionesCount === 0) {
                yield database_1.default.profesion.createMany({
                    data: [
                        { nombre: 'Desarrollador Frontend' },
                        { nombre: 'Desarrollador Backend' },
                        { nombre: 'Desarrollador Full Stack' },
                        { nombre: 'DevOps Engineer' },
                        { nombre: 'Analista de Sistemas' },
                        { nombre: 'Diseñador UX/UI' },
                        { nombre: 'Product Manager' },
                        { nombre: 'Scrum Master' },
                        { nombre: 'QA Tester' },
                        { nombre: 'Data Scientist' },
                        { nombre: 'Arquitecto de Software' },
                        { nombre: 'Administrador de Base de Datos' }
                    ]
                });
            }
            // Crear estados civiles si no existen
            if (estadosCount === 0) {
                yield database_1.default.estadoCivil.createMany({
                    data: [
                        { nombre: 'Soltero(a)' },
                        { nombre: 'Casado(a)' },
                        { nombre: 'Divorciado(a)' },
                        { nombre: 'Viudo(a)' },
                        { nombre: 'Unión Libre' }
                    ]
                });
            }
            // Crear áreas si no existen
            if (areasCount === 0) {
                yield database_1.default.area.createMany({
                    data: [
                        { nombre: 'Desarrollo de Software' },
                        { nombre: 'Infraestructura y DevOps' },
                        { nombre: 'Análisis y Diseño' },
                        { nombre: 'Gestión de Proyectos' },
                        { nombre: 'Calidad y Testing' },
                        { nombre: 'Datos y Analytics' },
                        { nombre: 'Soporte Técnico' },
                        { nombre: 'Recursos Humanos' },
                        { nombre: 'Administración' },
                        { nombre: 'Ventas y Marketing' }
                    ]
                });
            }
        });
    }
}
exports.CatalogoService = CatalogoService;
