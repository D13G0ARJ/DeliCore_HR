<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DefinicionKpi;
use App\Models\Departamento;
use App\Models\Empleado;
use App\Models\Puesto;
use App\Models\RegistroKpi;
use App\Models\RolEmpleado;
use App\Models\SeguimientoKpi;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\Builder;

class ControladorPanelGeneral extends Controller
{
    public function mostrar(): JsonResponse
    {
        $departamentosPiloto = Departamento::query()
            ->withCount([
                'puestos',
                'puestos as puestos_con_kpi_count' => fn ($query) => $query->whereHas('definicionesKpi'),
                'puestos as empleados_asignados_count' => fn ($query) => $query->whereHas('empleadosPrincipales'),
            ])
            ->with('manual')
            ->whereIn('nombre', [
                'Operaciones',
                'ADMINISTRACION Y FINANZAS',
                'RECURSOS HUMANOS',
            ])
            ->orderBy('id')
            ->get();

        $registros = RegistroKpi::query()
            ->with([
                'empleado',
                'definicionKpi.puesto.departamento',
            ])
            ->orderByDesc('valor_real')
            ->get();

        $promedioCumplimiento = (int) round($registros->avg('valor_real') ?? 0);
        $empleadosActivos = Empleado::query()->where('estado', 'activo')->count();
        $rolesMultiples = RolEmpleado::query()
            ->where('tipo_rol', 'adicional')
            ->distinct('empleado_id')
            ->count('empleado_id');
        $seguimientosPendientes = SeguimientoKpi::query()
            ->where('completado', false)
            ->count();
        $puestosConKpi = DefinicionKpi::query()
            ->distinct('puesto_id')
            ->count('puesto_id');
        $puestosSinKpi = Puesto::query()
            ->doesntHave('definicionesKpi')
            ->count();

        $seguimientoOperativo = SeguimientoKpi::query()
            ->with([
                'empleado.puestoPrincipal.departamento',
                'puesto.departamento',
                'definicionKpi',
            ])
            ->where('completado', false)
            ->orderBy('fecha_seguimiento')
            ->limit(6)
            ->get();

        return response()->json([
            'empresa' => [
                'nombre' => 'Las Delicias Import LLC',
                'industria' => 'Distribucion de quesos, lacteos y productos refrigerados',
                'objetivo' => 'Centralizar roles, responsabilidades, metricas y soporte operativo por area',
            ],
            'metricas_contexto' => [
                'empleados_activos' => $empleadosActivos,
                'departamentos_activos' => Departamento::query()->count(),
                'puestos_activos' => Puesto::query()->count(),
                'roles_multiples' => $rolesMultiples,
                'seguimientos_pendientes' => $seguimientosPendientes,
                'puestos_con_kpi' => $puestosConKpi,
                'puestos_sin_kpi' => $puestosSinKpi,
            ],
            'resumen' => [
                [
                    'id' => 'empleados',
                    'titulo' => 'Empleados activos',
                    'valor' => (string) $empleadosActivos,
                    'detalle' => 'Colaboradores con puesto principal vigente y estructura trazable',
                    'tendencia' => Departamento::query()->count().' departamentos activos',
                ],
                [
                    'id' => 'roles',
                    'titulo' => 'Roles hibridos',
                    'valor' => (string) $rolesMultiples,
                    'detalle' => 'Colaboradores con multiples responsabilidades operativas activas',
                    'tendencia' => Puesto::query()->count().' puestos priorizados',
                ],
                [
                    'id' => 'kpis',
                    'titulo' => 'Cobertura KPI',
                    'valor' => $puestosConKpi.'/'.$this->formatearDivisor(Puesto::query()->count()),
                    'detalle' => 'Puestos con definicion KPI activa dentro de la estructura operativa',
                    'tendencia' => $registros->count().' registros KPI sembrados',
                ],
                [
                    'id' => 'seguimiento',
                    'titulo' => 'Seguimiento abierto',
                    'valor' => (string) $seguimientosPendientes,
                    'detalle' => 'Check-ins KPI pendientes de cierre y validacion',
                    'tendencia' => $promedioCumplimiento.'% de cumplimiento promedio',
                ],
                [
                    'id' => 'cumplimiento',
                    'titulo' => 'Cumplimiento semanal',
                    'valor' => $promedioCumplimiento.'%',
                    'detalle' => 'Promedio calculado desde los registros KPI sembrados',
                    'tendencia' => 'Trazabilidad real conectada a la base de datos',
                ],
            ],
            'departamentos' => $departamentosPiloto->map(function (Departamento $departamento) {
                return [
                    'nombre' => $departamento->nombre,
                    'lider' => $departamento->lider_nombre,
                    'puestos' => $departamento->puestos_count,
                    'empleados' => $departamento->empleados_asignados_count,
                    'cobertura_kpi' => $departamento->puestos_count > 0
                        ? (int) round(($departamento->puestos_con_kpi_count / $departamento->puestos_count) * 100)
                        : 0,
                    'estado' => $departamento->nombre === 'RECURSOS HUMANOS' ? 'Reporta a Zenaida' : 'Estructura confirmada',
                    'meta' => $this->resumirTexto($departamento->manual?->contenido ?? $departamento->descripcion),
                ];
            })->values(),
            'puestos_destacados' => $registros->take(6)->map(function (RegistroKpi $registro) {
                return [
                    'nombre' => $registro->definicionKpi?->puesto?->nombre,
                    'empleado' => $registro->empleado?->nombre_completo,
                    'departamento' => $registro->definicionKpi?->puesto?->departamento?->nombre,
                    'supervisor' => $registro->definicionKpi?->puesto?->supervisor?->nombre ?? 'Direccion General',
                    'frecuencia' => $registro->definicionKpi?->frecuencia,
                    'kpi_principal' => $registro->definicionKpi?->nombre,
                    'progreso' => (int) $registro->valor_real,
                ];
            })->values(),
            'seguimiento_operativo' => $seguimientoOperativo->map(function (SeguimientoKpi $seguimiento) {
                return [
                    'id' => $seguimiento->id,
                    'titulo' => $seguimiento->titulo,
                    'empleado' => $seguimiento->empleado?->nombre_completo,
                    'puesto' => $seguimiento->puesto?->nombre,
                    'departamento' => $seguimiento->puesto?->departamento?->nombre,
                    'frecuencia' => $seguimiento->frecuencia,
                    'fecha' => $seguimiento->fecha_seguimiento?->format('Y-m-d'),
                    'kpi' => $seguimiento->definicionKpi?->nombre,
                ];
            })->values(),
            'alertas' => [
                $rolesMultiples.' empleados reportan multiples roles sin distribucion formal de tiempo.',
                $seguimientosPendientes.' seguimientos KPI siguen pendientes de cierre operativo.',
                $puestosSinKpi.' puestos todavia no tienen una definicion KPI activa.',
                'La jerarquia ya fue alineada con el organigrama oficial del cliente.',
                'El siguiente paso es consolidar seguimiento operativo y consulta guiada por rol.',
            ],
            'asistente_ia' => [
                'estado' => 'Piloto',
                'rol_activo' => 'RECURSOS HUMANOS',
                'capacidad' => 'Responder preguntas usando solo el manual asociado al rol o area',
                'roles_disponibles' => Puesto::query()
                    ->where(function (Builder $query) {
                        $query
                            ->whereHas('manual')
                            ->orWhereHas('departamento.manual')
                            ->orWhereNotNull('proposito');
                    })
                    ->count(),
            ],
        ]);
    }

    private function resumirTexto(?string $texto): string
    {
        if (!$texto) {
            return 'Sin descripcion disponible.';
        }

        $textoLimpio = trim(preg_replace('/\s+/', ' ', $texto) ?? '');

        if (mb_strlen($textoLimpio) <= 150) {
            return $textoLimpio;
        }

        return mb_substr($textoLimpio, 0, 147).'...';
    }

    private function formatearDivisor(int $valor): string
    {
        return (string) max($valor, 1);
    }
}
