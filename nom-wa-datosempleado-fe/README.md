# Sistema de Gestión de Colaboradores - Frontend

Este es el frontend de la aplicación de gestión de colaboradores, desarrollado con Angular y Angular Material.

## 🚀 Características

- **Autenticación de usuario**: Sistema de login para administradores
- **CRUD de colaboradores**: Crear, leer, actualizar y eliminar colaboradores
- **Cálculo de nivel de riesgo**: Evaluación automática basada en la edad
- **Interfaz moderna**: Diseño responsive con Angular Material

## 🛠️ Tecnologías Utilizadas

- **Angular 20**: Framework principal
- **Angular Material**: Componentes UI y design system
- **TypeScript**: Lenguaje de programación
- **RxJS**: Programación reactiva
- **CSS3**: Estilos y diseño responsive

## 📋 Prerrequisitos

- Node.js (versión 18 o superior)
- npm (versión 9 o superior)
- Angular CLI (versión 20 o superior)

## 🔧 Instalación

1. **Clonar el repositorio o navegar al directorio del frontend**:
   ```bash
   cd nom-wa-datosempleado-fe
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Instalar Angular CLI globalmente** (si no lo tienes):
   ```bash
   npm install -g @angular/cli
   ```

## ⚙️ Configuración

### Variables de entorno

El frontend está configurado para conectarse al backend en `http://localhost:3000/api`. Si el backend corre en una URL diferente, puedes modificar las URLs en los servicios:

- `src/app/services/colaborador.service.ts` (línea 19)
- `src/app/services/auth.service.ts` (línea 16)


## 🚀 Ejecución

### Modo desarrollo

```bash
npm start
# o
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

### Compilación para producción

```bash
npm run build
# o
ng build
```

### Funcionalidades principales

1. **Lista de colaboradores**: Tabla paginada con filtros y búsqueda
2. **Crear colaborador**: Formulario con validaciones completas
3. **Editar colaborador**: Modificación de datos existentes
4. **Eliminar colaborador**: Confirmación antes de eliminar
5. **Nivel de riesgo**: Cálculo automático basado en la edad:
   - **18-25 años**: "FUERA DE PELIGRO" (Verde)
   - **26-50 años**: "TENGA CUIDADO, TOME TODAS LAS MEDIDAS DE PREVENCIÓN" (Naranja)
   - **51+ años**: "POR FAVOR QUEDARSE EN CASA" (Rojo)

### Validaciones del formulario

- **Nombre y apellido**: Mínimo 2 caracteres, máximo 50
- **Dirección**: Mínimo 5 caracteres, máximo 200
- **Edad**: Entre 18 y 80 años
- **Catálogos**: Selección obligatoria para sexo, profesión, estado civil y área


### Paleta de colores

- **Primario**: Indigo (#3f51b5)
- **Acento**: Pink (#e91e63)
- **Éxito**: Verde (#4caf50)
- **Advertencia**: Naranja (#ff9800)
- **Error**: Rojo (#f44336)


## 📝 Scripts Disponibles

- `npm start`: Ejecuta el servidor de desarrollo
- `npm run build`: Compila para producción
- `npm test`: Ejecuta tests unitarios
- `npm run test:coverage`: Tests con reporte de coverage
- `npm run lint`: Verifica el código con ESLint

## 🔧 Configuración del Backend

Este frontend requiere un backend con las siguientes APIs:

### Autenticación
- `POST /api/auth/login`: Login de usuario
- `GET /api/auth/me`: Información del usuario actual
- `POST /api/auth/refresh`: Renovar token

### Colaboradores
- `GET /api/colaboradores`: Lista paginada de colaboradores
- `GET /api/colaboradores/all`: Todos los colaboradores
- `GET /api/colaboradores/:id`: Colaborador por ID
- `POST /api/colaboradores`: Crear colaborador
- `PUT /api/colaboradores/:id`: Actualizar colaborador
- `DELETE /api/colaboradores/:id`: Eliminar colaborador

### Catálogos
- `GET /api/catalogos/sexos`: Lista de sexos
- `GET /api/catalogos/profesiones`: Lista de profesiones
- `GET /api/catalogos/estados-civiles`: Lista de estados civiles
- `GET /api/catalogos/areas`: Lista de áreas


