<?php

namespace Database\Seeders;

use App\Models\DefinicionKpi;
use App\Models\Departamento;
use App\Models\Empleado;
use App\Models\ManualPuesto;
use App\Models\Puesto;
use App\Models\RegistroKpi;
use App\Models\RolEmpleado;
use App\Models\SeguimientoKpi;
use Illuminate\Database\Seeder;

class DatosDemoSeeder extends Seeder
{
    public function run(): void
    {
        RegistroKpi::query()->delete();
        SeguimientoKpi::query()->delete();
        DefinicionKpi::query()->delete();
        RolEmpleado::query()->delete();
        Empleado::query()->delete();
        ManualPuesto::query()->delete();
        Puesto::query()->delete();
        Departamento::query()->delete();

        $departamentoDuenos = $this->crearDepartamento(
            'DUEÑOS',
            'Nodo raiz del organigrama con supervision superior de la empresa.',
            'Eduardo Dos Santos, Zenaida Gutiérrez'
        );

        $departamentoDireccionGeneral = $this->crearDepartamento(
            'DIRECTOR GENERAL',
            'Direccion general que coordina las principales areas operativas y administrativas.',
            'Juan Díaz',
            $departamentoDuenos->id
        );

        $departamentoAsistentes = $this->crearDepartamento(
            'ASISTENTES',
            'Soporte directo a la direccion general.',
            'Diego, Basthian',
            $departamentoDireccionGeneral->id
        );

        $departamentoOperaciones = $this->crearDepartamento(
            'Operaciones',
            'Pilar principal para coordinar la ejecucion operativa del negocio.',
            null,
            $departamentoDireccionGeneral->id
        );

        $departamentoVentas = $this->crearDepartamento(
            'VENTAS',
            'Area comercial. Los vendedores tambien reportan a AR y escalan directamente a Eduardo o Zenaida.',
            null,
            $departamentoOperaciones->id
        );

        $departamentoLogistica = $this->crearDepartamento(
            'LOGÍSTICA',
            'Pilar principal para almacenamiento, pickeo, transporte y cierres de entrega.',
            null,
            $departamentoDireccionGeneral->id
        );

        $departamentoBodega = $this->crearDepartamento(
            'BODEGA',
            'Personal de bodega, control de inventario fisico, despacho matutino y consulta por faltantes.',
            null,
            $departamentoLogistica->id
        );

        $departamentoPickeo = $this->crearDepartamento(
            'PICKEO & SOPORTE',
            'Reciben ordenes de vendedores, hacen pickeo, coordinan armado, cierres diarios y entrega de dinero y reportes.',
            null,
            $departamentoLogistica->id
        );

        $departamentoAdministracion = $this->crearDepartamento(
            'ADMINISTRACION Y FINANZAS',
            'Pilar administrativo y financiero asociado a los dueños.',
            'Eduardo Dos Santos, Zenaida Gutiérrez',
            $departamentoDuenos->id
        );

        $departamentoRecursosHumanos = $this->crearDepartamento(
            'RECURSOS HUMANOS',
            'Reporta a Zenaida. Gestiona contratación, expediente de empleados, politicas internas, advertencias, permisos y capacitación.',
            'Zenaida Gutiérrez',
            $departamentoDuenos->id
        );

        $departamentoIt = $this->crearDepartamento(
            'IT/SISTEMAS',
            'Soporte de computadoras, impresoras, internet, redes, dispositivos, tickets internos y automatizaciones.',
            null,
            $departamentoDireccionGeneral->id
        );

        $departamentoChoferes = $this->crearDepartamento(
            'CHÓFERES',
            'Equipo de transporte asignado al flujo logistico.',
            null,
            $departamentoPickeo->id
        );

        $departamentoDelivery = $this->crearDepartamento(
            'DELIVERY',
            'Equipo asociado a entregas y devoluciones operativas.',
            null,
            $departamentoPickeo->id
        );

        $departamentoBookkeeping = $this->crearDepartamento(
            'BOOKKEEPING',
            'Registro contable, recepcion de cierres diarios de logistica, preparacion de reportes y control financiero general.',
            null,
            $departamentoAdministracion->id
        );

        $departamentoAccountRecievable = $this->crearDepartamento(
            'ACCOUNT RECIEVABLE',
            'Cuentas por cobrar, ajuste de factures e interaccion con vendedores cuando hay errores.',
            null,
            $departamentoAdministracion->id
        );

        $departamentoAccountPayable = $this->crearDepartamento(
            'ACCOUNT PAYABLE',
            'Pagos a proveedores y control de obligaciones por pagar.',
            null,
            $departamentoAdministracion->id
        );

        $departamentoPayroll = $this->crearDepartamento(
            'PAYROLL',
            'Nomina y soporte al pago administrativo.',
            null,
            $departamentoAdministracion->id
        );

        $puestoDuenos = $this->crearPuesto(
            $departamentoDuenos->id,
            'DUEÑOS',
            'Nivel 1',
            'Nivel raiz del organigrama y maxima supervision de la empresa.'
        );

        $puestoDirectorGeneral = $this->crearPuesto(
            $departamentoDireccionGeneral->id,
            'DIRECTOR GENERAL',
            'Nivel 2',
            'Reporta a Dueños y coordina las principales areas del negocio.',
            $puestoDuenos->id
        );

        $puestoAsistentes = $this->crearPuesto(
            $departamentoAsistentes->id,
            'ASISTENTES',
            'Nivel 2',
            'Soporte directo para Juan Díaz.',
            $puestoDirectorGeneral->id
        );

        $puestoOperaciones = $this->crearPuesto(
            $departamentoOperaciones->id,
            'Operaciones',
            'Nivel 3',
            'Pilar principal del frente operativo.',
            $puestoDirectorGeneral->id
        );

        $puestoLogistica = $this->crearPuesto(
            $departamentoLogistica->id,
            'LOGÍSTICA',
            'Nivel 3',
            'Pilar principal de logistica, almacenamiento y soporte de entregas.',
            $puestoDirectorGeneral->id
        );

        $puestoAdministracion = $this->crearPuesto(
            $departamentoAdministracion->id,
            'ADMINISTRACION Y FINANZAS',
            'Nivel 3',
            'Pilar administrativo y financiero asociado a los dueños.',
            $puestoDuenos->id
        );

        $puestoRecursosHumanos = $this->crearPuesto(
            $departamentoRecursosHumanos->id,
            'RECURSOS HUMANOS',
            'Nivel 3',
            'Area de personas y cumplimiento interno que reporta a Zenaida.',
            $puestoDuenos->id
        );

        $puestoIt = $this->crearPuesto(
            $departamentoIt->id,
            'IT/SISTEMAS',
            'Nivel 3',
            'Soporte tecnologico, redes, dispositivos y automatizaciones.',
            $puestoDirectorGeneral->id
        );

        $puestoVentas = $this->crearPuesto(
            $departamentoVentas->id,
            'VENTAS',
            'Nivel 4',
            'Area comercial bajo Operaciones.',
            $puestoOperaciones->id
        );

        $puestoVendedores = $this->crearPuesto(
            $departamentoVentas->id,
            'Vendedores',
            'Nivel 4',
            'Reportan tambien a AR y escalan directamente a Eduardo o Zenaida.',
            $puestoVentas->id
        );

        $puestoSupervisora = $this->crearPuesto(
            $departamentoVentas->id,
            'Supervisora',
            'Nivel 4',
            'Supervision operativa del frente comercial.',
            $puestoVentas->id
        );

        $puestoMerchandisers = $this->crearPuesto(
            $departamentoVentas->id,
            'Merchandisers',
            'Nivel 4',
            'Apoyo comercial y ejecucion en punto operativo.',
            $puestoVentas->id
        );

        $puestoBodega = $this->crearPuesto(
            $departamentoBodega->id,
            'BODEGA',
            'Nivel 4',
            'Control inventario fisico, despacho por las mañanas y consulta por faltantes.',
            $puestoLogistica->id
        );

        $puestoPickeo = $this->crearPuesto(
            $departamentoPickeo->id,
            'PICKEO & SOPORTE',
            'Nivel 4',
            'Pickeo, cierres diarios y coordinacion de entregas y reportes.',
            $puestoLogistica->id
        );

        $puestoChoferes = $this->crearPuesto(
            $departamentoChoferes->id,
            'CHÓFERES',
            'Nivel 4',
            'Equipo de transporte vinculado al flujo de pickeo y soporte.',
            $puestoPickeo->id
        );

        $puestoDelivery = $this->crearPuesto(
            $departamentoDelivery->id,
            'DELIVERY',
            'Nivel 4',
            'Equipo de entrega final asociado a logística.',
            $puestoPickeo->id
        );

        $puestoBookkeeping = $this->crearPuesto(
            $departamentoBookkeeping->id,
            'BOOKKEEPING',
            'Nivel 4',
            'Registro contable y control financiero general.',
            $puestoAdministracion->id
        );

        $puestoAccountRecievable = $this->crearPuesto(
            $departamentoAccountRecievable->id,
            'ACCOUNT RECIEVABLE',
            'Nivel 4',
            'Cuentas por cobrar e interaccion con vendedores cuando hay errores.',
            $puestoAdministracion->id
        );

        $puestoAccountPayable = $this->crearPuesto(
            $departamentoAccountPayable->id,
            'ACCOUNT PAYABLE',
            'Nivel 4',
            'Pagos a proveedores y control de compromisos por pagar.',
            $puestoAdministracion->id
        );

        $puestoPayroll = $this->crearPuesto(
            $departamentoPayroll->id,
            'PAYROLL',
            'Nivel 4',
            'Nomina y procesamiento administrativo de pagos.',
            $puestoAdministracion->id
        );

        $this->crearManualDepartamento($departamentoDuenos->id, 'Manual DUEÑOS', $departamentoDuenos->descripcion);
        $this->crearManualDepartamento($departamentoDireccionGeneral->id, 'Manual DIRECTOR GENERAL', $departamentoDireccionGeneral->descripcion);
        $this->crearManualDepartamento($departamentoAsistentes->id, 'Manual ASISTENTES', $departamentoAsistentes->descripcion);
        $this->crearManualDepartamento($departamentoOperaciones->id, 'Manual Operaciones', $departamentoOperaciones->descripcion);
        $this->crearManualDepartamento($departamentoVentas->id, 'Manual VENTAS', $departamentoVentas->descripcion);
        $this->crearManualDepartamento($departamentoLogistica->id, 'Manual LOGÍSTICA', $departamentoLogistica->descripcion);
        $this->crearManualDepartamento($departamentoBodega->id, 'Manual BODEGA', $departamentoBodega->descripcion);
        $this->crearManualDepartamento($departamentoPickeo->id, 'Manual PICKEO & SOPORTE', $departamentoPickeo->descripcion);
        $this->crearManualDepartamento($departamentoChoferes->id, 'Manual CHÓFERES', $departamentoChoferes->descripcion);
        $this->crearManualDepartamento($departamentoDelivery->id, 'Manual DELIVERY', $departamentoDelivery->descripcion);
        $this->crearManualDepartamento($departamentoAdministracion->id, 'Manual ADMINISTRACION Y FINANZAS', $departamentoAdministracion->descripcion);
        $this->crearManualDepartamento($departamentoRecursosHumanos->id, 'Manual RECURSOS HUMANOS', $departamentoRecursosHumanos->descripcion);
        $this->crearManualDepartamento($departamentoIt->id, 'Manual IT/SISTEMAS', $departamentoIt->descripcion);
        $this->crearManualDepartamento($departamentoBookkeeping->id, 'Manual BOOKKEEPING', $departamentoBookkeeping->descripcion);
        $this->crearManualDepartamento($departamentoAccountRecievable->id, 'Manual ACCOUNT RECIEVABLE', $departamentoAccountRecievable->descripcion);
        $this->crearManualDepartamento($departamentoAccountPayable->id, 'Manual ACCOUNT PAYABLE', $departamentoAccountPayable->descripcion);
        $this->crearManualDepartamento($departamentoPayroll->id, 'Manual PAYROLL', $departamentoPayroll->descripcion);

        $empleadoEduardo = $this->crearEmpleado(
            $puestoDuenos->id,
            'Eduardo Dos Santos',
            'eduardo@lasdelicias.demo',
            null,
            '12 años',
            '2014-02-10'
        );
        $empleadoZenaida = $this->crearEmpleado(
            $puestoDuenos->id,
            'Zenaida Gutiérrez',
            'zenaida@lasdelicias.demo',
            null,
            '11 años',
            '2015-01-15'
        );
        $empleadoJuan = $this->crearEmpleado(
            $puestoDirectorGeneral->id,
            'Juan Díaz',
            'juan@lasdelicias.demo',
            $empleadoEduardo->id,
            '6 años',
            '2020-03-02'
        );
        $empleadoDiego = $this->crearEmpleado(
            $puestoAsistentes->id,
            'Diego Sanabria',
            'diego@lasdelicias.demo',
            $empleadoJuan->id,
            '3 años',
            '2023-02-06'
        );
        $empleadoBasthian = $this->crearEmpleado(
            $puestoAsistentes->id,
            'Basthian Duarte',
            'basthian@lasdelicias.demo',
            $empleadoJuan->id,
            '2 años',
            '2024-01-08'
        );

        $empleadoMariana = $this->crearEmpleado(
            $puestoSupervisora->id,
            'Mariana Torres',
            'mariana@lasdelicias.demo',
            $empleadoJuan->id,
            '4 años',
            '2022-04-11'
        );
        $empleadoCarla = $this->crearEmpleado(
            $puestoVendedores->id,
            'Carla Méndez',
            'carla@lasdelicias.demo',
            $empleadoMariana->id,
            '2 años',
            '2024-02-19'
        );
        $empleadoRomel = $this->crearEmpleado(
            $puestoVendedores->id,
            'Romel Paredes',
            'romel@lasdelicias.demo',
            $empleadoMariana->id,
            '1 año',
            '2025-01-13'
        );
        $empleadoLuis = $this->crearEmpleado(
            $puestoMerchandisers->id,
            'Luis Ferrer',
            'luis@lasdelicias.demo',
            $empleadoMariana->id,
            '3 años',
            '2023-05-08'
        );

        $empleadoPaco = $this->crearEmpleado(
            $puestoBodega->id,
            'Paco Herrera',
            'paco@lasdelicias.demo',
            $empleadoJuan->id,
            '5 años',
            '2021-06-14'
        );
        $empleadoHeydi = $this->crearEmpleado(
            $puestoPickeo->id,
            'Heydi Ruiz',
            'heydi@lasdelicias.demo',
            $empleadoJuan->id,
            '4 años',
            '2022-01-17'
        );
        $empleadoManuel = $this->crearEmpleado(
            $puestoChoferes->id,
            'Manuel Rivas',
            'manuel@lasdelicias.demo',
            $empleadoHeydi->id,
            '3 años',
            '2023-03-20'
        );
        $empleadoFabiana = $this->crearEmpleado(
            $puestoDelivery->id,
            'Fabiana Soto',
            'fabiana@lasdelicias.demo',
            $empleadoHeydi->id,
            '2 años',
            '2024-05-27'
        );

        $empleadoMiguel = $this->crearEmpleado(
            $puestoBookkeeping->id,
            'Miguel Collado',
            'miguel@lasdelicias.demo',
            $empleadoEduardo->id,
            '6 años',
            '2020-02-03'
        );
        $empleadoMaria = $this->crearEmpleado(
            $puestoAccountRecievable->id,
            'María Salcedo',
            'maria@lasdelicias.demo',
            $empleadoMiguel->id,
            '4 años',
            '2022-07-04'
        );
        $empleadoYariela = $this->crearEmpleado(
            $puestoAccountPayable->id,
            'Yariela Gómez',
            'yariela@lasdelicias.demo',
            $empleadoMiguel->id,
            '4 años',
            '2022-08-15'
        );
        $empleadoFany = $this->crearEmpleado(
            $puestoPayroll->id,
            'Fany Ramírez',
            'fany@lasdelicias.demo',
            $empleadoZenaida->id,
            '5 años',
            '2021-04-05'
        );
        $empleadoEdgar = $this->crearEmpleado(
            $puestoRecursosHumanos->id,
            'Edgar Giles',
            'edgar@lasdelicias.demo',
            $empleadoZenaida->id,
            '5 años',
            '2021-01-18'
        );
        $empleadoOmar = $this->crearEmpleado(
            $puestoIt->id,
            'Omar Linares',
            'omar@lasdelicias.demo',
            $empleadoJuan->id,
            '3 años',
            '2023-09-11'
        );

        $this->asignarRolPrincipal($empleadoEduardo->id, $puestoDuenos->id);
        $this->asignarRolPrincipal($empleadoZenaida->id, $puestoDuenos->id);
        $this->asignarRolPrincipal($empleadoJuan->id, $puestoDirectorGeneral->id);
        $this->asignarRolPrincipal($empleadoDiego->id, $puestoAsistentes->id);
        $this->asignarRolPrincipal($empleadoBasthian->id, $puestoAsistentes->id);
        $this->asignarRolPrincipal($empleadoMariana->id, $puestoSupervisora->id);
        $this->asignarRolPrincipal($empleadoCarla->id, $puestoVendedores->id);
        $this->asignarRolPrincipal($empleadoRomel->id, $puestoVendedores->id);
        $this->asignarRolPrincipal($empleadoLuis->id, $puestoMerchandisers->id);
        $this->asignarRolPrincipal($empleadoPaco->id, $puestoBodega->id);
        $this->asignarRolPrincipal($empleadoHeydi->id, $puestoPickeo->id);
        $this->asignarRolPrincipal($empleadoManuel->id, $puestoChoferes->id);
        $this->asignarRolPrincipal($empleadoFabiana->id, $puestoDelivery->id);
        $this->asignarRolPrincipal($empleadoMiguel->id, $puestoBookkeeping->id);
        $this->asignarRolPrincipal($empleadoMaria->id, $puestoAccountRecievable->id);
        $this->asignarRolPrincipal($empleadoYariela->id, $puestoAccountPayable->id);
        $this->asignarRolPrincipal($empleadoFany->id, $puestoPayroll->id);
        $this->asignarRolPrincipal($empleadoEdgar->id, $puestoRecursosHumanos->id);
        $this->asignarRolPrincipal($empleadoOmar->id, $puestoIt->id);

        $this->asignarRolAdicional(
            $empleadoDiego->id,
            $puestoIt->id,
            20,
            'Apoya configuracion de dispositivos y seguimiento de tickets internos.'
        );
        $this->asignarRolAdicional(
            $empleadoBasthian->id,
            $puestoBodega->id,
            25,
            'Brinda soporte en cierres operativos y coordinacion de inventario.'
        );
        $this->asignarRolAdicional(
            $empleadoFany->id,
            $puestoRecursosHumanos->id,
            30,
            'Cubre incidencias de documentacion y permisos junto a RRHH.'
        );
        $this->asignarRolAdicional(
            $empleadoMiguel->id,
            $puestoAccountPayable->id,
            20,
            'Apoya la validacion semanal de pagos a proveedores criticos.'
        );

        $kpiVentas = $this->crearDefinicionKpi(
            $puestoVendedores->id,
            'Pedidos confirmados',
            'Cantidad de pedidos confirmados y listos para despacho.',
            'Total pedidos confirmados por semana',
            'Semanal',
            120,
            'pedidos'
        );
        $kpiBodega = $this->crearDefinicionKpi(
            $puestoBodega->id,
            'Exactitud de despacho',
            'Porcentaje de despachos preparados sin faltantes ni errores.',
            'Despachos correctos / despachos totales * 100',
            'Semanal',
            98,
            '%'
        );
        $kpiPickeo = $this->crearDefinicionKpi(
            $puestoPickeo->id,
            'Cierres diarios entregados',
            'Cumplimiento del cierre diario de dinero, reportes y entregas.',
            'Cierres completos / cierres programados * 100',
            'Diario',
            100,
            '%'
        );
        $kpiDelivery = $this->crearDefinicionKpi(
            $puestoDelivery->id,
            'Entregas cerradas a tiempo',
            'Porcentaje de entregas completadas dentro de la ventana comprometida.',
            'Entregas a tiempo / entregas totales * 100',
            'Diario',
            95,
            '%'
        );
        $kpiBookkeeping = $this->crearDefinicionKpi(
            $puestoBookkeeping->id,
            'Cierres contables al dia',
            'Porcentaje de cierres conciliados en la fecha definida.',
            'Cierres al dia / cierres planificados * 100',
            'Semanal',
            100,
            '%'
        );
        $kpiCobranza = $this->crearDefinicionKpi(
            $puestoAccountRecievable->id,
            'Cobranza recuperada',
            'Monto recuperado en cuentas por cobrar durante el periodo.',
            'Total recuperado en el periodo',
            'Semanal',
            25000,
            'USD'
        );
        $kpiPagos = $this->crearDefinicionKpi(
            $puestoAccountPayable->id,
            'Pagos programados cumplidos',
            'Porcentaje de pagos ejecutados dentro de la fecha prevista.',
            'Pagos a tiempo / pagos programados * 100',
            'Semanal',
            95,
            '%'
        );
        $kpiPayroll = $this->crearDefinicionKpi(
            $puestoPayroll->id,
            'Exactitud de nomina',
            'Porcentaje de nominas procesadas sin incidencias ni reclamos.',
            'Nominas correctas / nominas procesadas * 100',
            'Semanal',
            100,
            '%'
        );
        $kpiRh = $this->crearDefinicionKpi(
            $puestoRecursosHumanos->id,
            'Expedientes actualizados',
            'Porcentaje de expedientes con documentacion y alertas al dia.',
            'Expedientes actualizados / expedientes activos * 100',
            'Semanal',
            95,
            '%'
        );
        $kpiIt = $this->crearDefinicionKpi(
            $puestoIt->id,
            'Tickets resueltos',
            'Porcentaje de tickets internos resueltos dentro del SLA acordado.',
            'Tickets dentro de SLA / tickets totales * 100',
            'Semanal',
            90,
            '%'
        );

        $this->crearRegistroKpi($empleadoCarla->id, $kpiVentas->id, '2026-05-04', '2026-05-10', 88, 'Semana con demanda alta en ventas.');
        $this->crearRegistroKpi($empleadoPaco->id, $kpiBodega->id, '2026-05-04', '2026-05-10', 94, 'Un faltante parcial corregido el mismo dia.');
        $this->crearRegistroKpi($empleadoHeydi->id, $kpiPickeo->id, '2026-05-10', '2026-05-10', 92, 'Cierre entregado con una diferencia menor en reporte.');
        $this->crearRegistroKpi($empleadoFabiana->id, $kpiDelivery->id, '2026-05-10', '2026-05-10', 97, 'Entregas completas dentro del horario previsto.');
        $this->crearRegistroKpi($empleadoMiguel->id, $kpiBookkeeping->id, '2026-05-04', '2026-05-10', 96, 'Conciliaciones diarias cerradas a tiempo.');
        $this->crearRegistroKpi($empleadoMaria->id, $kpiCobranza->id, '2026-05-04', '2026-05-10', 89, 'Semana con recuperacion parcial de cartera critica.');
        $this->crearRegistroKpi($empleadoYariela->id, $kpiPagos->id, '2026-05-04', '2026-05-10', 93, 'Pagos priorizados ejecutados con una reprogramacion menor.');
        $this->crearRegistroKpi($empleadoFany->id, $kpiPayroll->id, '2026-05-04', '2026-05-10', 100, 'Nomina procesada sin incidencias.');
        $this->crearRegistroKpi($empleadoEdgar->id, $kpiRh->id, '2026-05-04', '2026-05-10', 91, 'Pendiente una actualizacion documental de ingreso.');
        $this->crearRegistroKpi($empleadoOmar->id, $kpiIt->id, '2026-05-04', '2026-05-10', 90, 'SLA cumplido en la mayoria de tickets internos.');

        $this->crearSeguimientoKpi($empleadoCarla->id, $puestoVendedores->id, $kpiVentas->id, 'Confirmar pedidos del dia', 'Registrar y cerrar pedidos confirmados del turno comercial.', 'Diario', '2026-05-12', true, 32, 35, 'pedidos');
        $this->crearSeguimientoKpi($empleadoCarla->id, $puestoVendedores->id, $kpiVentas->id, 'Actualizar incidencias de ventas', 'Dejar observaciones de pedidos con faltantes o ajustes.', 'Diario', '2026-05-12', false, 2, 0, 'casos');
        $this->crearSeguimientoKpi($empleadoPaco->id, $puestoBodega->id, $kpiBodega->id, 'Checklist de despacho sin errores', 'Validar despacho, faltantes y control de inventario fisico.', 'Diario', '2026-05-12', true, 97, 98, '%');
        $this->crearSeguimientoKpi($empleadoHeydi->id, $puestoPickeo->id, $kpiPickeo->id, 'Cierre diario de reportes y dinero', 'Confirmar cierres completos y entrega de soporte al final del turno.', 'Diario', '2026-05-12', false, 88, 100, '%');
        $this->crearSeguimientoKpi($empleadoFany->id, $puestoPayroll->id, $kpiPayroll->id, 'Revision final de nomina', 'Validar calculo y salida de pagos administrativos.', 'Semanal', '2026-05-12', true, 100, 100, '%');
        $this->crearSeguimientoKpi($empleadoOmar->id, $puestoIt->id, $kpiIt->id, 'Cierre de tickets del SLA', 'Marcar tickets internos resueltos y pendientes del dia.', 'Diario', '2026-05-12', false, 9, 10, 'tickets');
        $this->crearSeguimientoKpi($empleadoEdgar->id, $puestoRecursosHumanos->id, $kpiRh->id, 'Actualizar expedientes activos', 'Revisar expedientes y alertas documentales del personal.', 'Semanal', '2026-05-12', false, 91, 95, '%');
    }

