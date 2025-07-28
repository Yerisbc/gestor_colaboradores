"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateColaboradorPatch = exports.validateColaborador = exports.validateLogin = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            msg: 'Errores de validación',
            errors: errors.array()
        });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
// Validaciones para login
exports.validateLogin = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .trim()
];
// Validaciones para colaborador
exports.validateColaborador = [
    (0, express_validator_1.body)('numeroEmpleado')
        .optional()
        .isLength({ min: 3, max: 20 })
        .withMessage('El número de empleado debe tener entre 3 y 20 caracteres'),
    (0, express_validator_1.body)('nombre')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    (0, express_validator_1.body)('apellidos')
        .notEmpty()
        .withMessage('Los apellidos son requeridos')
        .isLength({ min: 2, max: 100 })
        .withMessage('Los apellidos deben tener entre 2 y 100 caracteres'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('telefono')
        .optional()
        .isMobilePhone('any')
        .withMessage('Debe ser un número de teléfono válido'),
    (0, express_validator_1.body)('fechaNacimiento')
        .isISO8601()
        .withMessage('La fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD)')
        .custom((value) => {
        const date = new Date(value);
        const now = new Date();
        const age = now.getFullYear() - date.getFullYear();
        if (age < 18 || age > 80) {
            throw new Error('La edad debe estar entre 18 y 80 años');
        }
        return true;
    }),
    (0, express_validator_1.body)('fechaIngreso')
        .isISO8601()
        .withMessage('La fecha de ingreso debe ser una fecha válida (YYYY-MM-DD)')
        .custom((value) => {
        const date = new Date(value);
        const now = new Date();
        if (date > now) {
            throw new Error('La fecha de ingreso no puede ser futura');
        }
        return true;
    }),
    (0, express_validator_1.body)('salario')
        .isFloat({ min: 0.01 })
        .withMessage('El salario debe ser un número positivo mayor a 0'),
    (0, express_validator_1.body)('sexoId')
        .isInt({ min: 1 })
        .withMessage('Debe seleccionar un sexo válido'),
    (0, express_validator_1.body)('profesionId')
        .isInt({ min: 1 })
        .withMessage('Debe seleccionar una profesión válida'),
    (0, express_validator_1.body)('estadoCivilId')
        .isInt({ min: 1 })
        .withMessage('Debe seleccionar un estado civil válido'),
    (0, express_validator_1.body)('areaId')
        .isInt({ min: 1 })
        .withMessage('Debe seleccionar un área válida')
];
// Validación específica para PATCH (campos opcionales)
exports.validateColaboradorPatch = [
    (0, express_validator_1.body)('numeroEmpleado')
        .optional()
        .isLength({ min: 3, max: 20 })
        .withMessage('El número de empleado debe tener entre 3 y 20 caracteres'),
    (0, express_validator_1.body)('nombre')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    (0, express_validator_1.body)('apellidos')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Los apellidos deben tener entre 2 y 100 caracteres'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('telefono')
        .optional()
        .isMobilePhone('any')
        .withMessage('Debe ser un número de teléfono válido'),
    (0, express_validator_1.body)('fechaNacimiento')
        .optional()
        .isISO8601()
        .withMessage('La fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD)')
        .custom((value) => {
        if (value) {
            const date = new Date(value);
            const now = new Date();
            const age = now.getFullYear() - date.getFullYear();
            if (age < 18 || age > 80) {
                throw new Error('La edad debe estar entre 18 y 80 años');
            }
        }
        return true;
    }),
    (0, express_validator_1.body)('fechaIngreso')
        .optional()
        .isISO8601()
        .withMessage('La fecha de ingreso debe ser una fecha válida (YYYY-MM-DD)')
        .custom((value) => {
        if (value) {
            const date = new Date(value);
            const now = new Date();
            if (date > now) {
                throw new Error('La fecha de ingreso no puede ser futura');
            }
        }
        return true;
    }),
    (0, express_validator_1.body)('salario')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('El salario debe ser un número positivo mayor a 0'),
    (0, express_validator_1.body)('sexoId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Debe seleccionar un sexo válido'),
    (0, express_validator_1.body)('profesionId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Debe seleccionar una profesión válida'),
    (0, express_validator_1.body)('estadoCivilId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Debe seleccionar un estado civil válido'),
    (0, express_validator_1.body)('areaId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Debe seleccionar un área válida')
];
