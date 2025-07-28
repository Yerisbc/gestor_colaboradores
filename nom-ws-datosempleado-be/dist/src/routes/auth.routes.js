"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/auth/login
 * @desc    Login de usuario
 * @access  Public
 */
router.post('/login', validation_middleware_1.validateLogin, validation_middleware_1.handleValidationErrors, auth_controller_1.AuthController.login);
/**
 * @route   POST /api/auth/verify
 * @desc    Verificar token JWT
 * @access  Private
 */
router.post('/verify', auth_middleware_1.authenticateToken, auth_controller_1.AuthController.verify);
/**
 * @route   POST /api/auth/logout
 * @desc    Logout de usuario
 * @access  Private
 */
router.post('/logout', auth_middleware_1.authenticateToken, auth_controller_1.AuthController.logout);
exports.default = router;
