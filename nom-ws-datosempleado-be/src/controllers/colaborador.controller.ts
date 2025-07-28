import { Request, Response } from 'express';
import { ColaboradorService } from '../services/colaborador.service';
import { ApiResponse, ColaboradorRequest, PaginationParams } from '../types/api.types';

export class ColaboradorController {
  /**
   * Obtiene todos los colaboradores con paginación
   */
  static async getColaboradores(req: Request, res: Response) {
    try {
      const params: PaginationParams = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        search: req.query.search as string || '',
        sortBy: req.query.sortBy as string || 'createdAt',
        sortOrder: req.query.sortOrder as 'asc' | 'desc' || 'desc'
      };

      const result = await ColaboradorService.getColaboradores(params);

      const response: ApiResponse = {
        ok: true,
        msg: 'Colaboradores obtenidos exitosamente',
        data: result
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        ok: false,
        msg: error instanceof Error ? error.message : 'Error al obtener colaboradores'
      };

      res.status(500).json(response);
    }
  }

  /**
   * Obtiene un colaborador por ID
   */
  static async getColaboradorById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        const response: ApiResponse = {
          ok: false,
          msg: 'ID inválido'
        };
        return res.status(400).json(response);
      }

      const colaborador = await ColaboradorService.getColaboradorById(id);

      const response: ApiResponse = {
        ok: true,
        msg: 'Colaborador obtenido exitosamente',
        data: colaborador
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        ok: false,
        msg: error instanceof Error ? error.message : 'Error al obtener colaborador'
      };

      const statusCode = error instanceof Error && error.message === 'Colaborador no encontrado' ? 404 : 500;
      res.status(statusCode).json(response);
    }
  }

  /**
   * Crea un nuevo colaborador
   */
  static async createColaborador(req: Request, res: Response) {
    try {
      const colaboradorData: ColaboradorRequest = req.body;
      
      const colaborador = await ColaboradorService.createColaborador(colaboradorData);

      const response: ApiResponse = {
        ok: true,
        msg: 'Colaborador creado exitosamente',
        data: colaborador
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        ok: false,
        msg: error instanceof Error ? error.message : 'Error al crear colaborador'
      };

      res.status(400).json(response);
    }
  }

  /**
   * Actualiza un colaborador (actualización parcial)
   */
  static async updateColaborador(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        const response: ApiResponse = {
          ok: false,
          msg: 'ID inválido'
        };
        return res.status(400).json(response);
      }

      const colaboradorData: Partial<ColaboradorRequest> = req.body;
      
      const colaborador = await ColaboradorService.updateColaborador(id, colaboradorData);

      const response: ApiResponse = {
        ok: true,
        msg: 'Colaborador actualizado exitosamente',
        data: colaborador
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        ok: false,
        msg: error instanceof Error ? error.message : 'Error al actualizar colaborador'
      };

      const statusCode = error instanceof Error && error.message === 'Colaborador no encontrado' ? 404 : 400;
      res.status(statusCode).json(response);
    }
  }

  /**
   * Elimina (desactiva) un colaborador
   */
  static async deleteColaborador(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        const response: ApiResponse = {
          ok: false,
          msg: 'ID inválido'
        };
        return res.status(400).json(response);
      }

      await ColaboradorService.deleteColaborador(id);

      const response: ApiResponse = {
        ok: true,
        msg: 'Colaborador eliminado exitosamente'
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        ok: false,
        msg: error instanceof Error ? error.message : 'Error al eliminar colaborador'
      };

      const statusCode = error instanceof Error && error.message === 'Colaborador no encontrado' ? 404 : 500;
      res.status(statusCode).json(response);
    }
  }
}
