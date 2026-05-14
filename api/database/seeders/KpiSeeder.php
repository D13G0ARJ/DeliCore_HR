<?php

namespace Database\Seeders;

use App\Models\DefinicionKpi;
use App\Models\Empleado;
use App\Models\Puesto;
use App\Models\RegistroKpi;
use App\Models\SeguimientoKpi;
use Illuminate\Database\Seeder;

class KpiSeeder extends Seeder
{
    public function run(): void
    {
        RegistroKpi::query()->delete();
        SeguimientoKpi::query()->delete();
        DefinicionKpi::query()->delete();

        $mapaPuestos = Puesto::query()->pluck('id', 'nombre');
        $mapaEmpleados = Empleado::query()->pluck('id', 'correo');

        $kpis = [
            ['puesto' => 'Vendedores', 'nombre' => 'Pedidos confirmados', 'descripcion' => 'Cantidad de pedidos confirmados y listos para despacho.', 'formula' => 'Total pedidos confirmados por semana', 'frecuencia' => 'Semanal', 'meta' => 120, 'unidad' => 'pedidos'],
            ['puesto' => 'Vendedores', 'nombre' => 'Cobertura de cartera activa', 'descripcion' => 'Porcentaje de clientes activos visitados durante la semana.', 'formula' => 'Clientes visitados / clientes activos * 100', 'frecuencia' => 'Semanal', 'meta' => 95, 'unidad' => '%'],
            ['puesto' => 'Supervisora', 'nombre' => 'Ejecucion de supervisiones', 'descripcion' => 'Cumplimiento del plan de visitas y acompanamiento comercial.', 'formula' => 'Supervisiones realizadas / supervisiones planificadas * 100', 'frecuencia' => 'Semanal', 'meta' => 100, 'unidad' => '%'],
            ['puesto' => 'BODEGA', 'nombre' => 'Exactitud de despacho', 'descripcion' => 'Porcentaje de despachos preparados sin faltantes ni errores.', 'formula' => 'Despachos correctos / despachos totales * 100', 'frecuencia' => 'Semanal', 'meta' => 98, 'unidad' => '%'],
            ['puesto' => 'PICKEO & SOPORTE', 'nombre' => 'Cierres diarios entregados', 'descripcion' => 'Cumplimiento del cierre diario de dinero, reportes y entregas.', 'formula' => 'Cierres completos / cierres programados * 100', 'frecuencia' => 'Diario', 'meta' => 100, 'unidad' => '%'],
            ['puesto' => 'DELIVERY', 'nombre' => 'Entregas cerradas a tiempo', 'descripcion' => 'Porcentaje de entregas completadas dentro de la ventana comprometida.', 'formula' => 'Entregas a tiempo / entregas totales * 100', 'frecuencia' => 'Diario', 'meta' => 95, 'unidad' => '%'],
            ['puesto' => 'BOOKKEEPING', 'nombre' => 'Cierres contables al dia', 'descripcion' => 'Porcentaje de cierres conciliados en la fecha definida.', 'formula' => 'Cierres al dia / cierres planificados * 100', 'frecuencia' => 'Semanal', 'meta' => 100, 'unidad' => '%'],
            ['puesto' => 'ACCOUNT RECIEVABLE', 'nombre' => 'Cobranza recuperada', 'descripcion' => 'Monto recuperado en cuentas por cobrar durante el periodo.', 'formula' => 'Total recuperado en el periodo', 'frecuencia' => 'Semanal', 'meta' => 25000, 'unidad' => 'USD'],
            ['puesto' => 'ACCOUNT PAYABLE', 'nombre' => 'Pagos programados cumplidos', 'descripcion' => 'Porcentaje de pagos ejecutados dentro de la fecha prevista.', 'formula' => 'Pagos a tiempo / pagos programados * 100', 'frecuencia' => 'Semanal', 'meta' => 95, 'unidad' => '%'],
            ['puesto' => 'PAYROLL', 'nombre' => 'Exactitud de nomina', 'descripcion' => 'Porcentaje de nominas procesadas sin incidencias ni reclamos.', 'formula' => 'Nominas correctas / nominas procesadas * 100', 'frecuencia' => 'Semanal', 'meta' => 100, 'unidad' => '%'],
            ['puesto' => 'RECURSOS HUMANOS', 'nombre' => 'Expedientes actualizados', 'descripcion' => 'Porcentaje de expedientes con documentacion y alertas al dia.', 'formula' => 'Expedientes actualizados / expedientes activos * 100', 'frecuencia' => 'Semanal', 'meta' => 95, 'unidad' => '%'],
            ['puesto' => 'IT/SISTEMAS', 'nombre' => 'Tickets resueltos', 'descripcion' => 'Porcentaje de tickets internos resueltos dentro del SLA acordado.', 'formula' => 'Tickets dentro de SLA / tickets totales * 100', 'frecuencia' => 'Semanal', 'meta' => 90, 'unidad' => '%'],
        ];

        $definiciones = collect($kpis)->mapWithKeys(function (array $item) use ($mapaPuestos) {
            $definicion = DefinicionKpi::create([
                'puesto_id' => $mapaPuestos[$item['puesto']],
                'nombre' => $item['nombre'],
                'descripcion' => $item['descripcion'],
                'formula' => $item['formula'],
                'frecuencia' => $item['frecuencia'],
                'meta_valor' => $item['meta'],
                'unidad' => $item['unidad'],
                'origen' => 'seeder_kpis',
            ]);

            return [$item['nombre'] => $definicion];
        });

        $registros = [
            ['correo' => 'carla@lasdelicias.demo', 'kpi' => 'Pedidos confirmados', 'inicio' => '2026-05-04', 'fin' => '2026-05-10', 'valor' => 88, 'comentarios' => 'Semana con demanda alta en ventas.'],
            ['correo' => 'carla@lasdelicias.demo', 'kpi' => 'Cobertura de cartera activa', 'inicio' => '2026-05-04', 'fin' => '2026-05-10', 'valor' => 91, 'comentarios' => 'Se recuperaron clientes de la zona norte.'],
            ['correo' => 'mariana@lasdelicias.demo', 'kpi' => 'Ejecucion de supervisiones', 'inicio' => '2026-05-04', 'fin' => '2026-05-10', 'valor' => 94, 'comentarios' => 'Quedo una visita reagendada.'],
            ['correo' => 'paco@lasdelicias.demo', 'kpi' => 'Exactitud de despacho', 'inicio' => '2026-05-04', 'fin' => '2026-05-10', 'valor' => 94, 'comentarios' => 'Un faltante parcial corregido el mismo dia.'],
            ['correo' => 'heydi@lasdelicias.demo', 'kpi' => 'Cierres diarios entregados', 'inicio' => '2026-05-10', 'fin' => '2026-05-10', 'valor' => 92, 'comentarios' => 'Cierre entregado con una diferencia menor en reporte.'],
            ['correo' => 'fabiana@lasdelicias.demo', 'kpi' => 'Entregas cerradas a tiempo', 'inicio' => '2026-05-10', 'fin' => '2026-05-10', 'valor' => 97, 'comentarios' => 'Entregas completas dentro del horario previsto.'],
            ['correo' => 'miguel@lasdelicias.demo', 'kpi' => 'Cierres contables al dia', 'inicio' => '2026-05-04', 'fin' => '2026-05-10', 'valor' => 96, 'comentarios' => 'Conciliaciones diarias cerradas a tiempo.'],
            ['correo' => 'maria@lasdelicias.demo', 'kpi' => 'Cobranza recuperada', 'inicio' => '2026-05-04', 'fin' => '2026-05-10', 'valor' => 89, 'comentarios' => 'Semana con recuperacion parcial de cartera critica.'],
            ['correo' => 'yariela@lasdelicias.demo', 'kpi' => 'Pagos programados cumplidos', 'inicio' => '2026-05-04', 'fin' => '2026-05-10', 'valor' => 93, 'comentarios' => 'Pagos priorizados ejecutados con una reprogramacion menor.'],
            ['correo' => 'fany@lasdelicias.demo', 'kpi' => 'Exactitud de nomina', 'inicio' => '2026-05-04', 'fin' => '2026-05-10', 'valor' => 100, 'comentarios' => 'Nomina procesada sin incidencias.'],
            ['correo' => 'edgar@lasdelicias.demo', 'kpi' => 'Expedientes actualizados', 'inicio' => '2026-05-04', 'fin' => '2026-05-10', 'valor' => 91, 'comentarios' => 'Pendiente una actualizacion documental de ingreso.'],
            ['correo' => 'omar@lasdelicias.demo', 'kpi' => 'Tickets resueltos', 'inicio' => '2026-05-04', 'fin' => '2026-05-10', 'valor' => 90, 'comentarios' => 'SLA cumplido en la mayoria de tickets internos.'],
        ];

        foreach ($registros as $item) {
            RegistroKpi::create([
                'empleado_id' => $mapaEmpleados[$item['correo']],
                'definicion_kpi_id' => $definiciones[$item['kpi']]->id,
                'periodo_inicio' => $item['inicio'],
                'periodo_fin' => $item['fin'],
                'valor_real' => $item['valor'],
                'comentarios' => $item['comentarios'],
            ]);
        }

        $seguimientos = [
            ['correo' => 'carla@lasdelicias.demo', 'puesto' => 'Vendedores', 'kpi' => 'Pedidos confirmados', 'titulo' => 'Confirmar pedidos del dia', 'descripcion' => 'Registrar y cerrar pedidos confirmados del turno comercial.', 'frecuencia' => 'Diario', 'fecha' => '2026-05-12', 'completado' => true, 'actual' => 32, 'meta' => 35, 'unidad' => 'pedidos', 'justificacion' => 'Se cerraron todos los pedidos programados del turno.'],
            ['correo' => 'carla@lasdelicias.demo', 'puesto' => 'Vendedores', 'kpi' => 'Cobertura de cartera activa', 'titulo' => 'Visitar cartera priorizada', 'descripcion' => 'Registrar clientes visitados y casos pendientes del dia.', 'frecuencia' => 'Diario', 'fecha' => '2026-05-12', 'completado' => false, 'actual' => 12, 'meta' => 15, 'unidad' => 'clientes', 'justificacion' => 'Dos clientes no estaban operativos y uno pidio reagendar la visita.'],
            ['correo' => 'mariana@lasdelicias.demo', 'puesto' => 'Supervisora', 'kpi' => 'Ejecucion de supervisiones', 'titulo' => 'Validar ruta de acompanamiento', 'descripcion' => 'Completar acompanamientos comerciales y registrar hallazgos.', 'frecuencia' => 'Semanal', 'fecha' => '2026-05-12', 'completado' => false, 'actual' => 4, 'meta' => 5, 'unidad' => 'visitas', 'justificacion' => 'Una supervision quedo reprogramada por retraso de cliente mayorista.'],
            ['correo' => 'paco@lasdelicias.demo', 'puesto' => 'BODEGA', 'kpi' => 'Exactitud de despacho', 'titulo' => 'Checklist de despacho sin errores', 'descripcion' => 'Validar despacho, faltantes y control de inventario fisico.', 'frecuencia' => 'Diario', 'fecha' => '2026-05-12', 'completado' => true, 'actual' => 97, 'meta' => 98, 'unidad' => '%', 'justificacion' => 'Se corrigio una diferencia menor antes de salida.'],
            ['correo' => 'heydi@lasdelicias.demo', 'puesto' => 'PICKEO & SOPORTE', 'kpi' => 'Cierres diarios entregados', 'titulo' => 'Cierre diario de reportes y dinero', 'descripcion' => 'Confirmar cierres completos y entrega de soporte al final del turno.', 'frecuencia' => 'Diario', 'fecha' => '2026-05-12', 'completado' => false, 'actual' => 88, 'meta' => 100, 'unidad' => '%', 'justificacion' => 'Falto anexar un soporte de devolucion al cierre del turno.'],
            ['correo' => 'fany@lasdelicias.demo', 'puesto' => 'PAYROLL', 'kpi' => 'Exactitud de nomina', 'titulo' => 'Revision final de nomina', 'descripcion' => 'Validar calculo y salida de pagos administrativos.', 'frecuencia' => 'Semanal', 'fecha' => '2026-05-12', 'completado' => true, 'actual' => 100, 'meta' => 100, 'unidad' => '%', 'justificacion' => 'Proceso ejecutado completo sin incidencias.'],
            ['correo' => 'omar@lasdelicias.demo', 'puesto' => 'IT/SISTEMAS', 'kpi' => 'Tickets resueltos', 'titulo' => 'Cierre de tickets del SLA', 'descripcion' => 'Marcar tickets internos resueltos y pendientes del dia.', 'frecuencia' => 'Diario', 'fecha' => '2026-05-12', 'completado' => false, 'actual' => 9, 'meta' => 10, 'unidad' => 'tickets', 'justificacion' => 'Quedo un ticket en espera por repuesto de impresora.'],
            ['correo' => 'edgar@lasdelicias.demo', 'puesto' => 'RECURSOS HUMANOS', 'kpi' => 'Expedientes actualizados', 'titulo' => 'Actualizar expedientes activos', 'descripcion' => 'Revisar expedientes y alertas documentales del personal.', 'frecuencia' => 'Semanal', 'fecha' => '2026-05-12', 'completado' => false, 'actual' => 91, 'meta' => 95, 'unidad' => '%', 'justificacion' => 'Falta recibir una constancia medica para cerrar el expediente pendiente.'],
        ];

        foreach ($seguimientos as $item) {
            SeguimientoKpi::create([
                'empleado_id' => $mapaEmpleados[$item['correo']],
                'puesto_id' => $mapaPuestos[$item['puesto']],
                'definicion_kpi_id' => $definiciones[$item['kpi']]->id,
                'titulo' => $item['titulo'],
                'descripcion' => $item['descripcion'],
                'frecuencia' => $item['frecuencia'],
                'fecha_seguimiento' => $item['fecha'],
                'completado' => $item['completado'],
                'valor_actual' => $item['actual'],
                'meta_valor' => $item['meta'],
                'unidad' => $item['unidad'],
                'justificacion_respuesta' => $item['justificacion'],
            ]);
        }
    }
}
