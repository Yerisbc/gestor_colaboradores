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
exports.ColaboradorController = void 0;
const colaborador_service_1 = require("../services/colaborador.service");
class ColaboradorController {
    /**
     * Obtiene todos los colaboradores con paginación
     */
    static getColaboradores(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    page: req.query.page ? parseInt(req.query.page) : 1,
                    limit: req.query.limit ? parseInt(req.query.limit) : 10,
                    search: req.query.search || '',
                    sortBy: req.query.sortBy || 'createdAt',
                    sortOrder: req.query.sortOrder || 'desc'
                };
                const result = yield colaborador_service_1.ColaboradorService.getColaboradores(params);
                const response = {
                    ok: true,
                    msg: 'Colaboradores obtenidos exitosamente',
                    data: result
                };
                res.json(response);
            }
            catch (error) {
                const response = {
                    ok: false,
                    msg: error instanceof Error ? error.message : 'Error al obtener colaboradores'
                };
                res.status(500).json(response);
            }
        });
    }
    /**
     * Obtiene un colaborador por ID
     */
    static getColaboradorById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    const response = {
                        ok: false,
                        msg: 'ID inválido'
                    };
                    return res.status(400).json(response);
                }
                const colaborador = yield colaborador_service_1.ColaboradorService.getColaboradorById(id);
                const response = {
                    ok: true,
                    msg: 'Colaborador obtenido exitosamente',
                    data: colaborador
                };
                res.json(response);
            }
            catch (error) {
                const response = {
                    ok: false,
                    msg: error instanceof Error ? error.message : 'Error al obtener colaborador'
                };
                const statusCode = error instanceof Error && error.message === 'Colaborador no encontrado' ? 404 : 500;
                res.status(statusCode).json(response);
            }
        });
    }
    /**
     * Crea un nuevo colaborador
     */
    static createColaborador(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const colaboradorData = req.body;
                const colaborador = yield colaborador_service_1.ColaboradorService.createColaborador(colaboradorData);
                const response = {
                    ok: true,
                    msg: 'Colaborador creado exitosamente',
                    data: colaborador
                };
                res.status(201).json(response);
            }
            catch (error) {
                const response = {
                    ok: false,
                    msg: error instanceof Error ? error.message : 'Error al crear colaborador'
                };
                res.status(400).json(response);
            }
        });
    }
    /**
     * Actualiza un colaborador (actualización parcial)
     */
    static updateColaborador(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    const response = {
                        ok: false,
                        msg: 'ID inválido'
                    };
                    return res.status(400).json(response);
                }
                const colaboradorData = req.body;
                const colaborador = yield colaborador_service_1.ColaboradorService.updateColaborador(id, colaboradorData);
                const response = {
                    ok: true,
                    msg: 'Colaborador actualizado exitosamente',
                    data: colaborador
                };
                res.json(response);
            }
            catch (error) {
                const response = {
                    ok: false,
                    msg: error instanceof Error ? error.message : 'Error al actualizar colaborador'
                };
                const statusCode = error instanceof Error && error.message === 'Colaborador no encontrado' ? 404 : 400;
                res.status(statusCode).json(response);
            }
        });
    }
    /**
     * Elimina (desactiva) un colaborador
     */
    static deleteColaborador(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    const response = {
                        ok: false,
                        msg: 'ID inválido'
                    };
                    return res.status(400).json(response);
                }
                yield colaborador_service_1.ColaboradorService.deleteColaborador(id);
                const response = {
                    ok: true,
                    msg: 'Colaborador eliminado exitosamente'
                };
                res.json(response);
            }
            catch (error) {
                const response = {
                    ok: false,
                    msg: error instanceof Error ? error.message : 'Error al eliminar colaborador'
                };
                const statusCode = error instanceof Error && error.message === 'Colaborador no encontrado' ? 404 : 500;
                res.status(statusCode).json(response);
            }
        });
    }
}
exports.ColaboradorController = ColaboradorController;
