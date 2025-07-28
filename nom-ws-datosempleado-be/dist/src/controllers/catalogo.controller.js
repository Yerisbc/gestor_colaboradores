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
exports.CatalogoController = void 0;
const catalogo_service_1 = require("../services/catalogo.service");
class CatalogoController {
    /**
     * Obtiene todos los catálogos
     */
    static getAllCatalogos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const catalogos = yield catalogo_service_1.CatalogoService.getAllCatalogos();
                const response = {
                    ok: true,
                    msg: 'Catálogos obtenidos exitosamente',
                    data: catalogos
                };
                res.json(response);
            }
            catch (error) {
                const response = {
                    ok: false,
                    msg: error instanceof Error ? error.message : 'Error al obtener catálogos'
                };
                res.status(500).json(response);
            }
        });
    }
    /**
     * Obtiene catálogo de sexos
     */
    static getSexos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sexos = yield catalogo_service_1.CatalogoService.getSexos();
                const response = {
                    ok: true,
                    msg: 'Sexos obtenidos exitosamente',
                    data: sexos
                };
                res.json(response);
            }
            catch (error) {
                const response = {
                    ok: false,
                    msg: error instanceof Error ? error.message : 'Error al obtener sexos'
                };
                res.status(500).json(response);
            }
        });
    }
    /**
     * Obtiene catálogo de profesiones
     */
    static getProfesiones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profesiones = yield catalogo_service_1.CatalogoService.getProfesiones();
                const response = {
                    ok: true,
                    msg: 'Profesiones obtenidas exitosamente',
                    data: profesiones
                };
                res.json(response);
            }
            catch (error) {
                const response = {
                    ok: false,
                    msg: error instanceof Error ? error.message : 'Error al obtener profesiones'
                };
                res.status(500).json(response);
            }
        });
    }
    /**
     * Obtiene catálogo de estados civiles
     */
    static getEstadosCiviles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const estadosCiviles = yield catalogo_service_1.CatalogoService.getEstadosCiviles();
                const response = {
                    ok: true,
                    msg: 'Estados civiles obtenidos exitosamente',
                    data: estadosCiviles
                };
                res.json(response);
            }
            catch (error) {
                const response = {
                    ok: false,
                    msg: error instanceof Error ? error.message : 'Error al obtener estados civiles'
                };
                res.status(500).json(response);
            }
        });
    }
    /**
     * Obtiene catálogo de áreas
     */
    static getAreas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const areas = yield catalogo_service_1.CatalogoService.getAreas();
                const response = {
                    ok: true,
                    msg: 'Áreas obtenidas exitosamente',
                    data: areas
                };
                res.json(response);
            }
            catch (error) {
                const response = {
                    ok: false,
                    msg: error instanceof Error ? error.message : 'Error al obtener áreas'
                };
                res.status(500).json(response);
            }
        });
    }
}
exports.CatalogoController = CatalogoController;
