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

## Instalacion rapida

### 1. Clonar el proyecto

```bash
git clone <repositorio>
cd "queso las delicias"
```

### 2. Backend

```bash
cd api
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

### 3. Frontend

```bash
cd ../frontend
npm install
npm run dev
```

## URL de trabajo esperadas

- Backend API: `http://127.0.0.1:8000/api`
- Frontend SPA: `http://localhost:5173`

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
