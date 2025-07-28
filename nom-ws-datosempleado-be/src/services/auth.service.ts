import prisma from '../utils/database';
import { AuthUtils } from '../utils/auth.utils';
import { LoginRequest, LoginResponse } from '../types/api.types';

export class AuthService {
  /**
   * Realiza el login de un usuario
   */
  static async login(loginData: LoginRequest): Promise<LoginResponse> {
    const { email, password } = loginData;

    if (!email) {
      throw new Error('Email es requerido');
    }

    // Buscar el usuario por email
    const usuario = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        password: true,
        nombre: true,
        activo: true
      }
    });

    if (!usuario) {
      throw new Error('Credenciales inválidas');
    }

    if (!usuario.activo) {
      throw new Error('Usuario inactivo');
    }

    // Verificar la contraseña
    const isValidPassword = await AuthUtils.comparePassword(password, usuario.password);
    
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token
    const token = AuthUtils.generateToken({
      userId: usuario.id,
      email: usuario.email
    });

    return {
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre
      }
    };
  }

  /**
   * Crear usuario administrador por defecto (solo para desarrollo)
   */
  static async createDefaultAdmin(): Promise<void> {
    const adminEmail = 'admin@colaboradores.com';
    
    // Verificar si ya existe
    const existingAdmin = await prisma.usuario.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      return; // Ya existe
    }

    // Crear usuario administrador
    const hashedPassword = await AuthUtils.hashPassword('admin123');
    
    await prisma.usuario.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        nombre: 'Administrador',
        activo: true
      }
    });
  }

  /**
   * Obtiene un usuario por ID
   */
  static async getUserById(id: number): Promise<{ id: number; email: string; nombre: string }> {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nombre: true,
        activo: true
      }
    });

    if (!usuario || !usuario.activo) {
      throw new Error('Usuario no encontrado');
    }

    return {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre
    };
  }
}
