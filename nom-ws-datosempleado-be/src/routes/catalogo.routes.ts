import { Router } from 'express';
import { CatalogoController } from '../controllers/catalogo.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

/**
 * @route   GET /api/catalogos
 * @desc    Obtiene todos los catálogos (sexos, profesiones, estados civiles, áreas)
 * @access  Private
 */
router.get('/', CatalogoController.getAllCatalogos);

/**
 * @route   GET /api/catalogos/sexos
 * @desc    Obtiene catálogo de sexos
 * @access  Private
 */
router.get('/sexos', CatalogoController.getSexos);

/**
 * @route   GET /api/catalogos/profesiones
 * @desc    Obtiene catálogo de profesiones
 * @access  Private
 */
router.get('/profesiones', CatalogoController.getProfesiones);

/**
 * @route   GET /api/catalogos/estados-civiles
 * @desc    Obtiene catálogo de estados civiles
 * @access  Private
 */
router.get('/estados_civiles', CatalogoController.getEstadosCiviles);

/**
 * @route   GET /api/catalogos/areas
 * @desc    Obtiene catálogo de áreas
 * @access  Private
 */
router.get('/areas', CatalogoController.getAreas);

export default router;