    private function crearDepartamento(
        string $nombre,
        ?string $descripcion,
        ?string $liderNombre = null,
        ?int $departamentoPadreId = null
    ): Departamento {
        return Departamento::create([
            'nombre' => $nombre,
            'descripcion' => $descripcion,
            'lider_nombre' => $liderNombre,
            'departamento_padre_id' => $departamentoPadreId,
        ]);
    }

    private function crearPuesto(
        int $departamentoId,
        string $nombre,
        string $nivel,
        ?string $proposito,
        ?int $puestoSupervisorId = null
    ): Puesto {
        return Puesto::create([
            'departamento_id' => $departamentoId,
            'puesto_supervisor_id' => $puestoSupervisorId,
            'nombre' => $nombre,
            'nivel' => $nivel,
            'proposito' => $proposito,
            'es_activo' => true,
        ]);
    }

    private function crearManualDepartamento(int $departamentoId, string $titulo, ?string $contenido): void
    {
        ManualPuesto::create([
            'departamento_id' => $departamentoId,
            'titulo' => $titulo,
            'contenido' => $contenido ?? 'Sin descripcion disponible.',
            'archivo_origen' => 'LDIORGANIGRAMA.pdf',
        ]);
    }

    private function crearEmpleado(
        int $puestoPrincipalId,
        string $nombreCompleto,
        string $correo,
        ?int $supervisorInmediatoId = null,
        ?string $antiguedadTexto = null,
        ?string $fechaIngreso = null,
        string $estado = 'activo'
    ): Empleado {
        return Empleado::create([
            'puesto_principal_id' => $puestoPrincipalId,
            'supervisor_inmediato_id' => $supervisorInmediatoId,
            'nombre_completo' => $nombreCompleto,
            'correo' => $correo,
            'antiguedad_texto' => $antiguedadTexto,
            'fecha_ingreso' => $fechaIngreso,
            'estado' => $estado,
        ]);
    }

