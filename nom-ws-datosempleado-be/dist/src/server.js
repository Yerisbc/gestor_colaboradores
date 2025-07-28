"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
// Importar rutas
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const colaborador_routes_1 = __importDefault(require("./routes/colaborador.routes"));
const catalogo_routes_1 = __importDefault(require("./routes/catalogo.routes"));
// Configuración de variables de entorno
dotenv_1.default.config();
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3000';
        // Middlewares
        this.middlewares();
        // Rutas
        this.routes();
    }
    middlewares() {
        // CORS
        this.app.use((0, cors_1.default)({
            origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
            credentials: true
        }));
        // Helmet para seguridad
        this.app.use((0, helmet_1.default)());
        // Morgan para logging
        this.app.use((0, morgan_1.default)('combined'));
        // Lectura y parseo del body
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    routes() {
        // Ruta de health check
        this.app.get('/api/health', (req, res) => {
            res.json({
                ok: true,
                msg: 'API Colaboradores funcionando correctamente',
                timestamp: new Date().toISOString()
            });
        });
        // Rutas de la aplicación
        this.app.use('/api/auth', auth_routes_1.default);
        this.app.use('/api/colaboradores', colaborador_routes_1.default);
        this.app.use('/api/catalogos', catalogo_routes_1.default);
        // Ruta 404
        this.app.use('*', (req, res) => {
            res.status(404).json({
                ok: false,
                msg: 'Endpoint no encontrado'
            });
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`🚀 Servidor corriendo en puerto ${this.port}`);
            console.log(`📊 Health check: http://localhost:${this.port}/api/health`);
            console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
        });
    }
}
exports.default = Server;
