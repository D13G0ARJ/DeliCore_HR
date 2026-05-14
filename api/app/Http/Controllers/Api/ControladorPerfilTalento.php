<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use App\Models\Puesto;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;

class ControladorPerfilTalento extends Controller
{
    public function mostrar(): JsonResponse
    {
        $empleados = Empleado::query()
            ->with([
                'puestoPrincipal.departamento.manual',
                'puestoPrincipal.manual',
                'puestoPrincipal.supervisor',
                'supervisorInmediato.puestoPrincipal',
                'subordinados.puestoPrincipal',
                'roles.puesto.departamento',
                'registrosKpi.definicionKpi',
            ])
            ->orderBy('nombre_completo')
            ->get();

        $puestos = Puesto::query()
            ->with([
                'departamento.manual',
                'manual',
                'supervisor',
                'empleadosPrincipales',
                'definicionesKpi.registros',
            ])
            ->orderBy('nombre')
            ->get();

        return response()->json([
            'estadisticas' => [
                'empleados' => $empleados->count(),
                'puestos' => $puestos->count(),
                'departamentos' => $puestos->pluck('departamento.nombre')->filter()->unique()->count(),
                'promedio_kpi' => (int) round($empleados->flatMap->registrosKpi->avg('valor_real') ?? 0),
            ],
            'empleados' => $empleados->map(fn (Empleado $empleado) => $this->transformarEmpleado($empleado))->values(),
            'puestos' => $puestos->map(fn (Puesto $puesto) => $this->transformarPuesto($puesto))->values(),
            'filtros' => [
                'departamentos' => $puestos->pluck('departamento.nombre')->filter()->unique()->sort()->values(),
                'niveles' => $puestos->pluck('nivel')->filter()->unique()->sort()->values(),
                'estados' => $empleados->pluck('estado')->filter()->unique()->sort()->values(),
            ],
        ]);
    }

    private function transformarEmpleado(Empleado $empleado): array
    {
        $puesto = $empleado->puestoPrincipal;
        $manual = $puesto?->manual?->contenido
            ?? $puesto?->departamento?->manual?->contenido
            ?? $puesto?->proposito;

        return [
            'id' => $empleado->id,
            'nombre_completo' => $empleado->nombre_completo,
            'correo' => $empleado->correo,
            'estado' => $empleado->estado,
            'antiguedad_texto' => $empleado->antiguedad_texto,
            'fecha_ingreso' => optional($empleado->fecha_ingreso)?->format('Y-m-d'),
            'puesto_principal' => [
                'id' => $puesto?->id,
                'nombre' => $puesto?->nombre,
                'nivel' => $puesto?->nivel,
                'departamento' => $puesto?->departamento?->nombre,
                'proposito' => $puesto?->proposito,
            ],
            'supervisor' => $empleado->supervisorInmediato
                ? [
                    'nombre' => $empleado->supervisorInmediato->nombre_completo,
                    'puesto' => $empleado->supervisorInmediato->puestoPrincipal?->nombre,
                ]
                : null,
            'subordinados' => $empleado->subordinados
                ->map(fn (Empleado $subordinado) => [
                    'id' => $subordinado->id,
                    'nombre' => $subordinado->nombre_completo,
                    'puesto' => $subordinado->puestoPrincipal?->nombre,
                ])
                ->values(),
            'roles_adicionales' => $empleado->roles
                ->where('tipo_rol', 'adicional')
                ->map(fn ($rol) => [
                    'puesto' => $rol->puesto?->nombre,
                    'departamento' => $rol->puesto?->departamento?->nombre,
                    'condicion' => $rol->condicion,
                    'porcentaje_tiempo' => $rol->porcentaje_tiempo,
                    'observaciones' => $rol->observaciones,
                ])
                ->values(),
            'responsabilidades' => $this->extraerResponsabilidades($manual),
            'manual_resumen' => $manual,
            'departamentos_relacionados' => collect([
                $puesto?->departamento?->nombre,
                ...$empleado->roles
                    ->where('tipo_rol', 'adicional')
                    ->map(fn ($rol) => $rol->puesto?->departamento?->nombre)
                    ->all(),
            ])->filter()->unique()->values(),
            'promedio_cumplimiento' => (int) round($empleado->registrosKpi->avg('valor_real') ?? 0),
            'kpis' => $empleado->registrosKpi
                ->sortByDesc('periodo_fin')
                ->take(4)
                ->map(fn ($registro) => [
                    'nombre' => $registro->definicionKpi?->nombre,
                    'frecuencia' => $registro->definicionKpi?->frecuencia,
                    'valor_real' => (float) $registro->valor_real,
                    'unidad' => $registro->definicionKpi?->unidad,
                    'meta_valor' => $registro->definicionKpi?->meta_valor,
                    'periodo_fin' => optional($registro->periodo_fin)?->format('Y-m-d'),
                ])
                ->values(),
        ];
    }

    private function transformarPuesto(Puesto $puesto): array
    {
        $manual = $puesto->manual?->contenido
            ?? $puesto->departamento?->manual?->contenido
            ?? $puesto->proposito;

        $promedio = $puesto->definicionesKpi
            ->flatMap(fn ($kpi) => $kpi->registros)
            ->avg('valor_real');

        return [
            'id' => $puesto->id,
            'nombre' => $puesto->nombre,
            'nivel' => $puesto->nivel,
            'departamento' => $puesto->departamento?->nombre,
            'proposito' => $puesto->proposito,
            'manual_resumen' => $manual,
            'responsabilidades' => $this->extraerResponsabilidades($manual),
            'supervisor' => $puesto->supervisor?->nombre,
            'empleados_asignados' => $puesto->empleadosPrincipales
                ->map(fn (Empleado $empleado) => [
                    'id' => $empleado->id,
                    'nombre' => $empleado->nombre_completo,
                    'correo' => $empleado->correo,
                ])
                ->values(),
            'kpis_definidos' => $puesto->definicionesKpi
                ->map(fn ($kpi) => [
                    'nombre' => $kpi->nombre,
                    'frecuencia' => $kpi->frecuencia,
                    'meta_valor' => $kpi->meta_valor,
                    'unidad' => $kpi->unidad,
                    'promedio' => (int) round($kpi->registros->avg('valor_real') ?? 0),
                ])
                ->values(),
            'promedio_cumplimiento' => (int) round($promedio ?? 0),
        ];
    }

    private function extraerResponsabilidades(?string $manual): Collection
    {
        if (!$manual) {
            return collect();
        }

        return collect(preg_split('/\r?\n|•|-|[.;]/', $manual))
            ->map(fn ($item) => trim((string) $item))
            ->filter(fn ($item) => mb_strlen($item) > 8)
            ->unique()
            ->take(5)
            ->values();
    }
}
