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
    public function mostrar(Request $request): JsonResponse
    {
        $empleadoId = $request->integer('empleado_id');
        $empleadoObjetivo = $empleadoId
            ? Empleado::query()->with(['puestoPrincipal.departamento', 'roles.puesto.departamento'])->find($empleadoId)
            : null;

        $definiciones = DefinicionKpi::query()
            ->with(['puesto.departamento', 'empleado.puestoPrincipal.departamento', 'registros.empleado'])
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

        $departamentosPermitidos = collect();
        $puestosPermitidos = collect();

        if ($empleadoObjetivo) {
            $departamentosPermitidos = collect([$empleadoObjetivo->puestoPrincipal?->departamento?->id])
                ->merge($empleadoObjetivo->roles->pluck('puesto.departamento.id'))
                ->filter()
                ->unique()
                ->values();

            $puestosPermitidos = collect([$empleadoObjetivo->puesto_principal_id])
                ->merge($empleadoObjetivo->roles->pluck('puesto_id'))
                ->filter()
                ->unique()
                ->values();
        }

        $definicionesVisibles = $empleadoObjetivo
            ? $definiciones->filter(function (DefinicionKpi $definicion) use ($empleadoObjetivo, $departamentosPermitidos, $puestosPermitidos) {
                if ($definicion->empleado_id === $empleadoObjetivo->id) {
                    return true;
                }

                if ($definicion->empleado_id !== null) {
                    return false;
                }

                return $departamentosPermitidos->contains($definicion->puesto?->departamento?->id)
                    || $puestosPermitidos->contains($definicion->puesto_id);
            })->values()
            : $definiciones->values();

        $definicionesVisiblesIds = $definicionesVisibles->pluck('id');

        $registrosVisibles = $empleadoObjetivo
            ? $registros
                ->filter(fn (RegistroKpi $registro) => $definicionesVisiblesIds->contains($registro->definicion_kpi_id))
                ->values()
            : $registros->values();

        $puestosVisibles = $empleadoObjetivo
            ? $puestos
                ->filter(fn (Puesto $puesto) => $departamentosPermitidos->contains($puesto->departamento?->id) || $puestosPermitidos->contains($puesto->id))
                ->values()
            : $puestos->values();

        $seguimientosVisibles = $empleadoObjetivo
            ? $seguimientos
                ->filter(function (SeguimientoKpi $seguimiento) use ($empleadoObjetivo, $departamentosPermitidos, $puestosPermitidos) {
                    if ($seguimiento->empleado_id === $empleadoObjetivo->id) {
                        return true;
                    }

                    return $departamentosPermitidos->contains($seguimiento->puesto?->departamento?->id)
                        || $puestosPermitidos->contains($seguimiento->puesto_id);
                })
                ->values()
            : $seguimientos->values();

        $promedioGlobal = (int) round($registrosVisibles->avg('valor_real') ?? 0);
        $puestosSinKpi = $puestosVisibles->filter(fn (Puesto $puesto) => $puesto->definicionesKpi->isEmpty());
        $empleadosConKpi = $registrosVisibles->pluck('empleado_id')->filter()->unique()->count();

        $catalogo = $definicionesVisibles->map(function (DefinicionKpi $definicion) {
            return [
                'id' => $definicion->id,
                'nombre' => $definicion->nombre,
                'descripcion' => $definicion->descripcion,
                'puesto_id' => $definicion->puesto_id,
                'puesto' => $definicion->puesto?->nombre,
                'departamento_id' => $definicion->puesto?->departamento?->id,
                'departamento' => $definicion->puesto?->departamento?->nombre,
                'empleado_id' => $definicion->empleado_id,
                'empleado' => $definicion->empleado?->nombre_completo,
                'tipo_asignacion' => $definicion->empleado_id ? 'empleado' : 'puesto',
                'frecuencia' => $definicion->frecuencia,
                'formula' => $definicion->formula,
                'meta_valor' => $definicion->meta_valor,
                'unidad' => $definicion->unidad,
                'promedio' => (int) round($definicion->registros->avg('valor_real') ?? 0),
                'origen' => $definicion->origen,
                'registros' => $definicion->registros->count(),
            ];
        })->values();

        $trackerPorRol = $seguimientosVisibles
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
                            'empleado_id' => $seguimiento->empleado_id,
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
                            'justificacion_respuesta' => $seguimiento->justificacion_respuesta,
                        ];
                    })->values(),
                ];
            })
            ->values();

        $respuesta = [
            'resumen' => [
                'total_kpis' => $definicionesVisibles->count(),
                'registros_activos' => $registrosVisibles->count(),
                'promedio_global' => $promedioGlobal,
                'puestos_sin_kpi' => $puestosSinKpi->count(),
                'empleados_con_kpi' => $empleadosConKpi,
                'seguimientos_pendientes' => $seguimientosVisibles->where('completado', false)->count(),
            ],
            'catalogo' => $catalogo,
            'rendimiento_empleados' => Empleado::query()
                ->with(['puestoPrincipal.departamento', 'registrosKpi'])
                ->get()
                ->filter(function (Empleado $empleado) use ($empleadoObjetivo, $departamentosPermitidos) {
                    if (! $empleadoObjetivo) {
                        return true;
                    }

                    return $departamentosPermitidos->contains($empleado->puestoPrincipal?->departamento?->id);
                })
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
                ->filter(fn (RegistroKpi $registro) => $definicionesVisiblesIds->contains($registro->definicion_kpi_id))
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
                'kpis_bajo_objetivo' => $definicionesVisibles
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
            'distribucion_departamentos' => $definicionesVisibles
                ->groupBy(fn (DefinicionKpi $definicion) => $definicion->puesto?->departamento?->nombre)
                ->map(fn ($grupo, $departamento) => [
                    'departamento' => $departamento,
                    'total_kpis' => $grupo->count(),
                    'promedio' => (int) round($grupo->flatMap->registros->avg('valor_real') ?? 0),
                ])
                ->values(),
            'tracker_por_rol' => $trackerPorRol,
            'kpis_sugeridos' => $puestosSinKpi
                ->flatMap(fn (Puesto $puesto) => $this->sugerirKpis($puesto))
                ->values(),
            'gestion' => [
                'puestos_disponibles' => $empleadoObjetivo ? [] : $puestos->map(fn (Puesto $puesto) => [
                    'id' => $puesto->id,
                    'nombre' => $puesto->nombre,
                    'departamento' => $puesto->departamento?->nombre,
                ])->values(),
                'frecuencias' => $empleadoObjetivo ? [] : ['Diario', 'Semanal', 'Mensual'],
                'unidades' => $empleadoObjetivo ? [] : ['%', 'USD', 'pedidos', 'tickets', 'clientes', 'visitas'],
            ],
        ];

        if ($empleadoObjetivo) {
            $seguimientosEmpleado = $seguimientos->where('empleado_id', $empleadoObjetivo->id)->values();
            $kpisRelacionados = $catalogo->values();

            $respuesta['mi_panel'] = [
                'empleado' => [
                    'id' => $empleadoObjetivo->id,
                    'nombre' => $empleadoObjetivo->nombre_completo,
                    'correo' => $empleadoObjetivo->correo,
                    'puesto' => $empleadoObjetivo->puestoPrincipal?->nombre,
                    'departamento' => $empleadoObjetivo->puestoPrincipal?->departamento?->nombre,
                ],
                'resumen' => [
                    'kpis_asignados' => $kpisRelacionados->count(),
                    'seguimientos_pendientes' => $seguimientosEmpleado->where('completado', false)->count(),
                    'cumplimiento_promedio' => (int) round(
                        RegistroKpi::query()->where('empleado_id', $empleadoObjetivo->id)->avg('valor_real') ?? 0
                    ),
                ],
                'seguimientos' => $seguimientosEmpleado->map(fn (SeguimientoKpi $seguimiento) => [
                    'id' => $seguimiento->id,
                    'titulo' => $seguimiento->titulo,
                    'descripcion' => $seguimiento->descripcion,
                    'fecha_seguimiento' => optional($seguimiento->fecha_seguimiento)?->format('Y-m-d'),
                    'frecuencia' => $seguimiento->frecuencia,
                    'completado' => $seguimiento->completado,
                    'valor_actual' => $seguimiento->valor_actual !== null ? (float) $seguimiento->valor_actual : null,
                    'meta_valor' => $seguimiento->meta_valor !== null ? (float) $seguimiento->meta_valor : null,
                    'unidad' => $seguimiento->unidad,
                    'kpi' => $seguimiento->definicionKpi?->nombre,
                    'justificacion_respuesta' => $seguimiento->justificacion_respuesta,
                ])->values(),
                'kpis' => $kpisRelacionados,
            ];

            $departamentosVisibles = $empleadoObjetivo->roles
                ->pluck('puesto.departamento')
                ->prepend($empleadoObjetivo->puestoPrincipal?->departamento)
                ->filter();

            $puestosVisiblesPanel = $empleadoObjetivo->roles
                ->pluck('puesto')
                ->prepend($empleadoObjetivo->puestoPrincipal)
                ->filter();

            $respuesta['alcance'] = [
                'modo' => 'empleado',
                'empleado_id' => $empleadoObjetivo->id,
                'empleado' => $empleadoObjetivo->nombre_completo,
                'departamentos' => $departamentosVisibles->pluck('nombre')->unique()->values(),
                'puestos' => $puestosVisiblesPanel->pluck('nombre')->unique()->values(),
            ];
        } else {
            $respuesta['alcance'] = [
                'modo' => 'admin',
                'departamentos' => [],
                'puestos' => [],
            ];
        }

        return response()->json($respuesta);
    }

    public function crearDefinicion(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'puesto_id' => ['nullable', 'exists:puestos,id'],
            'empleado_id' => ['nullable', 'exists:empleados,id'],
            'nombre' => ['required', 'string', 'max:120'],
            'descripcion' => ['nullable', 'string', 'max:500'],
            'formula' => ['nullable', 'string', 'max:255'],
            'frecuencia' => ['required', 'string', 'max:30'],
            'meta_valor' => ['nullable', 'numeric'],
            'unidad' => ['nullable', 'string', 'max:30'],
        ]);

        if (! $request->filled('puesto_id') && ! $request->filled('empleado_id')) {
            return response()->json([
                'mensaje' => 'Debes indicar un puesto o un empleado para crear el KPI.',
                'errors' => [
                    'puesto_id' => ['Debes indicar un puesto o un empleado para crear el KPI.'],
                ],
            ], 422);
        }

        $empleado = null;

        if (! empty($datos['empleado_id'])) {
            $empleado = Empleado::query()->with('puestoPrincipal.departamento')->findOrFail($datos['empleado_id']);
            $datos['puesto_id'] = $empleado->puesto_principal_id;
        }

        $definicion = DefinicionKpi::query()->create([
            ...$datos,
            'origen' => $empleado ? 'admin_empleado' : 'admin_manual',
        ]);

        $this->crearSeguimientosParaDefinicion($definicion);

        $definicion->load('puesto.departamento', 'empleado.puestoPrincipal.departamento', 'registros');

        return response()->json([
            'mensaje' => 'KPI creado correctamente.',
            'kpi' => [
                'id' => $definicion->id,
                'nombre' => $definicion->nombre,
                'descripcion' => $definicion->descripcion,
                'puesto' => $definicion->puesto?->nombre,
                'departamento' => $definicion->puesto?->departamento?->nombre,
                'empleado_id' => $definicion->empleado_id,
                'empleado' => $definicion->empleado?->nombre_completo,
                'tipo_asignacion' => $definicion->empleado_id ? 'empleado' : 'puesto',
                'frecuencia' => $definicion->frecuencia,
                'formula' => $definicion->formula,
                'meta_valor' => $definicion->meta_valor,
                'unidad' => $definicion->unidad,
                'promedio' => 0,
                'origen' => $definicion->origen,
                'registros' => 0,
            ],
        ], 201);
    }

    public function actualizarSeguimiento(Request $request, SeguimientoKpi $seguimiento): JsonResponse
    {
        $datos = $request->validate([
            'completado' => ['required', 'boolean'],
            'valor_actual' => ['nullable', 'numeric'],
            'justificacion_respuesta' => ['nullable', 'string', 'max:500'],
        ]);

        $seguimiento->update($datos);

        return response()->json([
            'mensaje' => 'Seguimiento actualizado',
            'seguimiento' => [
                'id' => $seguimiento->id,
                'completado' => $seguimiento->fresh()->completado,
                'valor_actual' => $seguimiento->fresh()->valor_actual,
                'justificacion_respuesta' => $seguimiento->fresh()->justificacion_respuesta,
            ],
        ]);
    }

    private function crearSeguimientosParaDefinicion(DefinicionKpi $definicion): void
    {
        $definicion->loadMissing('puesto.departamento', 'empleado.puestoPrincipal.departamento');

        $empleadosObjetivo = $definicion->empleado_id
            ? Empleado::query()
                ->whereKey($definicion->empleado_id)
                ->get()
            : Empleado::query()
                ->where(function ($query) use ($definicion) {
                    $query->where('puesto_principal_id', $definicion->puesto_id)
                        ->orWhereHas('roles', function ($rolesQuery) use ($definicion) {
                            $rolesQuery->where('puesto_id', $definicion->puesto_id);
                        });
                })
                ->get()
                ->unique('id')
                ->values();

        foreach ($empleadosObjetivo as $empleado) {
            SeguimientoKpi::query()->updateOrCreate(
                [
                    'empleado_id' => $empleado->id,
                    'puesto_id' => $definicion->puesto_id,
                    'definicion_kpi_id' => $definicion->id,
                ],
                [
                    'titulo' => 'Registrar avance de '.$definicion->nombre,
                    'descripcion' => $definicion->descripcion ?: 'Actualiza el avance actual de este KPI.',
                    'frecuencia' => $definicion->frecuencia,
                    'fecha_seguimiento' => now()->toDateString(),
                    'completado' => false,
                    'valor_actual' => null,
                    'meta_valor' => $definicion->meta_valor,
                    'unidad' => $definicion->unidad,
                    'justificacion_respuesta' => '',
                ]
            );
        }
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
