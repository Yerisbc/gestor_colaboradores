import prisma from '../utils/database';
import { CatalogoItem } from '../types/api.types';

export class CatalogoService {
  /**
   * Obtiene todos los catálogos activos
   */
  static async getAllCatalogos() {
    const [sexos, profesiones, estadosCiviles, areas] = await Promise.all([
      this.getSexos(),
      this.getProfesiones(),
      this.getEstadosCiviles(),
      this.getAreas()
    ]);

    return {
      sexos,
      profesiones,
      estadosCiviles,
      areas
    };
  }

  /**
   * Obtiene todos los sexos activos
   */
  static async getSexos(): Promise<CatalogoItem[]> {
    const sexos = await prisma.sexo.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' }
    });

    return sexos.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      activo: item.activo
    }));
  }

  /**
   * Obtiene todas las profesiones activas
   */
  static async getProfesiones(): Promise<CatalogoItem[]> {
    const profesiones = await prisma.profesion.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' }
    });

    return profesiones.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      activo: item.activo
    }));
  }

  /**
   * Obtiene todos los estados civiles activos
   */
  static async getEstadosCiviles(): Promise<CatalogoItem[]> {
    const estadosCiviles = await prisma.estadoCivil.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' }
    });

    return estadosCiviles.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      activo: item.activo
    }));
  }

  /**
   * Obtiene todas las áreas activas
   */
  static async getAreas(): Promise<CatalogoItem[]> {
    const areas = await prisma.area.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' }
    });

    return areas.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      activo: item.activo
    }));
  }

  /**
   * Crear datos iniciales de catálogos (seed)
   */
  static async seedCatalogos(): Promise<void> {
    // Verificar si ya existen datos
    const [sexosCount, profesionesCount, estadosCount, areasCount] = await Promise.all([
      prisma.sexo.count(),
      prisma.profesion.count(),
      prisma.estadoCivil.count(),
      prisma.area.count()
    ]);

    // Crear sexos si no existen
    if (sexosCount === 0) {
      await prisma.sexo.createMany({
        data: [
          { nombre: 'Masculino' },
          { nombre: 'Femenino' },
          { nombre: 'Otro' }
        ]
      });
    }

    // Crear profesiones si no existen
    if (profesionesCount === 0) {
      await prisma.profesion.createMany({
        data: [
          { nombre: 'Desarrollador Frontend' },
          { nombre: 'Desarrollador Backend' },
          { nombre: 'Desarrollador Full Stack' },
          { nombre: 'DevOps Engineer' },
          { nombre: 'Analista de Sistemas' },
          { nombre: 'Diseñador UX/UI' },
          { nombre: 'Product Manager' },
          { nombre: 'Scrum Master' },
          { nombre: 'QA Tester' },
          { nombre: 'Data Scientist' },
          { nombre: 'Arquitecto de Software' },
          { nombre: 'Administrador de Base de Datos' }
        ]
      });
    }

    // Crear estados civiles si no existen
    if (estadosCount === 0) {
      await prisma.estadoCivil.createMany({
        data: [
          { nombre: 'Soltero(a)' },
          { nombre: 'Casado(a)' },
          { nombre: 'Divorciado(a)' },
          { nombre: 'Viudo(a)' },
          { nombre: 'Unión Libre' }
        ]
      });
    }

    // Crear áreas si no existen
    if (areasCount === 0) {
      await prisma.area.createMany({
        data: [
          { nombre: 'Desarrollo de Software' },
          { nombre: 'Infraestructura y DevOps' },
          { nombre: 'Análisis y Diseño' },
          { nombre: 'Gestión de Proyectos' },
          { nombre: 'Calidad y Testing' },
          { nombre: 'Datos y Analytics' },
          { nombre: 'Soporte Técnico' },
          { nombre: 'Recursos Humanos' },
          { nombre: 'Administración' },
          { nombre: 'Ventas y Marketing' }
        ]
      });
    }
  }
}
