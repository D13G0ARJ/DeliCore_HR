<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use App\Models\RegistroKpi;
use Illuminate\Http\JsonResponse;

class ControladorDirectorioEmpleados extends Controller
{
    public function mostrar(): JsonResponse
    {
        $empleados = Empleado::query()
            ->with([
                'puestoPrincipal.departamento.manual',
                'puestoPrincipal.manual',
                'supervisorInmediato.puestoPrincipal',
                'subordinados',
                'roles.puesto.departamento',
                'roles.puesto.manual',
                'registrosKpi.definicionKpi',
            ])
            ->orderBy('nombre_completo')
            ->get();

        $promedioKpi = (int) round(RegistroKpi::query()->avg('valor_real') ?? 0);
        $rolesAdicionales = $empleados->sum(
            fn (Empleado $empleado) => $empleado->roles->where('tipo_rol', 'adicional')->count()
        );
        $supervisores = $empleados->filter(fn (Empleado $empleado) => $empleado->subordinados->isNotEmpty())->count();
        $departamentosCobertura = $empleados
            ->map(fn (Empleado $empleado) => $empleado->puestoPrincipal?->departamento?->nombre)
            ->filter()
            ->unique()
            ->values();

        return response()->json([
            'estadisticas' => [
                'empleados_activos' => $empleados->where('estado', 'activo')->count(),
                'roles_adicionales' => $rolesAdicionales,
                'promedio_kpi' => $promedioKpi,
                'supervisores' => $supervisores,
                'departamentos_cobertura' => $departamentosCobertura->count(),
            ],
            'filtros' => [
                'departamentos' => $departamentosCobertura->sort()->values(),
                'estados' => $empleados->pluck('estado')->filter()->unique()->sort()->values(),
                'niveles' => $empleados
                    ->map(fn (Empleado $empleado) => $empleado->puestoPrincipal?->nivel)
                    ->filter()
                    ->unique()
                    ->sort()
                    ->values(),
            ],
            'empleados' => $empleados->map(fn (Empleado $empleado) => $this->transformarEmpleado($empleado))->values(),
        ]);
    }

    private function transformarEmpleado(Empleado $empleado): array
    {
        $puestoPrincipal = $empleado->puestoPrincipal;
        $manualRelacionado = $puestoPrincipal?->manual?->contenido
            ?? $puestoPrincipal?->departamento?->manual?->contenido
            ?? $puestoPrincipal?->proposito;

        $registrosKpi = $empleado->registrosKpi
            ->sortByDesc('periodo_fin')
            ->take(3)
            ->values();

        return [
            'id' => $empleado->id,
            'nombre_completo' => $empleado->nombre_completo,
            'correo' => $empleado->correo,
            'estado' => $empleado->estado,
            'antiguedad_texto' => $empleado->antiguedad_texto,
            'fecha_ingreso' => optional($empleado->fecha_ingreso)?->format('Y-m-d'),
            'puesto_principal' => [
                'nombre' => $puestoPrincipal?->nombre,
                'nivel' => $puestoPrincipal?->nivel,
                'departamento' => $puestoPrincipal?->departamento?->nombre,
                'proposito' => $puestoPrincipal?->proposito,
            ],
            'supervisor' => $empleado->supervisorInmediato
                ? [
                    'nombre' => $empleado->supervisorInmediato->nombre_completo,
                    'puesto' => $empleado->supervisorInmediato->puestoPrincipal?->nombre,
                ]
                : null,
            'roles_adicionales' => $empleado->roles
                ->where('tipo_rol', 'adicional')
                ->map(function ($rol) {
                    return [
                        'puesto' => $rol->puesto?->nombre,
                        'departamento' => $rol->puesto?->departamento?->nombre,
                        'tipo_rol' => $rol->tipo_rol,
                        'condicion' => $rol->condicion,
                        'porcentaje_tiempo' => $rol->porcentaje_tiempo,
                        'observaciones' => $rol->observaciones,
                    ];
                })
                ->values(),
            'kpis' => $registrosKpi->map(function (RegistroKpi $registro) {
                return [
                    'nombre' => $registro->definicionKpi?->nombre,
                    'frecuencia' => $registro->definicionKpi?->frecuencia,
                    'meta_valor' => $registro->definicionKpi?->meta_valor,
                    'unidad' => $registro->definicionKpi?->unidad,
                    'valor_real' => (float) $registro->valor_real,
                    'periodo_fin' => optional($registro->periodo_fin)?->format('Y-m-d'),
                ];
            })->values(),
            'promedio_cumplimiento' => (int) round($empleado->registrosKpi->avg('valor_real') ?? 0),
            'manual_resumen' => $manualRelacionado,
            'departamentos_relacionados' => collect([
                $puestoPrincipal?->departamento?->nombre,
                ...$empleado->roles
                    ->where('tipo_rol', 'adicional')
                    ->map(fn ($rol) => $rol->puesto?->departamento?->nombre)
                    ->all(),
            ])->filter()->unique()->values(),
        ];
    }
}
