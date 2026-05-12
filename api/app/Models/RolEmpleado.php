<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RolEmpleado extends Model
{
    protected $table = 'roles_empleado';

    protected $fillable = [
        'empleado_id',
        'puesto_id',
        'tipo_rol',
        'condicion',
        'porcentaje_tiempo',
        'observaciones',
    ];

    public function empleado(): BelongsTo
    {
        return $this->belongsTo(Empleado::class, 'empleado_id');
    }

    public function puesto(): BelongsTo
    {
        return $this->belongsTo(Puesto::class, 'puesto_id');
    }
}
