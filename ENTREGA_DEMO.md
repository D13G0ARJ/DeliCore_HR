# Entrega de Demo

## DeliCore HR

**Workforce Intelligence para estructura operativa, trazabilidad por rol y seguimiento KPI**

## Objetivo de este documento

Este documento acompaña el enlace del repositorio y está pensado para explicar de forma clara qué contiene la demo, cómo debe recorrerse y cuál es el alcance real del MVP construido.

La propuesta presentada toma como base el caso del cliente compartido durante la prueba técnica: una organización con una estructura real ya existente, pero con baja trazabilidad operativa, múltiples roles asumidos por una misma persona, seguimiento manual de tareas y ausencia de una capa centralizada para métricas, responsabilidades y apoyo contextual por puesto.

La intención de esta demo no es mostrar un CRUD genérico de RRHH, sino una plataforma interna enfocada en:

- visualizar la estructura real de la empresa
- identificar claramente puestos, supervisión y responsabilidades
- reflejar la complejidad de empleados con múltiples roles
- centralizar KPIs, seguimiento operativo y brechas
- mostrar cómo se integraría un asistente IA por rol

---

## Resumen ejecutivo del producto

DeliCore HR es una SPA corporativa respaldada por una API REST en Laravel. Su propósito es digitalizar el sistema interno de registro de tareas, roles y desempeño, reduciendo la dependencia de hojas de cálculo y conocimiento informal.

La demo cubre seis capacidades principales:

1. `Dashboard ejecutivo`
2. `Organigrama navegable`
3. `Directorio de empleados`
4. `Perfil de empleado y puesto`
5. `Centro KPI y seguimiento`
6. `Asistente IA por rol`

---

## Razonamiento del nombre DeliCore HR

El nombre `DeliCore HR` no fue elegido al azar. Fue planteado como una construcción de marca orientada a proyectar profesionalismo, pertenencia con la operación del cliente y percepción de producto SaaS moderno.

### Deli

`Deli` conecta directamente con la identidad de `Las Delicias Import LLC`.

Además, en el mercado internacional la palabra `Deli` suele asociarse con productos gourmet, quesos y alimentos de alta calidad, lo cual refuerza de manera natural el rubro del negocio.

### Core

`Core` representa la idea de núcleo, corazón o centro operativo.

Se usó para transmitir que el sistema no debe percibirse como un accesorio administrativo, sino como el punto central donde vive la información crítica de la empresa:

- organigrama
- manuales
- trazabilidad operativa
- KPIs
- inteligencia funcional por rol

### HR

`HR` es el estándar global asociado a soluciones de `Human Resources`.

Su presencia en el nombre comunica inmediatamente el dominio funcional de la plataforma:

- gestión de personas
- estructura organizacional
- desempeño
- soporte por rol

### Síntesis de marca

En términos simples, el nombre comunica:

`El corazón operativo de Las Delicias para la gestión de su gente`

Esto ayuda a que la solución se perciba como una herramienta tecnológica de nivel internacional y no solo como un desarrollo interno aislado.

---

## Tecnologías utilizadas

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

### Enfoque de arquitectura

La solución fue estructurada con una separación clara entre:

- capa de datos
- capa API
- capa de presentación
- componentes modulares por dominio

Esto permite mantener el proyecto escalable, legible y fácil de extender.

---

## Recorrido sugerido de la demo

Para evaluar el producto, se recomienda recorrerlo en este orden:

1. Ingresar por el `login visual`
2. Revisar el `Dashboard`
3. Navegar al `Organigrama`
4. Explorar el `Directorio de Empleados`
5. Abrir el `Perfil`
6. Revisar el módulo de `KPIs`
7. Finalizar con el `Asistente IA`

Ese flujo permite entender el sistema como una historia operativa completa y no como vistas aisladas.

---

## Navegación principal

La aplicación está organizada como una plataforma SaaS B2B con `Sidebar`, `Topbar` y contenido principal dinámico.

### Sidebar y sus módulos

- `Dashboard`
  Icono: panel ejecutivo
  Función: mostrar la visión general de la operación.

- `Organigrama`
  Icono: red o estructura
  Función: visualizar la jerarquía real y abrir fichas por nodo.

- `Directorio de Empleados`
  Icono: usuarios
  Función: listar personas, filtrar, buscar y abrir detalle funcional.

- `Perfil`
  Icono: ficha de usuario
  Función: profundizar por empleado o por puesto.

- `KPIs`
  Icono: medidor / analytics
  Función: ver cobertura KPI, seguimiento, brechas y sugerencias.

- `Asistente IA`
  Icono: bot
  Función: representar la futura experiencia de consulta guiada por rol.

### Topbar

La barra superior incluye:

