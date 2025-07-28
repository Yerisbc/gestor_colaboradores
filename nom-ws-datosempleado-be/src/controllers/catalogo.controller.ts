import { Request, Response } from 'express';
import { CatalogoService } from '../services/catalogo.service';
import { ApiResponse } from '../types/api.types';

export class CatalogoController {
  /**
   * Obtiene todos los catálogos
   */
  static async getAllCatalogos(req: Request, res: Response) {
    try {
      const catalogos = await CatalogoService.getAllCatalogos();

      const response: ApiResponse = {
        ok: true,
        msg: 'Catálogos obtenidos exitosamente',
        data: catalogos
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        ok: false,
        msg: error instanceof Error ? error.message : 'Error al obtener catálogos'
      };

      res.status(500).json(response);
    }
  }

  /**
   * Obtiene catálogo de sexos
   */
  static async getSexos(req: Request, res: Response) {
    try {
      const sexos = await CatalogoService.getSexos();

      const response: ApiResponse = {
        ok: true,
        msg: 'Sexos obtenidos exitosamente',
        data: sexos
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        ok: false,
        msg: error instanceof Error ? error.message : 'Error al obtener sexos'
      };

      res.status(500).json(response);
    }
  }

  /**
   * Obtiene catálogo de profesiones
   */
  static async getProfesiones(req: Request, res: Response) {
    try {
      const profesiones = await CatalogoService.getProfesiones();

      const response: ApiResponse = {
        ok: true,
        msg: 'Profesiones obtenidas exitosamente',
        data: profesiones
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        ok: false,
        msg: error instanceof Error ? error.message : 'Error al obtener profesiones'
      };

      res.status(500).json(response);
    }
  }

  /**
   * Obtiene catálogo de estados civiles
   */
  static async getEstadosCiviles(req: Request, res: Response) {
    try {
      const estadosCiviles = await CatalogoService.getEstadosCiviles();

      const response: ApiResponse = {
        ok: true,
        msg: 'Estados civiles obtenidos exitosamente',
        data: estadosCiviles
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        ok: false,
        msg: error instanceof Error ? error.message : 'Error al obtener estados civiles'
      };

      res.status(500).json(response);
    }
  }

  /**
   * Obtiene catálogo de áreas
   */
  static async getAreas(req: Request, res: Response) {
    try {
      const areas = await CatalogoService.getAreas();

      const response: ApiResponse = {
        ok: true,
        msg: 'Áreas obtenidas exitosamente',
        data: areas
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        ok: false,
        msg: error instanceof Error ? error.message : 'Error al obtener áreas'
      };

      res.status(500).json(response);
    }
  }
}
