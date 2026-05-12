# DeliCore HR

**Workforce Intelligence para operaciones, roles y desempeño**

DeliCore HR es una plataforma interna diseñada para digitalizar el sistema de registro de tareas, responsabilidades, seguimiento operativo y soporte contextual por rol dentro de una organización con alta carga operativa. El proyecto nace para resolver un problema concreto del negocio: la falta de trazabilidad sobre quién hace qué, cómo se mide y qué ocurre cuando una misma persona asume múltiples responsabilidades dentro de la estructura.

## Proposito del producto

En muchas operaciones reales, la estructura formal de la empresa existe en papel o en organigramas estáticos, pero la ejecución diaria depende de conocimiento informal, múltiples roles asumidos por una misma persona y seguimiento manual en hojas de cálculo. DeliCore HR convierte esa realidad en un sistema navegable, medible y accionable.

El producto permite:

- centralizar el organigrama real del cliente
- documentar puestos, manuales y responsabilidades
- gestionar empleados con roles principales y roles adicionales
- medir desempeño con KPIs y seguimiento operativo
- consultar un asistente IA limitado al contexto del manual del rol

## Problema que resuelve

La solución está pensada para organizaciones donde:

- no existe trazabilidad clara por puesto
- el seguimiento de tareas vive en Excel o procesos manuales
- varias personas cubren más de un rol operativo
- los KPIs existen de forma incompleta o no están estandarizados
- el conocimiento de procesos depende de pocas personas clave

DeliCore HR aborda ese escenario con una arquitectura orientada a producto, priorizando visibilidad operativa, control por área y capacidad de evolución futura hacia una capa de IA más robusta.

## Arquitectura general

La solución está compuesta por dos aplicaciones desacopladas:

- **Backend**: Laravel API REST
- **Frontend**: React SPA

El diseño sigue principios de:

- Clean Code
- separación clara entre dominio, transporte y presentación
- arquitectura modular por capacidades del producto
- componentes reutilizables y localización bilingüe en frontend

Esta base permite evolucionar el sistema sin acoplar la interfaz a la estructura interna de la API ni mezclar lógica de negocio con renderizado visual.

## Modulos principales

### Dashboard

Vista ejecutiva con resumen de áreas, estructura organizacional, KPIs activos, alertas operativas y estado general del sistema.

### Organigrama

Representación navegable del organigrama real del cliente, con relación jerárquica entre dueños, dirección, áreas operativas, administrativas y de soporte.

### Directorio 360

Vista de empleados con filtros, ficha operativa, roles adicionales, supervisor directo, antigüedad, actividad KPI y contexto funcional asociado al rol.

### Perfil de empleado y puesto

Módulo orientado a análisis funcional. Permite ver el perfil detallado de una persona o de un puesto, incluyendo propósito, manual resumido, subordinados, responsabilidades y KPIs relacionados.

### KPI Tracker

Centro de monitoreo y seguimiento que reúne catálogo de KPIs, rendimiento del equipo, brechas, distribución por área, tracker operativo por rol y sugerencias de KPIs para puestos que aún no tienen métricas formalizadas.

### Asistente IA por rol

Interfaz de consulta contextual donde cada rol dispone de un asistente que responde únicamente usando el manual, propósito y descripción operativa asociados a ese puesto.

## Stack tecnologico

### Backend

- PHP
- Laravel
- MySQL o PostgreSQL

### Frontend

- React
- Tailwind CSS
- Ant Design
- React Flow
- Dagre

## Ejecucion local

### Requisitos previos

- PHP 8.2 o superior
- Composer
- Node.js 20 o superior
- npm
- MySQL o PostgreSQL

### 1. Clonar el proyecto

```bash
git clone <https://github.com/D13G0ARJ/DeliCore_HR>
cd "queso las delicias"
```

### 2. Configurar backend Laravel

Entrar a la carpeta de la API:

```bash
cd api
```

Instalar dependencias:

```bash
composer install
```

Crear el archivo de entorno:

```bash
copy .env.example .env
```

Editar `api/.env` y configurar como minimo:

```env
APP_NAME="Delicore HR"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=queso_delicias
DB_USERNAME=root
DB_PASSWORD=
```

Si prefieres PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=queso_delicias
DB_USERNAME=postgres
DB_PASSWORD=tu_clave
```

Generar llave, correr migraciones y sembrar la demo:

```bash
php artisan key:generate
php artisan migrate:fresh --seed
```

Levantar la API:

```bash
php artisan serve
```

La API quedara disponible en:

- `http://127.0.0.1:8000`
- `http://127.0.0.1:8000/api`

### 3. Configurar frontend React

Abrir otra terminal y entrar a la SPA:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Crear un archivo `frontend/.env` con:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Levantar el entorno de desarrollo:

```bash
npm run dev
```

El frontend quedara disponible normalmente en:

- `http://localhost:5173`

### 4. Comandos utiles

Backend:

```bash
php artisan migrate:fresh --seed
php artisan route:list
php artisan serve
```

Frontend:

```bash
npm run dev
npm run build
npm run preview
```

### 5. Flujo recomendado para validar la demo

1. Levantar la base de datos local.
2. Ejecutar la API Laravel en `http://127.0.0.1:8000`.
3. Ejecutar la SPA React en `http://localhost:5173`.
4. Ingresar con el login visual mock.
5. Recorrer Dashboard, Organigrama, Directorio, Perfil, KPIs y Asistente IA.

## Estado del MVP

El MVP cubre el flujo principal de validación:

- login visual corporativo
- layout SaaS con dark mode
- dashboard ejecutivo
- organigrama navegable
- directorio de empleados
- perfil funcional de empleado y puesto
- centro de KPIs con tracker
- asistente IA por rol

## Siguientes evoluciones sugeridas

- autenticación real por usuario y permisos
- versionado de manuales y políticas internas
- generación automática de KPIs mediante IA conectada a proveedores LLM
- motor RAG con embeddings persistentes
- auditoría de cambios y trazabilidad histórica por rol