- selector de idioma `ES/EN`
- toggle de tema `Claro/Oscuro`
- perfil visual `Super Admin`
- apertura y cierre del menú en dispositivos móviles

---

## Módulos implementados

## 1. Dashboard

El dashboard fue rediseñado para verse como una consola ejecutiva y no como una colección de tarjetas aisladas.

### Qué muestra

- resumen de empleados activos
- roles híbridos detectados
- cobertura KPI por puesto
- seguimientos KPI pendientes
- promedio de cumplimiento
- áreas piloto
- focos KPI destacados
- seguimiento operativo pendiente
- alertas
- estado del asistente IA

### Sobre el bloque "Asistente IA por rol" dentro del dashboard

Ese bloque no representa el chat completo en sí mismo. Su función dentro del dashboard es actuar como una `tarjeta ejecutiva de estado` para la futura capa de IA del sistema.

Lo que comunica ese panel es:

- `Status`
  Indica el nivel de madurez actual del módulo. En esta demo aparece como `Piloto`.

- `Available roles`
  Muestra cuántos roles o puestos ya cuentan con contexto operativo suficiente para una futura consulta guiada. Es decir, cuántos tienen manual, propósito o información funcional utilizable.

- `Active role`
  Muestra el rol de referencia usado para enseñar el concepto dentro de la demo. No significa que sea el único rol posible, sino el ejemplo activo más visible en esta versión.

### Qué debe interpretarse de ese bloque

Ese panel responde a la pregunta:

`¿Qué tan preparada está la organización para tener un asistente IA por rol?`

No busca reemplazar el módulo completo del asistente, sino resumir visualmente:

- el estado del piloto
- la cobertura funcional disponible
- el punto de partida del caso de uso

En otras palabras, dentro del dashboard cumple una función de `indicador estratégico`, mientras que el módulo `Asistente IA` del menú lateral representa la experiencia operativa detallada.

### Qué valor aporta

Este módulo permite entender rápidamente:

- cuánta estructura está activa
- cuántos roles múltiples existen
- qué tan cubierta está la organización con KPIs
- dónde hay carga operativa pendiente

### Estado actual

Está funcional y consume datos reales sembrados desde backend.

---

## 2. Organigrama

El organigrama busca reflejar la estructura real enviada por el cliente, incluyendo:

- Dueños
- Director General
- Asistentes
- Operaciones
- Logística
- Administración y Finanzas
- Recursos Humanos
- IT/Sistemas

y sus subramas:

- Ventas
- Bodega
- Pickeo & Soporte
- Choferes
- Delivery
- Bookkeeping
- Account Receivable
- Account Payable
- Payroll

### Implementación

El renderizado se hizo con:

- `React Flow`
- `Dagre`

para obtener un layout jerárquico más robusto que una implementación tradicional basada solo en HTML/CSS.

### Funcionalidades

- zoom
- controles de navegación
- pantalla completa
- apertura de ficha lateral por nodo
- colorización por rama
- adaptación visual para escritorio y móvil

### Estado actual

El módulo está funcional, navegable y visualmente presentable.

### Observación honesta pendiente

Todavía falta una última capa de ajuste fino para que el organigrama quede todavía más alineado con el PDF original compartido por el cliente, especialmente en:

- microdistribución espacial entre ramas
- proporción exacta entre algunos nodos
- peso visual relativo de ciertos bloques

Es importante aclarar que la estructura lógica ya está cargada y operativa; lo pendiente es principalmente una mejora de fidelidad visual respecto al documento de referencia.

---

## 3. Directorio de Empleados

Este módulo fue pensado para superar una visión básica de “tabla de empleados”.

### Qué permite

- buscar por nombre, cargo o correo
- filtrar por departamento, estado y nivel
- ver cargo principal
- ver supervisor directo
- ver roles adicionales
- revisar antigüedad
- abrir detalle funcional

### Enfoque de producto

El directorio no solo lista personas. Ayuda a responder preguntas como:

- quién cubre qué
- qué personas tienen más de un rol
- quién reporta a quién
- qué contexto operativo tiene cada colaborador

### Estado actual

Está implementado y conectado a datos reales de demo.

---

## 4. Perfil de Empleado / Puesto

Este módulo consolida la parte más analítica de talento y operación.

### Vista por empleado

Permite revisar:

- identidad y datos base
- cargo principal
- supervisor inmediato
- roles adicionales
- subordinados
- responsabilidades clave
- resumen operativo
- actividad KPI reciente

### Vista por puesto

Permite revisar:

- propósito del puesto
- supervisor del puesto
- empleados asignados
- responsabilidades funcionales
- KPIs definidos para ese rol

### Valor funcional

Este módulo es el puente entre:

- estructura organizacional
- personas
- responsabilidades
- desempeño

