# Guia de Presentacion

## Objetivo de esta defensa

Esta guía está pensada para presentar DeliCore HR ante gerencia, producto o equipo técnico, mostrando que la demo no es una colección de pantallas, sino una solución coherente a un problema operativo real.

## Mensaje de apertura

> DeliCore HR no busca reemplazar un simple Excel con otra interfaz. Busca convertir la estructura organizacional en una operación visible, medible y asistida por IA. El valor principal del sistema está en conectar organigrama, responsabilidades, KPIs, seguimiento y soporte contextual por rol dentro de una sola plataforma.

---

## Estrategia de venta por módulo

## 1. Dashboard

### Qué decir

El dashboard funciona como la capa ejecutiva del sistema. Permite ver en segundos qué áreas están activas, cuántos puestos están priorizados, qué tan madura está la estructura KPI y dónde existen alertas operativas.

### Valor para gerencia

- reduce la dependencia de reportes manuales
- entrega visibilidad transversal
- permite detectar sobrecarga, brechas o falta de formalización

## 2. Organigrama

### Qué decir

Aquí no mostramos un organigrama decorativo. Mostramos la estructura operativa real del cliente, con relaciones entre dueños, dirección, logística, operaciones, finanzas, RRHH e IT.

### Valor para gerencia

- clarifica quién reporta a quién
- visibiliza áreas críticas y ramas operativas
- sirve como puerta de entrada a manuales y responsabilidades

## 3. Directorio 360

### Qué decir

El directorio no es un simple listado de empleados. Cada persona se convierte en una unidad operativa con contexto: cargo principal, supervisor, roles adicionales, KPIs y manual operativo resumido.

### Valor para gerencia

- permite detectar híbridos operativos
- ayuda a distribuir mejor la carga de trabajo
- reduce opacidad en responsabilidades

## 4. Perfil de empleado y puesto

### Qué decir

Este módulo permite profundizar en una persona o en un cargo específico. Muestra propósito, responsabilidades clave, subordinados, manual resumido y KPIs relacionados.

### Valor para gerencia

- sirve para evaluación funcional
- ayuda a onboarding y capacitación
- convierte cada puesto en una unidad documentada

## 5. KPI Tracker

### Qué decir

El centro de KPIs tiene dos capas: analítica y operativa. No solo muestra métricas; también permite seguir tareas de control y marcar el avance por rol. Además, identifica puestos sin KPI y propone métricas sugeridas con justificación.

### Valor para gerencia

- reemplaza seguimiento manual disperso
- formaliza hábitos operativos recurrentes
- facilita priorización de métricas faltantes

## 6. Asistente IA por rol

### Qué decir

Este es el gran diferenciador. El asistente no es un chat genérico. Cada rol consulta un asistente limitado al manual asociado. Eso reduce riesgo, mejora adopción y convierte conocimiento operativo en soporte accesible.

### Valor para gerencia

- disminuye dependencia de conocimiento informal
- acelera entrenamiento
- estandariza respuestas sobre procesos internos

---

## Argumentos de negocio

## Por qué se priorizó el manejo de roles múltiples

Porque el problema real del cliente no es solo “tener empleados”, sino tener personas que absorben funciones cruzadas entre áreas. Un CRUD tradicional de RRHH no resuelve eso.

### Mensaje clave

> Si una persona cubre dos o tres funciones y eso no se modela, la empresa pierde trazabilidad, no puede repartir carga y tampoco puede medir correctamente.

## Por qué se priorizó el Asistente IA

Porque el valor no está solo en visualizar información, sino en volverla utilizable dentro del flujo diario. El asistente permite que el manual deje de ser un PDF muerto y se convierta en soporte operativo activo.

### Mensaje clave

> La IA no está puesta como adorno. Está diseñada para responder mejor, más rápido y con menos riesgo operativo.

## Por qué el tracker KPI es importante

Porque muchas organizaciones sí saben qué quieren medir, pero no tienen disciplina operativa para registrar la ejecución diaria. El tracker cubre ese espacio entre definición KPI y seguimiento real.

---

## Defensa de arquitectura

## Backend

### Eager Loading y prevención de N+1

Los controladores principales cargan relaciones con `with(...)` para evitar consultas repetitivas por:

- puesto
- departamento
- supervisor
- manual
- registros KPI
- roles adicionales

### Cómo defenderlo

> En un producto con organigrama, perfiles y KPIs, renderizar todo con consultas perezosas generaría N+1 rápidamente. El eager loading asegura consistencia y reduce costo de acceso a datos.

## Frontend

### Aislamiento por componentes

Cada módulo principal vive en un componente dedicado:

- `Organigrama`
- `DirectorioEmpleados`
- `PerfilTalento`
- `CentroKpis`
- `AsistenteIaRol`

### Cómo defenderlo

> Esta separación evita que App.jsx concentre toda la lógica y permite evolucionar cada capacidad del producto sin reescribir el resto de la SPA.

## Organigrama

### React Flow + Dagre

Se eligió una solución basada en grafo en lugar de HTML tradicional para lograr mayor control espacial, mejor escalabilidad visual y manejo más robusto de nodos complejos.

### Cómo defenderlo

> Un CSS tree puro es útil para árboles simples. Para una estructura corporativa real con excepciones visuales, React Flow y Dagre ofrecen un control mucho más mantenible.

## IA localizada por rol

### Por qué es más segura que un prompt abierto

El asistente no recibe contexto global de la empresa. Solo trabaja con:

- manual del puesto
- descripción del departamento
- propósito del rol

### Cómo defenderlo

> Una IA de prompt abierto puede alucinar procesos, mezclar áreas o inventar respuestas. Un RAG localizado por rol reduce ese riesgo y mantiene la respuesta dentro del marco operativo correcto.

---

## Preguntas difíciles y cómo responderlas

## “¿Por qué no hicieron autenticación completa?”

Porque la meta del MVP era validar producto, estructura operativa y experiencia funcional. Se decidió priorizar flujo de negocio y arquitectura modular antes que una capa de seguridad completa.

## “¿Esto ya usa IA real?”

Sí, a nivel de experiencia de producto el módulo ya está preparado para consumo contextual por rol. En esta demo la lógica está controlada con recuperación contextual simulada, pero la arquitectura permite evolucionar a embeddings y proveedores LLM sin rehacer el frontend.

## “¿Por qué los nombres del backend están en español?”

Porque fue un requerimiento explícito del cliente para mantener legibilidad local en modelos, migraciones, endpoints y dominio de negocio.

## “¿Esto puede crecer a producción?”

Sí. La estructura actual ya separa:

- dominio
- API
- frontend modular
- carga de datos por relaciones
- localización

Lo siguiente natural sería autenticación, permisos, auditoría y RAG persistente.

---

## Cierre comercial sugerido

> Esta demo valida que el problema del cliente fue entendido correctamente y que la solución no se limita a visualizar organigramas o empleados. DeliCore HR propone una plataforma donde cada rol tiene estructura, contexto, medición y soporte. Eso convierte una operación informal en una operación visible, gobernable y escalable.
