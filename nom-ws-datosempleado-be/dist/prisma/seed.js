"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../src/utils/database"));
const auth_service_1 = require("../src/services/auth.service");
const catalogo_service_1 = require("../src/services/catalogo.service");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🌱 Iniciando seed de la base de datos...');
        try {
            // Crear catálogos básicos
            yield catalogo_service_1.CatalogoService.seedCatalogos();
            // Crear usuario administrador
            yield auth_service_1.AuthService.createDefaultAdmin();
            console.log('Seed completado exitosamente');
        }
        catch (error) {
            console.error('❌ Error durante el seed:', error);
            throw error;
        }
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.default.$disconnect();
}));
