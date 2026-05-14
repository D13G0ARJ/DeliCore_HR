<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use App\Models\Puesto;
use App\Models\RolEmpleado;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ControladorGestionUsuarios extends Controller
{
    public function mostrar(): JsonResponse
    {
        $empleados = Empleado::query()
            ->with([
                'puestoPrincipal.departamento',
                'supervisorInmediato.puestoPrincipal.departamento',
                'roles.puesto.departamento',
            ])
            ->orderBy('nombre_completo')
            ->get();

        $puestos = Puesto::query()
            ->with(['departamento', 'supervisor.departamento'])
            ->where('es_activo', true)
            ->orderBy('nombre')
            ->get();

        return response()->json([
            'resumen' => [
                'total_usuarios' => $empleados->count(),
                'usuarios_activos' => $empleados->where('estado', 'activo')->count(),
                'administradores' => $empleados->filter(fn (Empleado $empleado) => $this->esAdministrador($empleado->puestoPrincipal?->nombre))->count(),
                'roles_adicionales' => $empleados->sum(fn (Empleado $empleado) => $empleado->roles->where('tipo_rol', 'adicional')->count()),
            ],
            'empleados' => $empleados->map(fn (Empleado $empleado) => $this->transformarEmpleado($empleado))->values(),
            'catalogos' => [
                'puestos' => $puestos->map(fn (Puesto $puesto) => [
                    'id' => $puesto->id,
                    'nombre' => $puesto->nombre,
                    'departamento' => $puesto->departamento?->nombre,
                    'nivel' => $puesto->nivel,
                    'supervisor' => $puesto->supervisor?->nombre,
                ])->values(),
                'supervisores' => $empleados->map(fn (Empleado $empleado) => [
                    'id' => $empleado->id,
                    'nombre' => $empleado->nombre_completo,
                    'puesto' => $empleado->puestoPrincipal?->nombre,
                    'departamento' => $empleado->puestoPrincipal?->departamento?->nombre,
                ])->values(),
                'estados' => ['activo', 'inactivo', 'vacaciones'],
                'condiciones_rol' => ['permanente', 'temporal', 'apoyo'],
            ],
        ]);
    }

    public function crearEmpleado(Request $request): JsonResponse
    {
        $datos = $this->validarEmpleado($request);

        $empleado = DB::transaction(function () use ($datos) {
            $empleado = Empleado::query()->create([
                'puesto_principal_id' => $datos['puesto_principal_id'],
                'supervisor_inmediato_id' => $datos['supervisor_inmediato_id'] ?? null,
                'nombre_completo' => $datos['nombre_completo'],
                'correo' => $datos['correo'] ?? null,
                'antiguedad_texto' => $datos['antiguedad_texto'] ?? null,
                'fecha_ingreso' => $datos['fecha_ingreso'] ?? null,
                'estado' => $datos['estado'],
            ]);

            $this->sincronizarRolesAdicionales($empleado, $datos['roles_adicionales'] ?? []);

            return $empleado->fresh([
                'puestoPrincipal.departamento',
                'supervisorInmediato.puestoPrincipal.departamento',
                'roles.puesto.departamento',
            ]);
        });

        return response()->json([
            'mensaje' => 'Usuario creado correctamente.',
            'empleado' => $this->transformarEmpleado($empleado),
        ], 201);
    }

    public function actualizarEmpleado(Request $request, Empleado $empleado): JsonResponse
    {
        $datos = $this->validarEmpleado($request, $empleado);

        $empleado = DB::transaction(function () use ($datos, $empleado) {
            $empleado->update([
                'puesto_principal_id' => $datos['puesto_principal_id'],
                'supervisor_inmediato_id' => $datos['supervisor_inmediato_id'] ?? null,
                'nombre_completo' => $datos['nombre_completo'],
                'correo' => $datos['correo'] ?? null,
                'antiguedad_texto' => $datos['antiguedad_texto'] ?? null,
                'fecha_ingreso' => $datos['fecha_ingreso'] ?? null,
                'estado' => $datos['estado'],
            ]);

            $this->sincronizarRolesAdicionales($empleado, $datos['roles_adicionales'] ?? []);

            return $empleado->fresh([
                'puestoPrincipal.departamento',
                'supervisorInmediato.puestoPrincipal.departamento',
                'roles.puesto.departamento',
            ]);
        });

        return response()->json([
            'mensaje' => 'Usuario actualizado correctamente.',
            'empleado' => $this->transformarEmpleado($empleado),
        ]);
    }

    private function validarEmpleado(Request $request, ?Empleado $empleado = null): array
    {
        $datos = $request->validate([
            'nombre_completo' => ['required', 'string', 'max:255'],
            'correo' => ['nullable', 'email', 'max:255'],
            'puesto_principal_id' => ['required', 'integer', 'exists:puestos,id'],
            'supervisor_inmediato_id' => ['nullable', 'integer', 'exists:empleados,id'],
            'fecha_ingreso' => ['nullable', 'date'],
            'antiguedad_texto' => ['nullable', 'string', 'max:255'],
            'estado' => ['required', 'string', 'max:60'],
            'roles_adicionales' => ['nullable', 'array'],
            'roles_adicionales.*.puesto_id' => ['required', 'integer', 'exists:puestos,id'],
            'roles_adicionales.*.condicion' => ['nullable', 'string', 'max:100'],
            'roles_adicionales.*.porcentaje_tiempo' => ['nullable', 'integer', 'min:1', 'max:100'],
            'roles_adicionales.*.observaciones' => ['nullable', 'string', 'max:500'],
        ]);

        if ($empleado && ! empty($datos['supervisor_inmediato_id']) && (int) $datos['supervisor_inmediato_id'] === (int) $empleado->id) {
            throw ValidationException::withMessages([
                'supervisor_inmediato_id' => ['No puedes asignar al mismo usuario como supervisor.'],
            ]);
        }

        return $datos;
    }

    private function sincronizarRolesAdicionales(Empleado $empleado, array $roles): void
    {
        $rolesDepurados = collect($roles)
            ->filter(fn (array $rol) => ! empty($rol['puesto_id']))
            ->unique(fn (array $rol) => (int) $rol['puesto_id'])
            ->reject(fn (array $rol) => (int) $rol['puesto_id'] === (int) $empleado->puesto_principal_id)
            ->values();

        RolEmpleado::query()
            ->where('empleado_id', $empleado->id)
            ->where('tipo_rol', 'adicional')
            ->delete();

        foreach ($rolesDepurados as $rol) {
            RolEmpleado::query()->create([
                'empleado_id' => $empleado->id,
                'puesto_id' => $rol['puesto_id'],
                'tipo_rol' => 'adicional',
                'condicion' => $rol['condicion'] ?? 'permanente',
                'porcentaje_tiempo' => $rol['porcentaje_tiempo'] ?? null,
                'observaciones' => $rol['observaciones'] ?? null,
            ]);
        }
    }

    private function transformarEmpleado(Empleado $empleado): array
    {
        return [
            'id' => $empleado->id,
            'nombre_completo' => $empleado->nombre_completo,
            'correo' => $empleado->correo,
            'estado' => $empleado->estado,
            'fecha_ingreso' => optional($empleado->fecha_ingreso)?->format('Y-m-d'),
            'antiguedad_texto' => $empleado->antiguedad_texto,
            'tipo_acceso' => $this->esAdministrador($empleado->puestoPrincipal?->nombre) ? 'admin' : 'empleado',
            'puesto_principal' => [
                'id' => $empleado->puestoPrincipal?->id,
                'nombre' => $empleado->puestoPrincipal?->nombre,
                'departamento' => $empleado->puestoPrincipal?->departamento?->nombre,
                'nivel' => $empleado->puestoPrincipal?->nivel,
            ],
            'supervisor' => $empleado->supervisorInmediato ? [
                'id' => $empleado->supervisorInmediato->id,
                'nombre' => $empleado->supervisorInmediato->nombre_completo,
                'puesto' => $empleado->supervisorInmediato->puestoPrincipal?->nombre,
            ] : null,
            'roles_adicionales' => $empleado->roles
                ->where('tipo_rol', 'adicional')
                ->map(fn (RolEmpleado $rol) => [
                    'id' => $rol->id,
                    'puesto_id' => $rol->puesto_id,
                    'puesto' => $rol->puesto?->nombre,
                    'departamento' => $rol->puesto?->departamento?->nombre,
                    'condicion' => $rol->condicion,
                    'porcentaje_tiempo' => $rol->porcentaje_tiempo,
                    'observaciones' => $rol->observaciones,
                ])
                ->values(),
        ];
    }

    private function esAdministrador(?string $nombrePuesto): bool
    {
        $puesto = mb_strtoupper($nombrePuesto ?? '');

        return in_array($puesto, ['DUEÑOS', 'DIRECTOR GENERAL'], true);
    }
}
