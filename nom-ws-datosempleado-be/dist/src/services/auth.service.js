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
exports.AuthService = void 0;
const database_1 = __importDefault(require("../utils/database"));
const auth_utils_1 = require("../utils/auth.utils");
class AuthService {
    /**
     * Realiza el login de un usuario
     */
    static login(loginData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = loginData;
            if (!email) {
                throw new Error('Email es requerido');
            }
            // Buscar el usuario por email
            const usuario = yield database_1.default.usuario.findUnique({
                where: { email: email.toLowerCase() },
                select: {
                    id: true,
                    email: true,
                    password: true,
                    nombre: true,
                    activo: true
                }
            });
            if (!usuario) {
                throw new Error('Credenciales inválidas');
            }
            if (!usuario.activo) {
                throw new Error('Usuario inactivo');
            }
            // Verificar la contraseña
            const isValidPassword = yield auth_utils_1.AuthUtils.comparePassword(password, usuario.password);
            if (!isValidPassword) {
                throw new Error('Credenciales inválidas');
            }
            // Generar token
            const token = auth_utils_1.AuthUtils.generateToken({
                userId: usuario.id,
                email: usuario.email
            });
            return {
                token,
                usuario: {
                    id: usuario.id,
                    email: usuario.email,
                    nombre: usuario.nombre
                }
            };
        });
    }
    /**
     * Crear usuario administrador por defecto (solo para desarrollo)
     */
    static createDefaultAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const adminEmail = 'admin@colaboradores.com';
            // Verificar si ya existe
            const existingAdmin = yield database_1.default.usuario.findUnique({
                where: { email: adminEmail }
            });
            if (existingAdmin) {
                return; // Ya existe
            }
            // Crear usuario administrador
            const hashedPassword = yield auth_utils_1.AuthUtils.hashPassword('admin123');
            yield database_1.default.usuario.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    nombre: 'Administrador',
                    activo: true
                }
            });
        });
    }
    /**
     * Obtiene un usuario por ID
     */
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield database_1.default.usuario.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    nombre: true,
                    activo: true
                }
            });
            if (!usuario || !usuario.activo) {
                throw new Error('Usuario no encontrado');
            }
            return {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre
            };
        });
    }
}
exports.AuthService = AuthService;
