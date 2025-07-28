import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateLogin, handleValidationErrors } from '../middleware/validation.middleware';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuario
 * @access  Public
 */
router.post('/login', validateLogin, handleValidationErrors, AuthController.login);

/**
 * @route   POST /api/auth/verify
 * @desc    Verificar token JWT
 * @access  Private
 */
router.post('/verify', authenticateToken, AuthController.verify);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout de usuario
 * @access  Private
 */
router.post('/logout', authenticateToken, AuthController.logout);

export default router;