    private function asignarRolPrincipal(int $empleadoId, int $puestoId): void
    {
        RolEmpleado::create([
            'empleado_id' => $empleadoId,
            'puesto_id' => $puestoId,
            'tipo_rol' => 'principal',
            'condicion' => 'permanente',
            'porcentaje_tiempo' => 100,
            'observaciones' => null,
        ]);
    }

    private function asignarRolAdicional(
        int $empleadoId,
        int $puestoId,
        ?int $porcentajeTiempo = null,
        ?string $observaciones = null
    ): void {
        RolEmpleado::create([
            'empleado_id' => $empleadoId,
            'puesto_id' => $puestoId,
            'tipo_rol' => 'adicional',
            'condicion' => 'temporal',
            'porcentaje_tiempo' => $porcentajeTiempo,
            'observaciones' => $observaciones,
        ]);
    }

    private function crearDefinicionKpi(
        int $puestoId,
        string $nombre,
        ?string $descripcion,
        ?string $formula,
        ?string $frecuencia,
        ?float $metaValor,
        ?string $unidad
    ): DefinicionKpi {
        return DefinicionKpi::create([
            'puesto_id' => $puestoId,
            'nombre' => $nombre,
            'descripcion' => $descripcion,
            'formula' => $formula,
            'frecuencia' => $frecuencia,
            'meta_valor' => $metaValor,
            'unidad' => $unidad,
            'origen' => 'demo_operativa',
        ]);
    }

