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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    /**
     * Endpoint para login
     */
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loginData = req.body;
                const result = yield auth_service_1.AuthService.login(loginData);
                const response = {
                    ok: true,
                    msg: 'Login exitoso',
                    data: result
                };
                res.json(response);
            }
            catch (error) {
                const response = {
                    ok: false,
                    msg: error instanceof Error ? error.message : 'Error en el login'
                };
                res.status(400).json(response);
            }
        });
    }
    /**
     * Endpoint para verificar el token (middleware auth ya lo verifica)
     */
    static verifyToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = {
                    ok: true,
                    msg: 'Token válido',
                    data: {
                        usuario: req.user
                    }
                };
                res.json(response);
            }
            catch (error) {
                const response = {
                    ok: false,
                    msg: 'Token inválido'
                };
                res.status(401).json(response);
            }
        });
    }
    /**
     * Endpoint para logout (solo respuesta, el frontend maneja la eliminación del token)
     */
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = {
                    ok: true,
                    msg: 'Logout exitoso'
                };
                res.json(response);
            }
            catch (error) {
                const response = {
                    ok: false,
                    msg: 'Error en el logout'
                };
                res.status(500).json(response);
            }
        });
    }
    /**
     * Endpoint para verificar si un token es válido
     */
    static verify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Si llegamos aquí, el middleware de autenticación ya validó el token
                // req.user contiene la información del usuario decodificada del token
                const user = req.user;
                // Obtener información completa del usuario desde la base de datos
                const usuario = yield auth_service_1.AuthService.getUserById(user.userId);
                const response = {
                    ok: true,
                    msg: 'Token válido',
                    data: {
                        usuario: usuario
                    }
                };
                res.json(response);
            }
            catch (error) {
                const response = {
                    ok: false,
                    msg: 'Token inválido'
                };
                res.status(401).json(response);
            }
        });
    }
}
exports.AuthController = AuthController;
