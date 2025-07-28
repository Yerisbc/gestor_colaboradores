import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse, LoginRequest } from '../types/api.types';

export class AuthController {
  /**
   * Endpoint para login
   */
  static async login(req: Request, res: Response) {
    try {
      const loginData: LoginRequest = req.body;
      
      const result = await AuthService.login(loginData);
      
      const response: ApiResponse = {
        ok: true,
        msg: 'Login exitoso',
        data: result
      };
      
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        ok: false,
        msg: error instanceof Error ? error.message : 'Error en el login'
      };
      
      res.status(400).json(response);
    }
  }

  /**
   * Endpoint para verificar el token (middleware auth ya lo verifica)
   */
  static async verifyToken(req: Request, res: Response) {
    try {
      const response: ApiResponse = {
        ok: true,
        msg: 'Token válido',
        data: {
          usuario: req.user
        }
      };
      
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        ok: false,
        msg: 'Token inválido'
      };
      
      res.status(401).json(response);
    }
  }

  /**
   * Endpoint para logout (solo respuesta, el frontend maneja la eliminación del token)
   */
  static async logout(req: Request, res: Response) {
    try {
      const response: ApiResponse = {
        ok: true,
        msg: 'Logout exitoso'
      };
      
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        ok: false,
        msg: 'Error en el logout'
      };
      
      res.status(500).json(response);
    }
  }

  /**
   * Endpoint para verificar si un token es válido
   */
  static async verify(req: Request, res: Response) {
    try {
      // Si llegamos aquí, el middleware de autenticación ya validó el token
      // req.user contiene la información del usuario decodificada del token
      const user = (req as any).user;
      
      // Obtener información completa del usuario desde la base de datos
      const usuario = await AuthService.getUserById(user.userId);
      
      const response: ApiResponse = {
        ok: true,
        msg: 'Token válido',
        data: {
          usuario: usuario
        }
      };
      
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        ok: false,
        msg: 'Token inválido'
      };
      
      res.status(401).json(response);
    }
  }
}
