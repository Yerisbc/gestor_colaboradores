import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';

// Middleware para manejar errores de validación
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      msg: 'Errores de validación',
      errors: errors.array()
    });
  }
  
  next();
};

// Validaciones para login
export const validateLogin: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .trim()
];

// Validaciones para colaborador
export const validateColaborador: ValidationChain[] = [
  body('numeroEmpleado')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('El número de empleado debe tener entre 3 y 20 caracteres'),
  
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('apellidos')
    .notEmpty()
    .withMessage('Los apellidos son requeridos')
    .isLength({ min: 2, max: 100 })
    .withMessage('Los apellidos deben tener entre 2 y 100 caracteres'),
  
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('telefono')
    .optional()
    .isMobilePhone('any')
    .withMessage('Debe ser un número de teléfono válido'),
  
  body('fechaNacimiento')
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
  
  body('fechaIngreso')
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
  
  body('salario')
    .isFloat({ min: 0.01 })
    .withMessage('El salario debe ser un número positivo mayor a 0'),
  
  body('sexoId')
    .isInt({ min: 1 })
    .withMessage('Debe seleccionar un sexo válido'),
  
  body('profesionId')
    .isInt({ min: 1 })
    .withMessage('Debe seleccionar una profesión válida'),
  
  body('estadoCivilId')
    .isInt({ min: 1 })
    .withMessage('Debe seleccionar un estado civil válido'),
  
  body('areaId')
    .isInt({ min: 1 })
    .withMessage('Debe seleccionar un área válida')
];

// Validación específica para PATCH (campos opcionales)
export const validateColaboradorPatch: ValidationChain[] = [
  body('numeroEmpleado')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('El número de empleado debe tener entre 3 y 20 caracteres'),
  
  body('nombre')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('apellidos')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Los apellidos deben tener entre 2 y 100 caracteres'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('telefono')
    .optional()
    .isMobilePhone('any')
    .withMessage('Debe ser un número de teléfono válido'),
  
  body('fechaNacimiento')
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
  
  body('fechaIngreso')
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
  
  body('salario')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('El salario debe ser un número positivo mayor a 0'),
  
  body('sexoId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Debe seleccionar un sexo válido'),
  
  body('profesionId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Debe seleccionar una profesión válida'),
  
  body('estadoCivilId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Debe seleccionar un estado civil válido'),
  
  body('areaId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Debe seleccionar un área válida')
];
