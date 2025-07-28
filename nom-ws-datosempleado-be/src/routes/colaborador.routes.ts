import { Router } from 'express';
import { ColaboradorController } from '../controllers/colaborador.controller';
import { validateColaborador, validateColaboradorPatch, handleValidationErrors } from '../middleware/validation.middleware';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

/**
 * @route   GET /api/colaboradores
 * @desc    Obtiene todos los colaboradores con paginación
 * @access  Private
 * @query   page, limit, search, sortBy, sortOrder
 */
router.get('/', ColaboradorController.getColaboradores);

/**
 * @route   GET /api/colaboradores/:id
 * @desc    Obtiene un colaborador por ID
 * @access  Private
 */
router.get('/:id', ColaboradorController.getColaboradorById);

/**
 * @route   POST /api/colaboradores
 * @desc    Crea un nuevo colaborador
 * @access  Private
 */
router.post('/', validateColaborador, handleValidationErrors, ColaboradorController.createColaborador);

/**
 * @route   PUT /api/colaboradores/:id
 * @desc    Actualiza un colaborador (actualización parcial)
 * @access  Private
 */
router.put('/:id', validateColaboradorPatch, handleValidationErrors, ColaboradorController.updateColaborador);

/**
 * @route   DELETE /api/colaboradores/:id
 * @desc    Elimina (desactiva) un colaborador
 * @access  Private
 */
router.delete('/:id', ColaboradorController.deleteColaborador);

export default router;
