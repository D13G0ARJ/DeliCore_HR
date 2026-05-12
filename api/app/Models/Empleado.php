<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Empleado extends Model
{
    protected $table = 'empleados';

    protected $fillable = [
        'puesto_principal_id',
        'supervisor_inmediato_id',
        'nombre_completo',
        'correo',
        'antiguedad_texto',
        'fecha_ingreso',
        'estado',
    ];

    protected $casts = [
        'fecha_ingreso' => 'date',
    ];

    public function puestoPrincipal(): BelongsTo
    {
        return $this->belongsTo(Puesto::class, 'puesto_principal_id');
    }

    public function supervisorInmediato(): BelongsTo
    {
        return $this->belongsTo(self::class, 'supervisor_inmediato_id');
    }

    public function subordinados(): HasMany
    {
        return $this->hasMany(self::class, 'supervisor_inmediato_id');
    }

    public function roles(): HasMany
    {
        return $this->hasMany(RolEmpleado::class, 'empleado_id');
    }

    public function registrosKpi(): HasMany
    {
        return $this->hasMany(RegistroKpi::class, 'empleado_id');
    }

    public function seguimientosKpi(): HasMany
    {
        return $this->hasMany(SeguimientoKpi::class, 'empleado_id');
    }
}
