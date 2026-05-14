<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use Illuminate\Http\JsonResponse;

class ControladorAccesoDemo extends Controller
{
    public function mostrar(): JsonResponse
    {
        $empleados = Empleado::query()
            ->with(['puestoPrincipal.departamento', 'roles.puesto.departamento'])
            ->where('estado', 'activo')
            ->orderBy('nombre_completo')
            ->get();

        $admins = $empleados
            ->filter(function (Empleado $empleado) {
                $puesto = mb_strtoupper($empleado->puestoPrincipal?->nombre ?? '');

                return in_array($puesto, ['DUEÑOS', 'DIRECTOR GENERAL'], true);
            })
            ->map(fn (Empleado $empleado) => $this->transformarPerfil($empleado, 'admin'))
            ->values();

        $empleadosOperativos = $empleados
            ->map(fn (Empleado $empleado) => $this->transformarPerfil($empleado, 'empleado'))
            ->values();

        return response()->json([
            'empresa' => [
                'nombre' => 'Las Delicias Import LLC',
                'marca' => 'DeliCore HR',
            ],
            'credenciales_demo' => [
                'clave' => 'demo123',
                'nota' => 'Selecciona un perfil para simular el acceso.',
            ],
            'perfiles' => [
                'admin' => $admins,
                'empleado' => $empleadosOperativos,
            ],
        ]);
    }

    private function transformarPerfil(Empleado $empleado, string $tipo): array
    {
        $rolPrincipal = $empleado->puestoPrincipal?->nombre;
        $departamento = $empleado->puestoPrincipal?->departamento?->nombre;

        return [
            'tipo' => $tipo,
            'empleado_id' => $empleado->id,
            'nombre' => $empleado->nombre_completo,
            'correo' => $empleado->correo,
            'rol_nombre' => $tipo === 'admin' ? 'Administrador' : 'Empleado',
            'puesto' => $rolPrincipal,
            'departamento' => $departamento,
            'vistas' => $tipo === 'admin'
                ? ['dashboard', 'organigrama', 'directorio', 'gestion-usuarios', 'perfil', 'kpis', 'seguimiento-kpis', 'ia']
                : ['dashboard', 'perfil', 'kpis', 'seguimiento-kpis', 'ia'],
            'resumen' => $tipo === 'admin'
                ? 'Gestiona estructura, KPIs y seguimiento operativo.'
                : 'Consulta tu perfil, tus indicadores y tus tareas KPI.',
            'roles_adicionales' => $empleado->roles
                ->where('tipo_rol', 'adicional')
                ->map(fn ($rol) => [
                    'puesto' => $rol->puesto?->nombre,
                    'departamento' => $rol->puesto?->departamento?->nombre,
                ])
                ->values(),
        ];
    }
}