### Estado actual

Está implementado y funcional.

---

## 5. Centro KPI

Este módulo se construyó para que la demo no se quedara solo en “mostrar KPIs”, sino también en `operarlos`.

### Qué incluye

- resumen general de cobertura KPI
- catálogo KPI
- rendimiento del equipo
- seguimiento reciente
- brechas operativas
- distribución por área
- tracker por rol
- KPIs sugeridos

### Seguimiento operativo

El tracker permite representar el seguimiento de tareas/KPIs mediante check-ins por rol.

La intención es mostrar cómo una persona puede:

- visualizar sus pendientes
- marcar seguimiento
- relacionar el check-in con un KPI concreto
- entender frecuencia, meta y contexto

### KPIs sugeridos

También se incluye una vista de KPIs sugeridos para roles sin KPI formalizado, explicando:

- nombre del KPI sugerido
- frecuencia
- meta
- por qué se sugiere

### Estado actual

Está implementado como MVP funcional y consume la lógica de backend sembrada para la demo.

---

## 6. Asistente IA por Rol

Este módulo fue diseñado para comunicar claramente cómo se vería la experiencia final del asistente IA dentro del producto.

### Qué se puede ver

- selección de rol
- preguntas sugeridas
- bloque conversacional
- fuentes consultadas
- alcance del asistente

### Qué representa

La idea funcional es que cada rol tenga una consulta acotada a su manual, evitando respuestas abiertas o inventadas fuera de contexto.

En esta demo, el módulo y el bloque resumido del dashboard ayudan a visualizar cómo operaría esa experiencia una vez que la capa IA esté completada:

- el usuario selecciona un rol
- el sistema identifica el contexto documental de ese puesto
- la consulta se limita al manual y a la descripción operativa disponible
- la respuesta ideal se entrega con trazabilidad de fuentes

### Estado real del módulo

Este apartado quedó a nivel de `maquetación funcional y simulación de experiencia`, con estructura visual y flujo preparados para demostrar el concepto.

La implementación final de IA productiva aún está pendiente, especialmente en:

- integración real con proveedor LLM
- embeddings persistentes
- RAG formal por manual/rol
- gobierno de contexto y trazabilidad fina

En otras palabras:

- sí muestra cómo se usaría
- sí comunica la propuesta de valor
- pero todavía no debe considerarse una integración final de IA en producción

Esto se dejó así a propósito para que la demo transmitiera la visión del producto sin sobredimensionar una implementación que todavía requeriría una fase posterior.

---

## Internacionalización

La interfaz soporta español e inglés mediante una capa sencilla de i18n.

### Alcance actual

Se traduce:

- navegación
- etiquetas
- acciones
- vistas
- gran parte del contenido dinámico conocido

### Observación

Como el backend de demo trabaja con contenido operativo principalmente en español, algunas traducciones dinámicas se resuelven mediante mapeo desde frontend. Para una siguiente fase productiva sería recomendable llevar esa capa a un nivel más formal.

---

## Responsive y experiencia de uso

La aplicación fue ajustada para comportarse mejor en móvil.

### Mejoras incluidas

- sidebar offcanvas
- overlay de cierre
- botón hamburguesa
- cierre automático al navegar
- espaciado más compacto en topbar y contenido

El foco principal de la demo sigue siendo escritorio, pero ya existe una base razonable para validación móvil.

---

## Alcance real del MVP

## Lo que sí está cubierto

- arquitectura base backend + frontend
- datos reales sembrados
- navegación SaaS
- dashboard ejecutivo
- organigrama navegable
- directorio funcional
- perfiles por empleado y puesto
- centro KPI con seguimiento
- maqueta funcional del asistente IA

## Lo que aún puede mejorarse en una siguiente iteración

- ajuste visual fino del organigrama para parecerse todavía más al PDF original
- autenticación real y permisos
- capa RAG/LLM real para el asistente IA
- auditoría histórica
- formularios de carga/edición productivos
- enriquecimiento de manuales y fuentes documentales

---

## Cómo ejecutar la demo localmente

Consultar el archivo principal del repositorio:

- `README.md`

Allí se detallan:

- requisitos previos
- configuración de `.env`
- configuración de base de datos
- comando de migraciones y seeders
- comando para correr API y frontend

---

## Cierre

Esta demo fue construida para validar la dirección del producto, su arquitectura y su experiencia operativa.

El valor principal no está en “mostrar pantallas”, sino en demostrar que la solución puede:

- traducir una estructura real a software útil
- modelar roles múltiples
- conectar responsabilidades con seguimiento
- preparar una futura capa de IA de forma controlada

Si se desea, este MVP puede evolucionar sin rehacerse desde cero hacia una versión más robusta de uso interno.
