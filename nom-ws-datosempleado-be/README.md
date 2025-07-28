# Sistema de Gestión de Colaboradores - Backend API

Este es el backend REST API para el Sistema de Gestión de Colaboradores, desarrollado con Node.js, Express, TypeScript, Prisma y PostgreSQL.

## 🚀 Características

- **Autenticación JWT**: Login seguro con tokens de autenticación
- **CRUD de Colaboradores**: Crear, leer, actualizar y eliminar colaboradores
- **Catálogos**: Gestión de sexos, profesiones, estados civiles y áreas
- **Validaciones**: Validación completa de datos con express-validator
- **Paginación**: Búsqueda y paginación de colaboradores
- **Base de Datos**: PostgreSQL con Prisma ORM
- **TypeScript**: Tipado estático para mayor seguridad

## 🛠️ Tecnologías

- **Runtime**: Node.js
- **Framework**: Express.js 4.x
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: JWT 
- **Validación**: express-validator
- **Seguridad**: Helmet, CORS, bcryptjs
- **Desarrollo**: Nodemon, ts-node

## 📦 Instalación

1. **Clonar o usar el proyecto**
   ```bash
   cd nom-ws-datosempleado-be
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Copiar y configurar el archivo .env
   DATABASE_URL="postgresql://postgres:8ac3etuq@localhost:5432/colaboradores_db?schema=public"
   JWT_SECRET="tjwt_prueba_test_colaboradores_2024"
   JWT_EXPIRES_IN="48h"
   PORT=3000
   NODE_ENV="development"
   CORS_ORIGIN="http://localhost:4200"
   ```

4. **Configurar la base de datos**
   ```bash
   # Generar cliente de Prisma
   npm run db:generate
   
   # Ejecutar migraciones
   npm run db:migrate
   
   # Poblar datos iniciales
   npm run db:seed
   ```

5. **Iniciar el servidor**
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm run build
   npm start
   ```

## 🗄️ Base de Datos

### Esquema de Base de Datos

- **usuarios**: Usuarios del sistema (administradores)
- **colaboradores**: Información principal de colaboradores
- **sexos**: Catálogo de géneros
- **profesiones**: Catálogo de profesiones
- **estados_civiles**: Catálogo de estados civiles
- **areas**: Catálogo de áreas de trabajo

## Script SQL

-- Crear tabla de usuarios
CREATE TABLE "usuarios" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- Crear tabla sexos
CREATE TABLE "sexos" (
    "id" SERIAL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true
);

-- Crear tabla profesiones
CREATE TABLE "profesiones" (
    "id" SERIAL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true
);

-- Crear tabla estados civiles
CREATE TABLE "estados_civiles" (
    "id" SERIAL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true
);

-- Crear tabla áreas
CREATE TABLE "areas" (
    "id" SERIAL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true
);

-- Crear tabla colaboradores
CREATE TABLE "colaboradores" (
    "id" SERIAL PRIMARY KEY,
    "numero_empleado" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "fecha_nacimiento" DATE NOT NULL,
    "fecha_ingreso" DATE NOT NULL,
    "salario" DECIMAL(10,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "sexo_id" INTEGER NOT NULL,
    "profesion_id" INTEGER NOT NULL,
    "estado_civil_id" INTEGER NOT NULL,
    "area_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    
    CONSTRAINT "fk_colaboradores_sexo" FOREIGN KEY ("sexo_id") REFERENCES "sexos"("id"),
    CONSTRAINT "fk_colaboradores_profesion" FOREIGN KEY ("profesion_id") REFERENCES "profesiones"("id"),
    CONSTRAINT "fk_colaboradores_estado_civil" FOREIGN KEY ("estado_civil_id") REFERENCES "estados_civiles"("id"),
    CONSTRAINT "fk_colaboradores_area" FOREIGN KEY ("area_id") REFERENCES "areas"("id")
);


### Usuario por Defecto

Al ejecutar el seed, se crea un usuario administrador:
- **Email**: admin@colaboradores.com
- **Password**: admin123
    
    npm run db:seed


## 🔌 API Endpoints

### Autenticación

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@colaboradores.com",
  "password": "admin123"
}
```


## 📝 Scripts Disponibles

```bash
npm run dev          # Desarrollo con nodemon
npm run build        # Compilar TypeScript
npm start           # Ejecutar versión compilada
npm run db:generate # Generar cliente Prisma
npm run db:migrate  # Ejecutar migraciones
npm run db:seed     # Poblar datos iniciales
npm run db:studio   # Abrir Prisma Studio
```


## 📈 Características

- **Soft Delete**: Los colaboradores se marcan como inactivos en lugar de eliminarlos
- **Auditoría**: Campos createdAt y updatedAt automáticos
- **Validación de Unicidad**: Email y número de empleado únicos
- **Relaciones**: Foreign keys con catálogos
- **Índices**: Optimización de consultas
