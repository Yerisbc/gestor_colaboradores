import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Importar rutas
import authRoutes from './routes/auth.routes';
import colaboradorRoutes from './routes/colaborador.routes';
import catalogoRoutes from './routes/catalogo.routes';

// Configuración de variables de entorno
dotenv.config();

class Server {
  private app: Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || '3000';

    // Middlewares
    this.middlewares();
    
    // Rutas
    this.routes();
  }

  middlewares(): void {
    // CORS
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
      credentials: true
    }));

    // Helmet para seguridad
    this.app.use(helmet());

    // Morgan para logging
    this.app.use(morgan('combined'));

    // Lectura y parseo del body
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  routes(): void {
    // Ruta de health check
    this.app.get('/api/health', (req: Request, res: Response) => {
      res.json({
        ok: true,
        msg: 'API Colaboradores funcionando correctamente',
        timestamp: new Date().toISOString()
      });
    });

    // Rutas de la aplicación
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/colaboradores', colaboradorRoutes);
    this.app.use('/api/catalogos', catalogoRoutes);

    // Ruta 404
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        ok: false,
        msg: 'Endpoint no encontrado'
      });
    });
  }

  listen(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Servidor corriendo en puerto ${this.port}`);
      console.log(`📊 Health check: http://localhost:${this.port}/api/health`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  }
}

export default Server;