    private function crearRegistroKpi(
        int $empleadoId,
        int $definicionKpiId,
        string $periodoInicio,
        string $periodoFin,
        float $valorReal,
        ?string $comentarios = null
    ): void {
        RegistroKpi::create([
            'empleado_id' => $empleadoId,
            'definicion_kpi_id' => $definicionKpiId,
            'periodo_inicio' => $periodoInicio,
            'periodo_fin' => $periodoFin,
            'valor_real' => $valorReal,
            'comentarios' => $comentarios,
        ]);
    }

    private function crearSeguimientoKpi(
        ?int $empleadoId,
        int $puestoId,
        ?int $definicionKpiId,
        string $titulo,
        ?string $descripcion,
        ?string $frecuencia,
        string $fechaSeguimiento,
        bool $completado,
        ?float $valorActual,
        ?float $metaValor,
        ?string $unidad
    ): void {
        SeguimientoKpi::create([
            'empleado_id' => $empleadoId,
            'puesto_id' => $puestoId,
            'definicion_kpi_id' => $definicionKpiId,
            'titulo' => $titulo,
            'descripcion' => $descripcion,
            'frecuencia' => $frecuencia,
            'fecha_seguimiento' => $fechaSeguimiento,
            'completado' => $completado,
            'valor_actual' => $valorActual,
            'meta_valor' => $metaValor,
            'unidad' => $unidad,
        ]);
    }
}
