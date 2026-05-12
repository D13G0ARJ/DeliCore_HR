# DeliCore HR API

## Stack

- PHP
- Laravel
- MySQL o PostgreSQL

La API de DeliCore HR está diseñada como un backend REST desacoplado, orientado a servir una SPA en React y a modelar la estructura operativa del negocio con foco en organigrama, roles múltiples, KPIs y consultas contextuales por manual.

## Objetivo funcional del backend

El backend resuelve un problema de negocio específico: representar en base de datos una organización donde el organigrama existe, pero la ejecución diaria depende de múltiples responsabilidades, manuales dispersos, seguimiento manual y personas que asumen más de un rol.

La API transforma esa realidad en:

- relaciones jerárquicas navegables
- empleados vinculados a puestos y supervisores
- roles adicionales con porcentaje de tiempo
- manuales reutilizables por puesto o departamento
- definición y registro de KPIs
- seguimiento operativo accionable
- consultas IA limitadas al contexto del rol

## Esquema relacional

### `departamentos`

Representa las áreas del negocio. Puede estructurarse jerárquicamente mediante `departamento_padre_id`.

Campos clave:

- `nombre`
- `descripcion`
- `lider_nombre`
- `departamento_padre_id`

### `puestos`

Representa la jerarquía operativa real del organigrama. La relación `puesto_supervisor_id` permite construir el árbol de reporte entre dueños, dirección, áreas y subáreas.

Campos clave:

- `departamento_id`
- `puesto_supervisor_id`
- `nombre`
- `nivel`
- `proposito`

### `empleados`

Contiene a las personas de la operación y las enlaza con su cargo principal y supervisor inmediato.

Campos clave:

- `puesto_principal_id`
- `supervisor_inmediato_id`
- `nombre_completo`
- `correo`
- `antiguedad_texto`
- `fecha_ingreso`
- `estado`

### `roles_empleado`

Esta tabla es el centro de la lógica de roles múltiples. En la especificación funcional del negocio se puede pensar como el equivalente a una tabla de `asignaciones_roles`.

Su función es permitir que un empleado tenga:

- un rol principal
- uno o varios roles adicionales
- un porcentaje de tiempo por cada asignación

Campos clave:

- `empleado_id`
- `puesto_id`
- `tipo_rol`
- `condicion`
- `porcentaje_tiempo`
- `observaciones`

#### Por qué esta tabla resuelve el problema

En este proyecto no basta con almacenar un solo cargo por persona. El cliente trabaja con empleados que absorben más de una responsabilidad. `roles_empleado` permite:

- modelar híbridos operativos sin duplicar personas
- medir distribución de carga
- detectar solapamientos
- habilitar trazabilidad real por rol adicional

Ejemplo:

- `Diego Sanabria` tiene rol principal en `ASISTENTES`
- además tiene un rol adicional en `IT/SISTEMAS`
- con un porcentaje de tiempo asociado

### `manuales_puesto`

Contiene el contexto documental usado tanto por la interfaz como por el asistente IA. Puede enlazarse a un puesto o a un departamento.

Campos clave:

- `puesto_id`
- `departamento_id`
- `titulo`
- `contenido`
- `archivo_origen`

### `definiciones_kpi`

Catálogo de KPIs definidos por puesto.

Campos clave:

- `puesto_id`
- `nombre`
- `descripcion`
- `formula`
- `frecuencia`
- `meta_valor`
- `unidad`
- `origen`

### `registros_kpi`

Valores registrados para un KPI por empleado y periodo.

Campos clave:

- `empleado_id`
- `definicion_kpi_id`
- `periodo_inicio`
- `periodo_fin`
- `valor_real`
- `comentarios`

### `seguimientos_kpi`

Tabla operativa de seguimiento. Permite implementar el tracker tipo checklist/habit tracker por rol y KPI.

Campos clave:

- `empleado_id`
- `puesto_id`
- `definicion_kpi_id`
- `titulo`
- `descripcion`
- `frecuencia`
- `fecha_seguimiento`
- `completado`
- `valor_actual`
- `meta_valor`
- `unidad`

## Seeders

### `DatosDemoSeeder`

`DatosDemoSeeder` es el seeder principal del proyecto. Su objetivo no es solo poblar tablas, sino construir una demo coherente con el caso real del cliente.

