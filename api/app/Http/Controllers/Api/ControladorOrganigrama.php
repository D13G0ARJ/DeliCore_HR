<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Puesto;
use Illuminate\Http\JsonResponse;

class ControladorOrganigrama extends Controller
{
    public function mostrar(): JsonResponse
    {
        $raices = Puesto::query()
            ->with([
                'departamento.manual',
                'subordinados.departamento.manual',
                'subordinados.manual',
                'subordinados.subordinados.departamento.manual',
                'subordinados.subordinados.manual',
            ])
            ->whereNull('puesto_supervisor_id')
            ->orderBy('id')
            ->get();

        return response()->json([
            'organigrama' => $raices->map(fn (Puesto $puesto) => $this->transformarNodo($puesto))->values(),
        ]);
    }

    private function transformarNodo(Puesto $puesto): array
    {
        $manual = $puesto->manual?->contenido ?? $puesto->departamento?->manual?->contenido ?? $puesto->departamento?->descripcion;

        return [
            'id' => $puesto->id,
            'nombre' => $puesto->nombre,
            'nivel' => $puesto->nivel,
            'proposito' => $puesto->proposito,
            'departamento' => $puesto->departamento?->nombre,
            'lideres' => $puesto->departamento?->lider_nombre,
            'manual' => $manual,
            'hijos' => $puesto->subordinados
                ->sortBy('id')
                ->map(fn (Puesto $subordinado) => $this->transformarNodo($subordinado))
                ->values()
                ->all(),
        ];
    }
}
