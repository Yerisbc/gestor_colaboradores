import prisma from '../src/utils/database';
import { AuthService } from '../src/services/auth.service';
import { CatalogoService } from '../src/services/catalogo.service';

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  try {
    // Crear catálogos básicos
    await CatalogoService.seedCatalogos();

    // Crear usuario administrador
    await AuthService.createDefaultAdmin();

    console.log('Seed completado exitosamente');
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