Inyecta:

- el organigrama real base
- departamentos principales y subramas
- puestos jerárquicos con `puesto_supervisor_id`
- empleados reales de demo
- roles adicionales con distribución porcentual
- manuales operativos usados por el asistente IA
- definiciones KPI
- registros KPI
- seguimientos KPI

### Organigrama real sembrado

El seeder reproduce la estructura:

- `DUEÑOS`
- `DIRECTOR GENERAL`
- `ASISTENTES`
- `Operaciones`
- `LOGÍSTICA`
- `ADMINISTRACION Y FINANZAS`
- `RECURSOS HUMANOS`
- `IT/SISTEMAS`

Y sus subramas operativas:

- `VENTAS`
- `BODEGA`
- `PICKEO & SOPORTE`
- `CHÓFERES`
- `DELIVERY`
- `BOOKKEEPING`
- `ACCOUNT RECIEVABLE`
- `ACCOUNT PAYABLE`
- `PAYROLL`

### Manuales como contexto IA

Cada área sembrada recibe un manual o descripción que luego es reutilizada por:

- organigrama
- perfiles
- directorio
- sugerencias KPI
- asistente IA por rol

Esto hace que la demo no dependa de contenido hardcodeado en frontend y permite simular un flujo RAG localizado por puesto.

## API REST

### Endpoints implementados actualmente

- `GET /api/salud`
- `GET /api/panel-general`
- `GET /api/organigrama`
- `GET /api/directorio-empleados`
- `GET /api/perfil-talento`
- `GET /api/centro-kpis`
- `PATCH /api/centro-kpis/seguimientos/{seguimiento}`
- `GET /api/asistente-ia-rol`
- `POST /api/asistente-ia-rol/consultar`

### Equivalencias funcionales respecto al planteamiento de negocio

Si el cliente o un equipo posterior desea renombrar endpoints hacia una nomenclatura más comercial, estas equivalencias ya existen funcionalmente:

- `/api/empleados` -> equivalente actual: `/api/directorio-empleados`
- `/api/registrar-actividad` -> equivalente actual: `PATCH /api/centro-kpis/seguimientos/{seguimiento}`
- `/api/chat-ia` -> equivalente actual: `POST /api/asistente-ia-rol/consultar`

## Controladores principales

### `ControladorPanelGeneral`

Devuelve la visión ejecutiva del sistema:

- resumen general
- áreas piloto
- KPIs destacados
- alertas operativas
- estado del asistente IA

### `ControladorOrganigrama`

Construye el árbol recursivo del organigrama real usando `puesto_supervisor_id`.

### `ControladorDirectorioEmpleados`

Concentra datos 360 por empleado:

- cargo principal
- supervisor
- roles adicionales
- contexto de manual
- KPIs recientes
- promedio de cumplimiento

### `ControladorPerfilTalento`

Sirve la capa funcional profunda por empleado y por puesto.

### `ControladorCentroKpis`

Expone:

- catálogo KPI
- seguimiento reciente
- rendimiento por empleado
- brechas operativas
- tracker por rol
- KPIs sugeridos para puestos sin definición

### `ControladorAsistenteIaRol`

Implementa el flujo del asistente contextual por rol.

## Motor IA: simulacion RAG localizada

Aunque el MVP no usa todavía un motor de embeddings externo, la lógica ya está construida como una simulación controlada de RAG.

### Flujo

1. El frontend selecciona un puesto
2. El backend busca el manual vinculado al puesto o a su departamento
3. El controlador divide el contenido en fragmentos útiles
4. Se tokeniza la pregunta del usuario
5. Se calcula relevancia por coincidencia léxica
6. Se seleccionan los fragmentos mejor puntuados
7. Se construye una respuesta usando solo ese contexto
8. Se devuelven también las fuentes consultadas

### Ventaja técnica

Este enfoque mantiene la respuesta dentro de los límites del rol. La IA no se comporta como un chat abierto corporativo, sino como un asistente acotado a contexto operativo.

## Instalacion

```bash
cd api
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

## Consideraciones de calidad

- relaciones con eager loading para evitar N+1
- controladores separados por módulo
- nomenclatura de dominio en español
- estructura preparada para crecer a autenticación, permisos y RAG real con embeddings
