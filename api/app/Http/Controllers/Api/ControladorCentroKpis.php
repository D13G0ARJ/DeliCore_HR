<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DefinicionKpi;
use App\Models\Empleado;
use App\Models\Puesto;
use App\Models\RegistroKpi;
use App\Models\SeguimientoKpi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class ControladorCentroKpis extends Controller
{
    public function mostrar(): JsonResponse
    {
        $definiciones = DefinicionKpi::query()
            ->with(['puesto.departamento', 'registros.empleado'])
            ->orderBy('nombre')
            ->get();

        $registros = RegistroKpi::query()
            ->with(['empleado.puestoPrincipal.departamento', 'definicionKpi.puesto'])
            ->orderByDesc('periodo_fin')
            ->get();

        $puestos = Puesto::query()
            ->with(['definicionesKpi', 'departamento.manual', 'manual'])
            ->orderBy('nombre')
            ->get();

        $seguimientos = SeguimientoKpi::query()
            ->with(['empleado.puestoPrincipal.departamento', 'puesto.departamento', 'definicionKpi'])
            ->orderBy('fecha_seguimiento')
            ->orderBy('titulo')
            ->get();

        $promedioGlobal = (int) round($registros->avg('valor_real') ?? 0);
        $puestosSinKpi = $puestos->filter(fn (Puesto $puesto) => $puesto->definicionesKpi->isEmpty());
        $empleadosConKpi = $registros->pluck('empleado_id')->unique()->count();

        return response()->json([
            'resumen' => [
                'total_kpis' => $definiciones->count(),
                'registros_activos' => $registros->count(),
                'promedio_global' => $promedioGlobal,
                'puestos_sin_kpi' => $puestosSinKpi->count(),
                'empleados_con_kpi' => $empleadosConKpi,
                'seguimientos_pendientes' => $seguimientos->where('completado', false)->count(),
            ],
            'catalogo' => $definiciones->map(function (DefinicionKpi $definicion) {
                return [
                    'id' => $definicion->id,
                    'nombre' => $definicion->nombre,
                    'puesto' => $definicion->puesto?->nombre,
                    'departamento' => $definicion->puesto?->departamento?->nombre,
                    'frecuencia' => $definicion->frecuencia,
                    'formula' => $definicion->formula,
                    'meta_valor' => $definicion->meta_valor,
                    'unidad' => $definicion->unidad,
                    'promedio' => (int) round($definicion->registros->avg('valor_real') ?? 0),
                    'origen' => $definicion->origen,
                ];
            })->values(),
            'rendimiento_empleados' => Empleado::query()
                ->with(['puestoPrincipal.departamento', 'registrosKpi'])
                ->get()
                ->map(function (Empleado $empleado) {
                    return [
                        'id' => $empleado->id,
                        'nombre' => $empleado->nombre_completo,
                        'puesto' => $empleado->puestoPrincipal?->nombre,
                        'departamento' => $empleado->puestoPrincipal?->departamento?->nombre,
                        'promedio' => (int) round($empleado->registrosKpi->avg('valor_real') ?? 0),
                        'registros' => $empleado->registrosKpi->count(),
                    ];
                })
                ->sortByDesc('promedio')
                ->values()
                ->take(8)
                ->values(),
            'seguimiento_reciente' => $registros
                ->map(function (RegistroKpi $registro) {
                    $meta = (float) ($registro->definicionKpi?->meta_valor ?? 0);
                    $valor = (float) $registro->valor_real;

                    return [
                        'id' => $registro->id,
                        'empleado' => $registro->empleado?->nombre_completo,
                        'puesto' => $registro->empleado?->puestoPrincipal?->nombre,
                        'departamento' => $registro->empleado?->puestoPrincipal?->departamento?->nombre,
                        'kpi' => $registro->definicionKpi?->nombre,
                        'frecuencia' => $registro->definicionKpi?->frecuencia,
                        'valor_real' => $valor,
                        'meta_valor' => $meta,
                        'unidad' => $registro->definicionKpi?->unidad,
                        'periodo_fin' => optional($registro->periodo_fin)?->format('Y-m-d'),
                        'cumplimiento' => $meta > 0
                            ? (int) min(round(($valor / $meta) * 100), 100)
                            : (int) $valor,
                    ];
                })
                ->take(10)
                ->values(),
            'brechas' => [
                'puestos_sin_kpi' => $puestosSinKpi
                    ->map(fn (Puesto $puesto) => [
                        'puesto' => $puesto->nombre,
                        'departamento' => $puesto->departamento?->nombre,
                    ])
                    ->values(),
                'kpis_bajo_objetivo' => $definiciones
                    ->map(function (DefinicionKpi $definicion) {
                        $promedio = (int) round($definicion->registros->avg('valor_real') ?? 0);

                        return [
                            'nombre' => $definicion->nombre,
                            'puesto' => $definicion->puesto?->nombre,
                            'departamento' => $definicion->puesto?->departamento?->nombre,
                            'promedio' => $promedio,
                        ];
                    })
                    ->filter(fn ($item) => $item['promedio'] > 0 && $item['promedio'] < 92)
                    ->values(),
            ],
            'distribucion_departamentos' => $definiciones
                ->groupBy(fn (DefinicionKpi $definicion) => $definicion->puesto?->departamento?->nombre)
                ->map(fn ($grupo, $departamento) => [
                    'departamento' => $departamento,
                    'total_kpis' => $grupo->count(),
                    'promedio' => (int) round($grupo->flatMap->registros->avg('valor_real') ?? 0),
                ])
                ->values(),
            'tracker_por_rol' => $seguimientos
                ->groupBy('puesto_id')
                ->map(function (Collection $grupo) {
                    $primero = $grupo->first();

                    return [
                        'puesto_id' => $primero?->puesto_id,
                        'puesto' => $primero?->puesto?->nombre,
                        'departamento' => $primero?->puesto?->departamento?->nombre,
                        'empleado' => $primero?->empleado?->nombre_completo,
                        'progreso' => (int) round(($grupo->where('completado', true)->count() / max($grupo->count(), 1)) * 100),
                        'items' => $grupo->map(function (SeguimientoKpi $seguimiento) {
                            return [
                                'id' => $seguimiento->id,
                                'definicion_kpi_id' => $seguimiento->definicion_kpi_id,
                                'titulo' => $seguimiento->titulo,
                                'descripcion' => $seguimiento->descripcion,
                                'frecuencia' => $seguimiento->frecuencia,
                                'fecha_seguimiento' => optional($seguimiento->fecha_seguimiento)?->format('Y-m-d'),
                                'completado' => $seguimiento->completado,
                                'valor_actual' => $seguimiento->valor_actual !== null ? (float) $seguimiento->valor_actual : null,
                                'meta_valor' => $seguimiento->meta_valor !== null ? (float) $seguimiento->meta_valor : null,
                                'unidad' => $seguimiento->unidad,
                                'kpi' => $seguimiento->definicionKpi?->nombre,
                            ];
                        })->values(),
                    ];
                })
                ->values(),
            'kpis_sugeridos' => $puestosSinKpi
                ->flatMap(fn (Puesto $puesto) => $this->sugerirKpis($puesto))
                ->values(),
        ]);
    }

    public function actualizarSeguimiento(Request $request, SeguimientoKpi $seguimiento): JsonResponse
    {
        $datos = $request->validate([
            'completado' => ['required', 'boolean'],
        ]);

        $seguimiento->update([
            'completado' => $datos['completado'],
        ]);

        return response()->json([
            'mensaje' => 'Seguimiento actualizado',
            'seguimiento' => [
                'id' => $seguimiento->id,
                'completado' => $seguimiento->fresh()->completado,
            ],
        ]);
    }

    private function sugerirKpis(Puesto $puesto): Collection
    {
        $manual = $puesto->manual?->contenido
            ?? $puesto->departamento?->manual?->contenido
            ?? $puesto->proposito
            ?? '';

        $nombre = Str::upper(Str::ascii($puesto->nombre));

        $sugerencias = match (true) {
            Str::contains($nombre, 'ASISTENTES') => [
                [
                    'nombre' => 'Tiempo de respuesta a solicitudes ejecutivas',
                    'frecuencia' => 'Diario',
                    'meta' => '< 30 min',
                    'porque' => 'El rol esta orientado a soporte directo de direccion y prioriza agilidad operativa.',
                ],
                [
                    'nombre' => 'Cierres administrativos coordinados',
                    'frecuencia' => 'Semanal',
                    'meta' => '100%',
                    'porque' => 'Su manual enfatiza apoyo y seguimiento de tareas de direccion general.',
                ],
            ],
            Str::contains($nombre, 'OPERACIONES') => [
                [
                    'nombre' => 'Incidencias operativas resueltas en el dia',
                    'frecuencia' => 'Diario',
                    'meta' => '95%',
                    'porque' => 'El puesto coordina ejecucion operativa y necesita visibilidad de respuesta diaria.',
                ],
                [
                    'nombre' => 'Cumplimiento de flujo comercial a logistico',
                    'frecuencia' => 'Semanal',
                    'meta' => '90%',
                    'porque' => 'La descripcion del rol conecta coordinacion del negocio entre ventas y operacion.',
                ],
            ],
            Str::contains($nombre, 'SUPERVISORA') => [
                [
                    'nombre' => 'Cobertura de supervisiones del equipo',
                    'frecuencia' => 'Diario',
                    'meta' => '100%',
                    'porque' => 'El puesto supervisa el frente comercial y requiere seguimiento diario del equipo.',
                ],
                [
                    'nombre' => 'Ejecucion de visitas y reportes',
                    'frecuencia' => 'Semanal',
                    'meta' => '90%',
                    'porque' => 'El rol necesita evidencia de control y visibilidad operativa sobre vendedores y merchandisers.',
                ],
            ],
            Str::contains($nombre, 'MERCHANDISERS') => [
                [
                    'nombre' => 'Puntos de venta cubiertos',
                    'frecuencia' => 'Diario',
                    'meta' => '100%',
                    'porque' => 'La descripcion habla de ejecucion en punto operativo y apoyo comercial.',
                ],
                [
                    'nombre' => 'Material POP y exhibicion conforme',
                    'frecuencia' => 'Semanal',
                    'meta' => '95%',
                    'porque' => 'Permite medir consistencia de ejecucion comercial en campo.',
                ],
            ],
            default => [
                [
                    'nombre' => 'Cumplimiento operativo del rol',
                    'frecuencia' => 'Semanal',
                    'meta' => '90%',
                    'porque' => 'Se sugiere porque el manual describe responsabilidades con entregables verificables.',
                ],
            ],
        };

        return collect($sugerencias)->map(function (array $sugerencia) use ($puesto, $manual) {
            return [
                'puesto' => $puesto->nombre,
                'departamento' => $puesto->departamento?->nombre,
                'nombre' => $sugerencia['nombre'],
                'frecuencia' => $sugerencia['frecuencia'],
                'meta' => $sugerencia['meta'],
                'porque' => $sugerencia['porque'],
                'contexto' => Str::limit($manual, 160),
            ];
        });
    }
}
