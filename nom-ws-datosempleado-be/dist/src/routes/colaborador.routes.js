"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const colaborador_controller_1 = require("../controllers/colaborador.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Aplicar autenticación a todas las rutas
router.use(auth_middleware_1.authenticateToken);
/**
 * @route   GET /api/colaboradores
 * @desc    Obtiene todos los colaboradores con paginación
 * @access  Private
 * @query   page, limit, search, sortBy, sortOrder
 */
router.get('/', colaborador_controller_1.ColaboradorController.getColaboradores);
/**
 * @route   GET /api/colaboradores/:id
 * @desc    Obtiene un colaborador por ID
 * @access  Private
 */
router.get('/:id', colaborador_controller_1.ColaboradorController.getColaboradorById);
/**
 * @route   POST /api/colaboradores
 * @desc    Crea un nuevo colaborador
 * @access  Private
 */
router.post('/', validation_middleware_1.validateColaborador, validation_middleware_1.handleValidationErrors, colaborador_controller_1.ColaboradorController.createColaborador);
/**
 * @route   PUT /api/colaboradores/:id
 * @desc    Actualiza un colaborador (actualización parcial)
 * @access  Private
 */
router.put('/:id', validation_middleware_1.validateColaboradorPatch, validation_middleware_1.handleValidationErrors, colaborador_controller_1.ColaboradorController.updateColaborador);
/**
 * @route   DELETE /api/colaboradores/:id
 * @desc    Elimina (desactiva) un colaborador
 * @access  Private
 */
router.delete('/:id', colaborador_controller_1.ColaboradorController.deleteColaborador);
exports.default = router;
