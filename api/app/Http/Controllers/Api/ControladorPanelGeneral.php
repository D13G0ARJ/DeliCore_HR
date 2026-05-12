<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DefinicionKpi;
use App\Models\Departamento;
use App\Models\Puesto;
use App\Models\RegistroKpi;
use App\Models\RolEmpleado;
use Illuminate\Http\JsonResponse;

class ControladorPanelGeneral extends Controller
{
    public function mostrar(): JsonResponse
    {
        $departamentosPiloto = Departamento::query()
            ->withCount('puestos')
            ->with('manual')
            ->whereIn('nombre', [
                'Operaciones',
                'ADMINISTRACION Y FINANZAS',
                'RECURSOS HUMANOS',
            ])
            ->orderBy('id')
            ->get();

        $registros = RegistroKpi::query()
            ->with('definicionKpi.puesto')
            ->orderByDesc('valor_real')
            ->get();

        $promedioCumplimiento = (int) round($registros->avg('valor_real') ?? 0);
        $rolesMultiples = RolEmpleado::query()->where('tipo_rol', 'adicional')->count();

        return response()->json([
            'empresa' => [
                'nombre' => 'Las Delicias Import LLC',
                'industria' => 'Distribucion de quesos, lacteos y productos refrigerados',
                'objetivo' => 'Centralizar roles, responsabilidades, metricas y soporte operativo por area',
            ],
            'resumen' => [
                [
                    'id' => 'departamentos',
                    'titulo' => 'Departamentos activos',
                    'valor' => (string) Departamento::query()->count(),
                    'detalle' => 'Estructura base sembrada desde el organigrama operativo',
                    'tendencia' => $departamentosPiloto->count().' areas piloto listas',
                ],
                [
                    'id' => 'puestos',
                    'titulo' => 'Puestos priorizados',
                    'valor' => (string) Puesto::query()->count(),
                    'detalle' => 'Cargos con jerarquia navegable para la demo',
                    'tendencia' => $rolesMultiples.' empleados con multiples roles',
                ],
                [
                    'id' => 'kpis',
                    'titulo' => 'KPIs definidos',
                    'valor' => (string) DefinicionKpi::query()->count(),
                    'detalle' => 'Metricas iniciales asociadas a la estructura sembrada',
                    'tendencia' => $registros->count().' registros activos de seguimiento',
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
                    'estado' => $departamento->nombre === 'RECURSOS HUMANOS' ? 'Reporta a Zenaida' : 'Estructura confirmada',
                    'meta' => $departamento->manual?->contenido ?? $departamento->descripcion,
                ];
            })->values(),
            'puestos_destacados' => $registros->map(function (RegistroKpi $registro) {
                return [
                    'nombre' => $registro->definicionKpi?->puesto?->nombre,
                    'supervisor' => $registro->definicionKpi?->puesto?->supervisor?->nombre ?? 'Direccion General',
                    'frecuencia' => $registro->definicionKpi?->frecuencia,
                    'kpi_principal' => $registro->definicionKpi?->nombre,
                    'progreso' => (int) $registro->valor_real,
                ];
            })->values(),
            'alertas' => [
                $rolesMultiples.' empleados reportan multiples roles sin distribucion formal de tiempo.',
                'La jerarquia ya fue alineada con el organigrama oficial del cliente.',
                'El siguiente paso es enriquecer cada nodo con fichas funcionales y asistente IA por rol.',
            ],
            'asistente_ia' => [
                'estado' => 'Piloto',
                'rol_activo' => 'RECURSOS HUMANOS',
                'capacidad' => 'Responder preguntas usando solo el manual asociado al rol o area',
            ],
        ]);
    }
}
