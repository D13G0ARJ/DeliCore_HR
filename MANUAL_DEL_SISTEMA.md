# MANUAL DEL SISTEMA DeliCore HR

## Índice

1. [Visión General y Filosofía del Producto](#1-visión-general-y-filosofía-del-producto)
2. [Arquitectura Técnica](#2-arquitectura-técnica-breve-pero-concisa)
3. [Desglose Mega Detallado por Módulos](#3-desglose-mega-detallado-por-módulos)
4. [Flujos de Uso Clave](#4-flujos-de-uso-clave)
5. [Conclusión Operativa](#5-conclusión-operativa)

---

## 1. Visión General y Filosofía del Producto

### 1.1 ¿Qué es DeliCore HR?

DeliCore HR es una plataforma de gestión organizacional y operativa diseñada para empresas que necesitan ordenar su estructura humana, documentar funciones, medir desempeño y ofrecer soporte contextual a cada colaborador según su rol real dentro de la operación.

No es únicamente un directorio de empleados. No es únicamente un panel KPI. No es únicamente un asistente interno. DeliCore HR nace como una capa unificada donde convergen:

- la estructura formal de puestos,
- la realidad operativa de personas con múltiples funciones,
- la trazabilidad diaria de métricas,
- y el soporte guiado por contexto documental.

La plataforma está pensada para resolver un problema muy concreto de organizaciones en crecimiento: cuando el organigrama oficial, las responsabilidades reales, los indicadores de desempeño y el conocimiento operativo viven separados, la empresa pierde claridad, velocidad y control.

DeliCore HR busca corregir eso integrando cuatro dimensiones en una sola experiencia:

- estructura organizacional,
- gestión de talento,
- gestión de KPIs,
- asistencia contextual por rol.

### 1.2 Propósito de negocio

El propósito del sistema es que una empresa pueda responder, desde un solo entorno, preguntas como:

- ¿Quién hace qué?
- ¿Quién reporta a quién?
- ¿Qué rol principal tiene cada colaborador y qué roles adicionales cubre?
- ¿Qué indicador corresponde a cada puesto o persona?
- ¿Quién está atrasado en seguimiento?
- ¿Qué puestos siguen sin métricas definidas?
- ¿Qué debe hacer un colaborador hoy?
- ¿Qué puede consultar un rol sin salirse de las políticas o del manual de la empresa?

### 1.3 Filosofía del producto

DeliCore HR está construido sobre una filosofía B2B orientada a tres principios:

#### 1.3.1 Claridad estructural

La interfaz intenta traducir una organización compleja en vistas comprensibles:

- organigrama navegable,
- directorio con filtros operativos,
- perfiles con información consolidada,
- KPIs organizados por tabs y flujos guiados.

La meta no es “mostrar todo”; la meta es “mostrar lo correcto en el momento correcto”.

#### 1.3.2 Trazabilidad operativa real

El sistema no se limita a definir KPIs en abstracto. También construye el puente entre definición y ejecución.

Por eso DeliCore HR separa dos conceptos:

- la definición del KPI,
- el seguimiento operativo del KPI.

Una métrica sin seguimiento es documentación. Una métrica con seguimiento es gestión real.

#### 1.3.3 Soporte contextual y controlado

El asistente IA no está concebido como un chatbot abierto. Está diseñado como una capa de consulta controlada, acotada al manual, propósito o contexto de un rol concreto.

Esto es especialmente importante en entornos empresariales donde el soporte debe:

- ayudar,
- orientar,
- responder rápido,
- pero sin inventar procesos fuera de política.

### 1.4 Pilares del sistema

#### 1.4.1 Gestión de roles múltiples o híbridos

Uno de los diferenciadores más importantes de DeliCore HR es que reconoce que una persona puede operar en más de un frente.

En muchas empresas, un colaborador:

- tiene un puesto principal,
- pero además cubre funciones adicionales,
- apoya otras áreas,
- o reparte su tiempo entre varios roles.

El sistema modela esto mediante:

- `puesto_principal_id` en la entidad de empleado,
- tabla `roles_empleado` para funciones adicionales,
- porcentaje de tiempo,
- condición del rol,
- observaciones.

Esto permite una representación mucho más realista de la organización.

#### 1.4.2 Trazabilidad operativa mediante KPIs

El sistema convierte la gestión de desempeño en un flujo vivo:

- el admin define un KPI,
- el sistema lo relaciona con un puesto o un empleado,
- se generan seguimientos operativos,
- el empleado registra valor actual, completado y justificación,
- el gerente o administrador puede revisar cobertura, brechas y alertas.

Esto permite pasar de una cultura de “métricas decorativas” a una cultura de seguimiento operativo.

#### 1.4.3 Soporte contextual con IA

La IA en DeliCore HR no busca reemplazar supervisión ni criterio humano. Busca reducir fricción.

Su valor es:

- recordar lineamientos,
- orientar sobre tareas del rol,
- explicar procesos del manual,
- sugerir próximos pasos dentro del alcance permitido.

El diseño del módulo prioriza gobernanza, contexto y consistencia.

---

## 2. Arquitectura Técnica (Breve pero concisa)

### 2.1 Panorama general

DeliCore HR está compuesto por dos grandes capas:

- un Backend en Laravel expuesto como API REST,
- un Frontend en React que funciona como SPA, es decir, una Single Page Application.

### 2.2 Relación entre Backend y Frontend

#### Backend

El backend es responsable de:

- consultar y transformar la información desde base de datos,
- resolver jerarquías de puestos y empleados,
- calcular métricas agregadas,
- exponer catálogos y estructuras útiles para la interfaz,
- validar y persistir acciones del usuario,
- crear relaciones derivadas, como seguimientos KPI automáticos.

#### Frontend

El frontend es responsable de:

- presentar la información por módulos,
- aplicar filtros visuales,
- manejar navegación entre vistas,
- ofrecer flujos guiados para tareas complejas,
- adaptar la experiencia según el tipo de sesión,
- enviar acciones de creación, edición y actualización al backend.

### 2.3 Estilo de integración

La integración se apoya en funciones de servicio del archivo:

- [api.js](C:/Users/Armando/Desktop/proyectos/queso%20las%20delicias/frontend/src/servicios/api.js)

Desde allí el frontend consume endpoints como:

- `/acceso-demo`
- `/panel-general`
- `/organigrama`
- `/directorio-empleados`
- `/perfil-talento`
- `/gestion-usuarios`
- `/centro-kpis`
- `/centro-kpis/definiciones`
- `/centro-kpis/seguimientos/{id}`
- `/asistente-ia-rol`
- `/asistente-ia-rol/consultar`

### 2.4 Flujo de datos general

El flujo estándar es:

1. El usuario inicia una sesión demo.
2. El frontend identifica si la sesión es `admin` o `empleado`.
3. Según el tipo de sesión, el frontend carga módulos distintos.
4. El backend responde con estructuras ya transformadas para ser consumidas por la UI.
5. La UI presenta la información en vistas especializadas.
6. Cuando el usuario ejecuta una acción, el frontend llama a un endpoint de escritura.
7. El backend valida, persiste y devuelve una respuesta actualizada.
8. El frontend recarga o resincroniza la vista correspondiente.

### 2.5 Uso de Eager Loading y jerarquías

Laravel usa `with(...)` para cargar relaciones de forma anticipada y evitar consultas repetitivas.

Esto es especialmente importante en módulos jerárquicos como:

- organigrama,
- directorio,
- perfil de talento,
- centro de KPIs,
- gestión de usuarios.

Ejemplos de relaciones cargadas:

- `puestoPrincipal.departamento`
- `roles.puesto.departamento`
- `supervisorInmediato.puestoPrincipal`
- `subordinados`
- `registrosKpi.definicionKpi`
- `definicionKpi.puesto.departamento`
- `empleado.puestoPrincipal.departamento`

Esto permite:

- construir payloads listos para UI,
- evitar consultas N+1,
- consolidar contexto estructural y operativo en una sola respuesta.

### 2.6 Modelado principal del dominio

El núcleo de datos del sistema gira alrededor de estas entidades:

- `Departamento`
- `Puesto`
- `Empleado`
- `RolEmpleado`
- `ManualPuesto`
- `DefinicionKpi`
- `RegistroKpi`
- `SeguimientoKpi`

Relaciones clave:

- un departamento tiene muchos puestos,
- un puesto puede supervisar otros puestos,
- un puesto tiene empleados principales,
- un empleado tiene un puesto principal,
- un empleado puede tener roles adicionales,
- un KPI puede asignarse a un puesto o a un empleado,
- un seguimiento KPI materializa la tarea operativa de actualización.

### 2.7 Naturaleza de la SPA

El frontend en [App.jsx](C:/Users/Armando/Desktop/proyectos/queso%20las%20delicias/frontend/src/App.jsx) controla la navegación interna mediante estado, sin recargar toda la aplicación entre pantallas.

La variable `vistaActiva` decide qué módulo renderizar. Esto hace que la experiencia sea:

- más fluida,
- más rápida,
- coherente con un entorno administrativo moderno.

---

## 3. Desglose Mega Detallado por Módulos

## 3.A Layout y Navegación Global

### 3.A.1 Qué es

El Layout es la estructura maestra de la aplicación. Define:

- sidebar,
- topbar,
- área principal de contenido,
- comportamiento responsivo,
- información de sesión visible.

Se implementa en:

- [Layout.jsx](C:/Users/Armando/Desktop/proyectos/queso%20las%20delicias/frontend/src/componentes/Layout.jsx)

### 3.A.2 Para qué sirve

Su función es ordenar toda la experiencia y asegurar que cualquier módulo se sienta parte del mismo ecosistema visual y operativo.

### 3.A.3 Sidebar responsivo

El sidebar contiene la navegación principal del sistema y cambia según las vistas permitidas en la sesión.

Opciones posibles:

- `Dashboard`
- `Organigrama`
- `Directorio de Empleados`
- `Gestión de Usuarios`
- `Perfil`
- `KPIs`
- `Seguimiento KPI`
- `Asistente IA`

#### Comportamiento

- En desktop, permanece fijo a la izquierda por defecto, pero ahora puede contraerse o ocultarse manualmente.
- En móvil, puede abrirse y cerrarse mediante botón hamburguesa.
- Usa un overlay oscuro cuando está abierto en pantallas pequeñas.

#### Control de apertura y cierre

El sistema incorpora un control explícito para el sidebar:

- en desktop, el usuario puede colapsarlo u ocultarlo para ganar espacio horizontal,
- en móvil, el mismo patrón abre o cierra el menú lateral,
- la preferencia de apertura en escritorio se guarda en `localStorage`.

#### Lógica de visibilidad

La lista de opciones visibles no es estática. Se calcula con base en `sesion.vistas`.

Esto significa:

- un admin ve más módulos,
- un empleado ve un subconjunto controlado.

### 3.A.4 Topbar

La topbar muestra:

- nombre de producto,
- modo actual del panel,
- botón de cambio de tema,
- selector de idioma,
- avatar y rol activo.

#### Opción: Modo Oscuro / Claro

Se maneja desde el componente `ThemeToggle`.

Funciones:

- alterna entre tema `light` y `dark`,
- persiste preferencia en `localStorage`,
- actualiza la clase `dark` en `document.documentElement`.

#### Opción: Selector de idioma ES/EN

Botón redondo que alterna entre español e inglés.

Impacto:

- cambia textos de navegación,
- cambia placeholders,
- cambia etiquetas,
- cambia mensajes del asistente,
- cambia nombres localizados de paneles.

#### Perfil / Sesión

El bloque derecho muestra:

- avatar con iniciales,
- `Rol activo`,
- nombre de rol actual.

Esto ayuda a evitar ambigüedad sobre el contexto de sesión.

### 3.A.5 Comportamiento activo de navegación

El sidebar no resalta solo la vista exacta, sino también flujos relacionados.

Ejemplo:

- `KPIs` se considera activo también para vistas internas como:
  - sugeridos,
  - wizard de creación de KPI.

Esto mejora la continuidad mental del usuario.

---

## 3.B Dashboard Ejecutivo

### 3.B.1 Qué es

El dashboard es la portada analítica del sistema para el rol administrador.

No intenta mostrar cada detalle del sistema; busca resumir el estado general de la organización.

### 3.B.2 Para qué sirve

Sirve para:

- entender el estado actual de la estructura,
- ver cobertura KPI,
- detectar pendientes operativos,
- acceder rápidamente a módulos clave.

### 3.B.3 Fuentes de datos

Proviene de:

- [ControladorPanelGeneral.php](C:/Users/Armando/Desktop/proyectos/queso%20las%20delicias/api/app/Http/Controllers/Api/ControladorPanelGeneral.php)

### 3.B.4 Métricas principales

El dashboard calcula y muestra:

- empleados activos,
- departamentos activos,
- puestos activos,
- roles múltiples,
- seguimientos pendientes,
- puestos con KPI,
- puestos sin KPI,
- cumplimiento semanal promedio.

### 3.B.5 Cómo se calculan coberturas y áreas activas

#### Cobertura KPI

Se calcula usando:

- cantidad de puestos con al menos una definición KPI,
- dividido entre cantidad total de puestos.

En el detalle por departamento:

- `puestos_con_kpi_count / puestos_count * 100`

#### Áreas activas

El panel cuenta departamentos existentes y además prioriza un conjunto piloto:

- Operaciones,
- Administración y Finanzas,
- Recursos Humanos.

Estas áreas son presentadas con:

- líder,
- cantidad de puestos,
- cantidad de empleados,
- cobertura KPI,
- resumen contextual.

### 3.B.6 Botones y acciones del Dashboard

El dashboard incluye tarjetas de acción directa:

- `Organigrama`
- `Gestión de Usuarios`
- `KPIs`
- `Seguimiento KPI`
- `Asistente IA`

Cada tarjeta es un acceso rápido contextual para reducir clics hacia las áreas más consultadas.

### 3.B.7 Bloques de contenido

#### Hero ejecutivo

Resume:

- objetivo de la empresa,
- cantidad de puestos activos,
- puestos sin KPI,
- cumplimiento semanal.

#### Lectura ejecutiva

Traduce métricas a narrativa operativa:

- cuántos puestos ya tienen KPI,
- cuántos colaboradores tienen roles múltiples,
- cuántos seguimientos siguen pendientes.

#### Resumen principal

Tarjetas con:

- empleados,
- roles híbridos,
- cobertura KPI,
- seguimiento abierto,
- cumplimiento.

#### Departamentos

Tarjetas por área piloto con:

- líder,
- puestos,
- empleados,
- cobertura,
- meta o resumen operativo.

#### KPIs destacados

Lista de puestos con mejor lectura KPI.

#### Seguimiento operativo

Lista de seguimientos pendientes relevantes, tomada desde base de datos.

---

## 3.C Organigrama Interactivo

### 3.C.1 Qué es

El Organigrama es la visualización gráfica de la jerarquía real de puestos dentro de la organización.

### 3.C.2 Para qué sirve

Sirve para:

- entender la relación entre puestos,
- navegar estructura de supervisión,
- ubicar mandos y dependencias,
- abrir contexto detallado de cada nodo.

### 3.C.3 Base de datos y jerarquía real

La jerarquía no está inventada en frontend. Se deriva del campo:

- `puesto_supervisor_id`

en la tabla de puestos.

El backend:

- identifica puestos raíz,
- carga subordinados,
- transforma cada nodo recursivamente.

### 3.C.4 Motor visual

El módulo usa:

- `@xyflow/react` para el canvas interactivo,
- `dagre` a través de utilidades para layout automático.

Archivos clave:

- [Organigrama.jsx](C:/Users/Armando/Desktop/proyectos/queso%20las%20delicias/frontend/src/componentes/Organigrama.jsx)
- [ControladorOrganigrama.php](C:/Users/Armando/Desktop/proyectos/queso%20las%20delicias/api/app/Http/Controllers/Api/ControladorOrganigrama.php)

### 3.C.5 Opciones visibles en interfaz

#### Botón: Ver en Pantalla Completa

Funciones:

- expande el canvas del organigrama a pantalla completa,
- mejora lectura cuando la estructura es grande,
- cambia a `Salir de Pantalla Completa` si ya está expandido.

#### Controles de zoom y paneo

Incluye controles nativos de React Flow:

- acercar,
- alejar,
- recentrar vista.

#### MiniMap

Visible en tamaños amplios:

- ayuda a ubicarse dentro del grafo,
- sirve para navegación contextual rápida.

### 3.C.6 Lógica de navegación

El organigrama:

- no permite arrastrar nodos para reestructurar,
- sí permite panear y explorar,
- ordena nodos automáticamente con `fitView`,
- utiliza un layout jerárquico suavizado.

### 3.C.7 Representación del nodo

Cada nodo representa un puesto, no una persona.

Su información base incluye:

- nombre del puesto,
- nivel,
- propósito,
- departamento,
- líder relacionado,
- manual o contexto del rol.

### 3.C.8 Valor de producto

Este módulo convierte estructura organizacional en una experiencia visual. Su valor no está solo en “verse bonito”, sino en:

- reducir ambigüedad sobre reportes,
- validar coherencia estructural,
- conectar jerarquía con responsabilidades y contexto.

---

## 3.D Directorio de Empleados

### 3.D.1 Qué es

El Directorio de Empleados es la vista operativa de personas del sistema.

### 3.D.2 Para qué sirve

Sirve para:

- consultar colaboradores activos,
- ver su puesto principal,
- identificar supervisores,
- detectar roles adicionales,
- revisar un resumen rápido de cumplimiento KPI.

### 3.D.3 Fuente de datos

Proviene de:

- [ControladorDirectorioEmpleados.php](C:/Users/Armando/Desktop/proyectos/queso%20las%20delicias/api/app/Http/Controllers/Api/ControladorDirectorioEmpleados.php)

### 3.D.4 Indicadores superiores

Muestra tarjetas con:

- empleados activos,
- roles adicionales,
- promedio KPI,
- supervisores.

### 3.D.5 Filtros disponibles

#### Búsqueda libre

Busca por:

- nombre del empleado,
- correo,
- cargo,
- departamento.

#### Filtro por departamento

Permite ver empleados por departamento o cobertura relacionada.

#### Filtro por estado

Permite distinguir entre:

- activos,
- otros estados cargados en la data.

#### Filtro por nivel

Permite segmentar por nivel del puesto principal.

#### Botón `Limpiar filtros`

Reinicia:

- búsqueda,
- departamento,
- estado,
- nivel.

### 3.D.6 Tarjetas de empleado

Cada tarjeta de empleado muestra:

- avatar con iniciales,
- nombre completo,
- correo,
- puesto principal,
- departamento,
- estado,
- supervisor directo,
- número de roles adicionales,
- cumplimiento promedio,
- acceso a detalle.

### 3.D.7 Cómo muestra roles adicionales

Los roles adicionales se visualizan:

- numéricamente en la tarjeta,
- y en detalle al abrir el perfil.

Esto comunica rápidamente si una persona está cubierta por un solo rol o si participa en varios frentes.

### 3.D.8 Cómo muestra supervisores directos

En la tarjeta aparece el supervisor directo en un bloque dedicado.

En el backend se toma desde:

- `supervisor_inmediato_id`

Esto hace que el directorio no sea solo un listado de personas, sino una capa útil de contexto organizacional.

---

## 3.E Perfil 360 (Empleado / Puesto)

### 3.E.1 Qué es

El módulo de Perfil 360 es el espacio donde la organización puede leer a profundidad una ficha funcional, ya sea:

- desde el punto de vista del empleado,
- o desde el punto de vista del puesto.

### 3.E.2 Para qué sirve

Sirve para consolidar:

- identidad organizacional,
- manual operativo,
- jerarquía,
- cobertura de roles,
- responsabilidades,
- KPI reciente.

### 3.E.3 Dos experiencias distintas

#### Perfil de talento para administrador

Implementado en:

- [PerfilTalento.jsx](C:/Users/Armando/Desktop/proyectos/queso%20las%20delicias/frontend/src/componentes/PerfilTalento.jsx)

#### Perfil del empleado autenticado

Implementado en:

- [PerfilEmpleado.jsx](C:/Users/Armando/Desktop/proyectos/queso%20las%20delicias/frontend/src/componentes/PerfilEmpleado.jsx)

### 3.E.4 Vista Administrador: alternancia Empleados / Puestos

Aunque el enunciado habla de “pestañas”, en la implementación actual la navegación principal del perfil admin se hace mediante un selector binario:

- `Empleados`
- `Puestos`

Además, incluye filtros de:

- departamento,
- nivel.

### 3.E.5 Vista Empleados en PerfilTalento

#### Columna izquierda

Lista de empleados filtrados.

Cada botón muestra:

- iniciales,
- nombre,
- puesto principal.

#### Columna derecha

Ficha ampliada del empleado seleccionado con:

- nombre,
- puesto,
- departamento,
- estado,
- correo,
- fecha de ingreso,
- supervisor directo,
- cumplimiento promedio,
- manual resumen,
- responsabilidades clave,
- subordinados,
- roles adicionales,
- KPIs recientes.

### 3.E.6 Vista Puestos en PerfilTalento

Permite leer el puesto como unidad organizacional.

Se visualiza:

- nombre del puesto,
- nivel,
- departamento,
- propósito,
- supervisor del puesto,
- empleados asignados,
- KPIs definidos,
- promedio del puesto.

### 3.E.7 Manual de procedimientos

El sistema no renderiza un “documento completo” como editor, pero sí muestra el resumen operativo del manual vinculado al puesto o departamento.

Fuentes posibles del contenido:

- manual específico del puesto,
- manual del departamento,
- propósito del puesto si no existe manual formal.

Esto se expone como `manual_resumen`.

### 3.E.8 Roles múltiples y distribución porcentual del tiempo

Cada rol adicional puede incluir:

- puesto adicional,
- departamento,
- condición,
- porcentaje de tiempo,
- observaciones.

En la interfaz se muestra como:

- `Puesto · Departamento · % del tiempo`

Esto es clave para reflejar la realidad de coberturas compartidas.

### 3.E.9 Historial de KPIs

El perfil muestra actividad KPI reciente a través de:

- nombre del KPI,
- frecuencia,
- período,
- valor real,
- unidad.

En el perfil empleado autenticado, además se muestran KPIs visibles actualmente asignados y su origen:

- meta individual,
- meta del puesto.

---

## 3.F Centro de KPIs (Vista Administrador)

### 3.F.1 Qué es

El Centro de KPIs es el panel maestro de indicadores.

### 3.F.2 Para qué sirve

Sirve para:

- entender el estado KPI global,
- ver catálogo completo,
- analizar desempeño por equipo,
- detectar brechas,
- crear nuevos indicadores.

### 3.F.3 Estructura de navegación

La vista administrador usa tabs:

- `Vista general`
- `Catálogo`
- `Equipo`
- `Alertas`

Esta organización responde a una decisión deliberada de UX: no saturar al usuario con todo de una vez.

### 3.F.4 Encabezado del módulo

Incluye:

- subtítulo del centro,
- título `KPIs`,
- botón `Seguimiento de KPIs`,
- botón `Crear KPI` para admins.

### 3.F.5 Vista General

Es la primera pestaña y concentra:

- total de KPIs,
- promedio global,
- empleados con KPI,
- seguimientos pendientes.

Además incluye:

#### Bloque `Crear Nuevo KPI`

Contiene:

- explicación corta,
- botón `Iniciar asistente rápido`,
- botón `KPIs sugeridos`.

#### Bloque `Lectura rápida`

Resume:

- cuántos puestos no tienen KPI,
- cuántos KPIs están bajo umbral.

#### Bloque `Foco general`

Muestra los KPIs mejor posicionados de la semana.

#### Bloque `Distribución por área`

Muestra:

- departamento,
- cantidad de KPIs,
- promedio por área,
- barra visual de cumplimiento.

### 3.F.6 Catálogo

Lista todas las definiciones KPI visibles.

Cada tarjeta de KPI muestra:

- nombre,
- puesto,
- departamento,
- empleado específico si aplica,
- frecuencia,
- tipo de asignación,
- descripción,
- meta,
- promedio,
- cantidad de registros,
- fórmula,
- barra de cumplimiento.

### 3.F.7 Equipo

Contiene dos bloques:

#### Rendimiento del equipo

Ranking resumido de empleados por promedio KPI.

Cada fila muestra:

- nombre,
- puesto,
- departamento,
- promedio,
- barra de cumplimiento.

#### Distribución por área

Resumen del reparto KPI por departamento.

### 3.F.8 Alertas / Brechas

Contiene dos alertas principales:

#### Puestos sin KPI

Lista puestos que no tienen ninguna definición activa.

#### KPIs bajo objetivo

Lista indicadores cuyo promedio está por debajo del umbral de referencia.

Esto permite al gerente o admin identificar rápidamente dónde actuar.

### 3.F.9 Creador de KPIs para Admin

El creador se ejecuta en:

- [CrearKpiWizard.jsx](C:/Users/Armando/Desktop/proyectos/queso%20las%20delicias/frontend/src/componentes/CrearKpiWizard.jsx)

#### Lógica general

El proceso está diseñado como un asistente guiado de tres pasos:

1. Asignación
2. Definición
3. Meta y frecuencia

#### Objetivo de diseño

No está pensado como un formulario largo y frío, sino como un flujo progresivo donde el usuario:

- entiende primero a quién afecta,
- luego define el indicador,
- y finalmente configura cómo se medirá.

#### Detalle de cada paso

##### Paso 1. Asignación

Opciones:

- `Asignar por puesto`
- `Asignar a una empleada`

Controles:

- selector de puesto,
- selector de empleado,
- mensajes de contexto sobre alcance.

##### Paso 2. Definición

Controles:

- campo `Nombre del KPI`,
- campo `Descripción y propósito`,
- bloque de recomendación de redacción.

##### Paso 3. Meta y frecuencia

Controles:

- selector `Frecuencia de evaluación`,
- selector `Unidad de medida`,
- input `Fórmula de cálculo`,
- input `Meta esperada`.

#### Resumen lateral del flujo

El wizard incluye un panel lateral permanente con:

- resumen del paso actual,
- asignación elegida,
- nombre visible,
- meta estimada,
- explicación de qué pasará al guardar.

#### Cierre del flujo

Al guardar:

- se crea la definición KPI,
- el backend crea seguimientos correspondientes,
- el admin es redirigido a `Seguimiento KPI` para validar el resultado operativo.

Eso es importante: el sistema está pensado para cerrar el ciclo, no para dejar al admin en un estado de duda.

---

## 3.G Seguimiento de KPIs (Vista Empleado / To-Do Tracker)

### 3.G.1 Qué es

El Seguimiento de KPIs es la capa operativa del sistema. Es donde los indicadores dejan de ser solo definición y se convierten en actividad diaria o semanal.

### 3.G.2 Para qué sirve

Sirve para:

- registrar avance,
- marcar tareas KPI completadas,
- introducir valor actual,
- dejar contexto o justificación,
- ordenar el trabajo por frecuencia.

### 3.G.3 Filosofía del rediseño

La vista fue pensada como un “to-do tracker corporativo” y no como un reporte pesado.

La idea central es:

- el empleado entra,
- identifica pendientes,
- actualiza su realidad del día,
- y deja trazabilidad sin perder tiempo.

### 3.G.4 Encabezado operativo

Incluye una tarjeta destacada de pendientes clave.

En empleado se presenta como:

- `Registro diario`
- cantidad de pendientes clave
- instrucción breve para registrar progreso sin salir del flujo

En admin se presenta como:

- `Control operativo`
- mismo resumen adaptado para validación gerencial

### 3.G.5 Resúmenes superiores

Se muestran tarjetas con:

- seguimientos diarios,
- seguimientos semanales,
- justificaciones registradas,
- modo controlado.

### 3.G.6 Organización por frecuencia

La vista divide los seguimientos en:

- `Diario`
- `Semanal`
- `Otros`

La clasificación se hace normalizando la frecuencia del seguimiento.

### 3.G.7 Cada tarjeta de seguimiento contiene

- checkbox de completado,
- título de la tarea,
- descripción,
- nombre del KPI asociado,
- frecuencia,
- fecha,
- campo para valor actual,
- unidad,
- bloque de justificación.

### 3.G.8 Interacción con el checkbox

Cuando el usuario marca o desmarca:

- el estado cambia visualmente,
- la tarjeta adopta estilo de completado,
- el sistema dispara guardado al backend.

### 3.G.9 Interacción con input numérico

El campo `Valor actual`:

- acepta ingreso manual,
- guarda al perder foco,
- se muestra junto a la unidad,
- ayuda a contrastar el avance contra la meta.

### 3.G.10 Registro de obstáculos diarios

El sistema lo resuelve mediante el bloque de justificación.

#### Características

- textarea guiado,
- placeholder contextual,
- estado visual de guardado,
- contador de caracteres,
- recomendación cuando el KPI va atrasado o no está completado.

#### Estados posibles

- `Sin cambios`
- `Editando`
- `Guardando`
- `Guardado`

#### Cuándo la justificación es recomendada

Cuando:

- el seguimiento no está completado,
- o el valor actual está por debajo de la meta.

Esto hace que la justificación no sea una obligación burocrática universal, sino una herramienta de trazabilidad inteligente.

### 3.G.11 Diferencia entre vista empleado y vista admin

#### Empleado

Ve sus seguimientos directos desde `mi_panel.seguimientos`.

#### Admin

Ve agregación por rol desde `tracker_por_rol`.

Esto permite:

- ejecución individual abajo,
- lectura gerencial arriba.

---

## 3.H Asistente IA (RAG Simulado)

### 3.H.1 Qué es

Es el módulo de soporte contextual por rol.

### 3.H.2 Para qué sirve

Sirve para:

- responder preguntas operativas,
- apoyar a un colaborador en tareas de su rol,
- reducir dependencia de memoria o supervisión informal,
- mantener respuestas dentro del contexto permitido.

### 3.H.3 Filosofía del asistente

No es un chat abierto de propósito general. Está deliberadamente acotado.

Su regla principal es:

- responder solo con el manual, propósito o contexto documental del rol.

### 3.H.4 Comportamiento para admin

El administrador puede:

- explorar todos los roles disponibles,
- seleccionar uno,
- ver su resumen,
- consultar alcance del asistente,
- lanzar preguntas sugeridas o manuales.

### 3.H.5 Comportamiento para empleado

El empleado recibe un asistente enfocado en su rol.

La interfaz refuerza que:

- el asistente está configurado específicamente para su puesto y área,
- el soporte es contextual y no genérico.

### 3.H.6 Elementos de la interfaz

#### Resúmenes superiores

- roles disponibles,
- consultas sugeridas,
- modo controlado,
- cobertura IA.

#### Lista de roles

Solo para admin.

Permite cambiar el rol consultado.

#### Alcance del asistente

Bloque que explica:

- qué puede responder,
- qué límites tiene,
- bajo qué regla opera.

#### Chat por rol

Incluye:

- encabezado con rol activo,
- badge `Responde solo manual`,
- preguntas sugeridas como chips,
- historial de mensajes,
- input de consulta,
- botón enviar.

#### Fuentes consultadas

Muestra:

- origen del fragmento,
- texto usado como fundamento.

Esto da trazabilidad a la respuesta.

### 3.H.7 Cómo extrae contexto del manual

El backend toma, por prioridad:

- manual del puesto,
- manual del departamento,
- propósito del puesto,
- descripción del departamento.

Luego:

- fragmenta el contexto,
- arma una respuesta controlada,
- devuelve fuentes.

Aunque el sistema lo presenta como “RAG simulado”, su filosofía es claramente retrieval-oriented: responder a partir de contenido asociado, no por imaginación libre.

---

## 3.I Gestión de Usuarios (Administrador)

### 3.I.1 Qué es

Es el módulo administrativo para alta, edición y mantenimiento de usuarios internos.

### 3.I.2 Para qué sirve

Sirve para:

- crear empleados,
- editar empleados existentes,
- asignar puesto principal,
- definir supervisor directo,
- ajustar estado,
- registrar fecha de ingreso,
- documentar roles adicionales.

### 3.I.3 Importancia dentro del sistema

Este módulo alinea tres dimensiones que antes podían quedar dispersas:

- estructura,
- identidad del colaborador,
- cobertura funcional.

Si esta capa está bien gestionada:

- el directorio queda coherente,
- el perfil 360 queda coherente,
- la visibilidad KPI queda coherente,
- el acceso demo por rol también queda coherente.

### 3.I.4 Estructura de la pantalla

Implementado en:

- [GestionUsuarios.jsx](C:/Users/Armando/Desktop/proyectos/queso%20las%20delicias/frontend/src/componentes/GestionUsuarios.jsx)

Se compone de:

- encabezado,
- indicadores superiores,
- panel izquierdo de usuarios,
- panel derecho de edición/alta.

### 3.I.5 Indicadores superiores

Muestra:

- usuarios totales,
- usuarios activos,
- administradores,
- roles adicionales.

### 3.I.6 Botón `Nuevo usuario`

Abre el modo de alta limpia.

Efectos:

- limpia el formulario,
- mantiene protegida la lista de usuarios,
- abre explícitamente el panel derecho en modo creación,
- cambia el título del panel derecho a creación.

### 3.I.7 Panel izquierdo

Incluye:

- búsqueda por nombre, correo o puesto,
- filtro por estado,
- filtro por tipo de acceso estimado,
- lista de usuarios.

Cada tarjeta de usuario muestra:

- nombre,
- correo,
- puesto principal,
- tipo de acceso estimado,
- estado,
- supervisor resumido,
- botón `Editar`.

La tarjeta puede seleccionarse para contexto, pero no abre edición por sí sola.

### 3.I.8 Panel derecho

Es la ficha editable, pero ya no permanece abierta permanentemente.

Su nuevo comportamiento es:

- por defecto se muestra un panel vacío o de espera,
- el formulario solo se abre si el admin pulsa `Editar` o `Nuevo usuario`,
- esto reduce el riesgo de cambios accidentales.

Cuando el panel está cerrado, la interfaz muestra:

- una explicación de seguridad operativa,
- un acceso a `Crear nuevo usuario`,
- un acceso a `Editar usuario seleccionado` si ya hay uno elegido en la lista.

Campos:

- nombre completo,
- correo corporativo,
- puesto principal,
- supervisor directo,
- fecha de ingreso,
- estado.

### 3.I.9 Vista previa de acceso

El sistema calcula una estimación de acceso:

- `Administrador`
- `Empleado`

En esta demo, la lógica depende del puesto principal. Si el puesto principal coincide con ciertas posiciones estratégicas, el perfil se considera admin.

### 3.I.10 Roles adicionales

El admin puede:

- agregar rol,
- seleccionar puesto adicional,
- seleccionar condición,
- asignar porcentaje de tiempo,
- escribir observaciones,
- quitar rol.

Cada rol adicional se persiste en `roles_empleado`.

### 3.I.11 Resultado esperado

Una vez guardado el usuario:

- queda disponible en gestión,
- debe verse en directorio,
- debe impactar perfil,
- y puede afectar el alcance visible de módulos orientados por rol.

---

## 4. Flujos de Uso Clave

## 4.1 Cómo crear empleados

### Objetivo del flujo

Dar de alta un colaborador dentro del sistema con una estructura coherente para que pueda ser administrado, ubicado en el directorio y reflejado correctamente en los módulos de perfil, jerarquía y roles.

### Paso a paso detallado

1. Ingresar como administrador.

2. Desde el sidebar o desde el dashboard, abrir `Gestión de Usuarios`.

3. Revisar la pantalla general:

- en la parte superior verás los indicadores de usuarios,
- a la izquierda la lista filtrable de usuarios,
- a la derecha verás un panel cerrado de seguridad, no el formulario abierto.

4. Presionar el botón `Nuevo usuario`.

5. El panel derecho se abrirá en modo de creación.

6. Completar el bloque principal:

- `Nombre completo`
- `Correo corporativo`
- `Puesto principal`
- `Supervisor directo`
- `Fecha de ingreso`
- `Estado`

7. Validar la `Vista previa de acceso`.

Esto no es decorativo. Permite confirmar si, por el puesto seleccionado, el sistema estimará al colaborador como:

- administrador,
- o empleado.

8. Si el colaborador cubre más de una función, usar el bloque `Roles adicionales`.

Para cada rol adicional:

- presionar `Agregar rol`,
- seleccionar `Puesto adicional`,
- definir `Condición`,
- introducir `Porcentaje de tiempo`,
- añadir `Observaciones` si hace falta.

9. Presionar `Crear usuario`.

10. El backend:

- valida datos,
- crea el empleado,
- sincroniza roles adicionales,
- devuelve el nuevo registro.

11. El frontend recarga:

- gestión de usuarios,
- acceso demo,
- y el usuario queda seleccionado.

### Cómo está pensado este flujo

Este flujo está pensado para evitar altas “vacías” o desconectadas.

El diseño obliga al administrador a pensar el usuario como parte de una estructura:

- quién es,
- dónde está,
- a quién reporta,
- qué más cubre,
- y cómo debe interpretarse su acceso.

No es solo creación de registro; es construcción de contexto organizacional.

---

## 4.2 Cómo un admin crea KPI, todo detallado

### Objetivo del flujo

Crear una métrica formal que quede alineada con la organización y que además genere seguimiento operativo real.

### Entrada al flujo

El admin puede entrar al creador KPI desde:

- el Centro de KPIs,
- el bloque de creación rápida,
- o el botón de acción contextual.

### Paso a paso detallado

1. Abrir el módulo `KPIs`.

2. Permanecer en la pestaña `Vista general`.

3. Ubicar el bloque `Crear Nuevo KPI`.

4. Presionar `Iniciar asistente rápido`.

5. Se abrirá el asistente de creación KPI.

#### Paso 1. Asignación

En este paso el admin decide el alcance.

Opciones:

- `Asignar por puesto`
- `Asignar a una empleada`

##### Si elige por puesto

Debe:

- abrir el selector,
- elegir el puesto general asignado.

Resultado esperado:

- el KPI se aplicará a quienes ocupen ese puesto.

##### Si elige por empleado

Debe:

- abrir el selector,
- elegir al empleado específico.

Resultado esperado:

- el KPI será individual.

6. Presionar `Siguiente`.

#### Paso 2. Definición

En este paso el admin crea la identidad del indicador.

Campos:

- `Nombre del KPI`
- `Descripción y propósito`

Buenas prácticas recomendadas por el diseño:

- usar un nombre corto y accionable,
- describir qué se mide,
- explicar por qué importa.

7. Presionar `Siguiente`.

#### Paso 3. Meta y frecuencia

Campos:

- `Frecuencia de evaluación`
- `Unidad de medida`
- `Fórmula de cálculo`
- `Meta esperada`

Este paso determina cómo aparecerá el KPI en seguimiento.

8. Revisar el panel lateral `Resumen del flujo`.

Allí el admin confirma:

- tipo de asignación,
- a quién impacta,
- nombre visible,
- meta esperada,
- y lo que ocurrirá al guardar.

9. Presionar `Crear y revisar seguimiento`.

### Qué ocurre técnicamente al guardar

El backend:

1. valida si se recibió puesto o empleado,
2. si es por empleado, deriva el `puesto_id` desde el puesto principal del colaborador,
3. crea la definición KPI,
4. define el origen:
   - `admin_empleado`
   - `admin_manual`
5. llama a `crearSeguimientosParaDefinicion(...)`,
6. crea o actualiza seguimientos KPI para los empleados objetivo.

### Qué ocurre en el frontend después

Si la operación es exitosa:

- se recargan los datos,
- la aplicación navega a `Seguimiento KPI`,
- el admin puede verificar inmediatamente que el KPI ya generó tareas operativas.

### Cómo está pensado para crear KPI

El flujo fue pensado para resolver tres problemas comunes:

#### Problema 1. Saturación en la creación

Se evita con pasos progresivos.

#### Problema 2. Ambigüedad sobre alcance

Se resuelve separando:

- KPI por puesto,
- KPI por empleado.

#### Problema 3. Incertidumbre post guardado

Se resuelve llevando al admin directo a Seguimiento KPI para validar la siembra.

En otras palabras: el sistema no piensa la creación KPI como un fin en sí mismo, sino como el inicio de una cadena operativa.

---

## 4.3 Cómo un empleado registra su día

### Objetivo del flujo

Permitir al colaborador cerrar o actualizar sus tareas KPI del día con la menor fricción posible.

### Paso a paso

1. Ingresar con perfil empleado.

2. Desde el dashboard o desde el sidebar, abrir `Seguimiento KPI`.

3. Leer la tarjeta superior de pendientes clave.

Allí el sistema indica:

- cuántos pendientes tiene,
- y que su registro diario debe resolverse sin salir del flujo.

4. Revisar la columna `Diario`.

Si tiene tareas:

- verás tarjetas con checkbox, valor actual y justificación.

5. Para cada tarea:

- marcar `completado` si ya fue atendida,
- o dejarla pendiente si aún no se ha cerrado.

6. Ingresar el `Valor actual`.

Ejemplos:

- porcentaje,
- tickets,
- pedidos,
- visitas,
- unidades de negocio.

7. Si hubo bloqueo, desviación o cumplimiento parcial, escribir en `Justificación`.

El sistema sugiere justificar cuando:

- no está completado,
- o el valor sigue bajo la meta.

8. Salir del campo de justificación o del input numérico.

El guardado se dispara automáticamente al perder foco.

9. Revisar el estado visual:

- `Editando`
- `Guardando`
- `Guardado`
- `Sin cambios`

10. Repetir para seguimientos semanales u otros si existen.

### Cómo está pensado este flujo

El diseño prioriza:

- rapidez,
- baja carga cognitiva,
- trazabilidad,
- y claridad de responsabilidad.

No está pensado como formulario de cierre mensual; está pensado como rutina operativa recurrente.

---

## 4.4 Cómo un gerente revisa las alertas

### Objetivo del flujo

Permitir al responsable de gestión identificar brechas KPI y actuar sobre ellas.

### Paso a paso

1. Ingresar como administrador.

2. Abrir el módulo `KPIs`.

3. Ir a la pestaña `Alertas`.

4. Revisar la tarjeta `Puestos sin KPI`.

Aquí el gerente puede identificar:

- qué roles siguen sin definición KPI,
- en qué departamentos están.

5. Revisar la tarjeta `KPIs bajo objetivo`.

Aquí puede identificar:

- nombre del indicador,
- puesto,
- departamento,
- promedio actual.

6. Volver a `Vista general` si necesita iniciar acción correctiva.

Desde allí puede:

- abrir `KPIs sugeridos`,
- iniciar el creador KPI,
- o moverse a `Seguimiento KPI`.

7. Si la revisión requiere acción estructural, puede cruzar con:

- `Gestión de Usuarios`,
- `Directorio`,
- `Perfil`,
- `Organigrama`.

### Cómo está pensado este flujo

La idea es que las alertas no sean un tablero aislado, sino un punto de entrada a acción:

- crear métricas,
- revisar responsables,
- entender jerarquía,
- validar seguimiento.

---

## 5. Conclusión Operativa

DeliCore HR está diseñado como una plataforma integral para ordenar estructura, ejecución y soporte.

Su valor no radica en un único módulo, sino en cómo se conectan entre sí:

- el organigrama explica la jerarquía,
- el directorio organiza a las personas,
- el perfil consolida contexto,
- gestión de usuarios mantiene coherencia estructural,
- los KPIs formalizan la medición,
- el seguimiento convierte esa medición en rutina,
- y la IA ofrece soporte contextual controlado.

En conjunto, el sistema está pensado para que una empresa pueda pasar de una operación fragmentada a una operación visible, trazable y gobernable.

Ese es el sentido profundo de DeliCore HR: no solo mostrar información, sino convertir estructura y desempeño en un sistema operativo empresarial legible para todos sus actores.
