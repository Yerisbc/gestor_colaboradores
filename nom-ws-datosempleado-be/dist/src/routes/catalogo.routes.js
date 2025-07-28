"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catalogo_controller_1 = require("../controllers/catalogo.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Aplicar autenticación a todas las rutas
router.use(auth_middleware_1.authenticateToken);
/**
 * @route   GET /api/catalogos
 * @desc    Obtiene todos los catálogos (sexos, profesiones, estados civiles, áreas)
 * @access  Private
 */
router.get('/', catalogo_controller_1.CatalogoController.getAllCatalogos);
/**
 * @route   GET /api/catalogos/sexos
 * @desc    Obtiene catálogo de sexos
 * @access  Private
 */
router.get('/sexos', catalogo_controller_1.CatalogoController.getSexos);
/**
 * @route   GET /api/catalogos/profesiones
 * @desc    Obtiene catálogo de profesiones
 * @access  Private
 */
router.get('/profesiones', catalogo_controller_1.CatalogoController.getProfesiones);
/**
 * @route   GET /api/catalogos/estados-civiles
 * @desc    Obtiene catálogo de estados civiles
 * @access  Private
 */
router.get('/estados_civiles', catalogo_controller_1.CatalogoController.getEstadosCiviles);
/**
 * @route   GET /api/catalogos/areas
 * @desc    Obtiene catálogo de áreas
 * @access  Private
 */
router.get('/areas', catalogo_controller_1.CatalogoController.getAreas);
exports.default = router;
