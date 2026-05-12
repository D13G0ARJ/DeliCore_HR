# DeliCore HR Frontend

## Stack

- React
- Tailwind CSS
- Ant Design
- React Flow
- Dagre

El frontend es una SPA corporativa orientada a experiencia SaaS B2B. Está diseñada para consumir una API REST en Laravel y representar de forma clara la estructura operativa, los perfiles, los KPIs y el asistente IA por rol.

## Arquitectura del frontend

La aplicación sigue una estructura modular centrada en capacidades del producto.

### Jerarquía base

- `App.jsx`
- `Layout.jsx`
- `ThemeToggle.jsx`
- módulos de vista por dominio

### Layout corporativo

`Layout.jsx` define la estructura persistente de navegación:

- `Sidebar` fijo
- `Topbar` superior
- `Main Content` dinámico

Esta decisión permite que la aplicación se perciba como una plataforma SaaS real y no como páginas sueltas.

### Sidebar

Contiene los accesos a:

- Dashboard
- Organigrama
- Directorio de Empleados
- Perfil
- KPIs
- Asistente IA

### Topbar

Incluye:

- selector de idioma ES/EN
- toggle de tema
- perfil visual de `Super Admin`

## Estructura modular de vistas

### `Dashboard`

Vista ejecutiva con métricas, alertas y acceso rápido a áreas clave.

### `Organigrama`

Módulo interactivo construido con `React Flow` y `Dagre`, usando layout automático y ajustes posicionales específicos para acercarse al documento real del cliente.

### `DirectorioEmpleados`

Vista 360 con filtros, tarjetas de empleados y ficha lateral de contexto operativo.

### `PerfilTalento`

Analiza empleados y puestos desde una misma interfaz. El módulo puede alternar entre vista por persona y vista por puesto.

### `CentroKpis`

Muestra:

- catálogo KPI
- brechas
- seguimiento reciente
- tracker operativo
- KPIs sugeridos por rol

### `AsistenteIaRol`

Interfaz tipo chat empresarial con:

- selección de rol
- preguntas sugeridas
- respuesta contextual
- fuentes auditables

## Organigrama

## Implementación técnica

La versión final del organigrama se apoya en:

- `@xyflow/react`
- `dagre`

### Flujo de renderizado

1. La API devuelve un JSON recursivo por `hijos`
2. `organigramaFlow.js` aplana el árbol en `nodes` y `edges`
3. Dagre calcula el layout base
4. Se aplican overrides posicionales para respetar el diseño del cliente
5. React Flow renderiza nodos, conectores y controles de navegación

### Custom node

`TarjetaNodoFlow.jsx` renderiza las tarjetas del organigrama con:

- color por rama
- iconografía por área
- handles invisibles
- hover premium
- listas resumidas derivadas del manual

### Pantalla completa

`Organigrama.jsx` integra la Fullscreen API nativa:

- `requestFullscreen()`
- `exitFullscreen()`

Esto permite explorar el árbol completo sin depender del scroll del navegador.

## Perfil y KPIs

## Gestión de estado

El frontend usa estado local de React para coordinar:

- idioma activo
- tema activo
- vista seleccionada
- empleado activo
- rol activo para IA
- estado de tracker KPI

### Roles híbridos

Los módulos de directorio y perfil consumen el modelo de roles adicionales para renderizar empleados híbridos con:

- cargo principal
- roles adicionales
- porcentaje de tiempo
- observaciones operativas

### KPI Habit Tracker

El tracker de KPIs está construido sobre una tabla operativa que llega desde la API y se visualiza como checklist por rol.

Cada ítem de seguimiento permite:

- ver frecuencia
- comparar valor actual contra meta
- marcar completado o pendiente
- recalcular visualmente el progreso del rol

## UI/UX premium

## Modo oscuro con transición nativa

El cambio de tema combina:

- `ConfigProvider` de Ant Design
- clases `dark:` de Tailwind
- `document.startViewTransition()`

### Resultado

El usuario percibe una transición fluida entre tema claro y oscuro, con expansión visual desde el punto de interacción.

## Internacionalización ES/EN

La interfaz implementa un sistema de i18n liviano basado en:

- `traducciones.js`
- estado global simple de idioma
- localización de datos estáticos
- traducción parcial de payloads dinámicos

### Alcance actual

Se traducen:

- labels de navegación
- vistas y acciones
- bloques funcionales
- gran parte de contenido dinámico proveniente de la API

Esto fue especialmente importante porque el backend usa nombres y descripciones operativas en español.

## Ant Design + Tailwind

El proyecto combina ambos enfoques:

- Ant Design para tokens de tema, avatar y consistencia base
- Tailwind para composición rápida, glassmorphism, spacing y detalle visual

## Instalacion

```bash
cd frontend
npm install
npm run dev
```

## Construccion

```bash
npm run build
```

## Puntos técnicos relevantes

- layout desacoplado por módulos
- componentes reutilizables y especializados
- integración de APIs por dominio
- renderizado bilingüe
- arquitectura lista para code splitting futuro
