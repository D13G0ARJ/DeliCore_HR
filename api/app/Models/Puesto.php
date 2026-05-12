<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Puesto extends Model
{
    protected $table = 'puestos';

    protected $fillable = [
        'departamento_id',
        'puesto_supervisor_id',
        'nombre',
        'nivel',
        'proposito',
        'es_activo',
    ];

    public function departamento(): BelongsTo
    {
        return $this->belongsTo(Departamento::class, 'departamento_id');
    }

    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(self::class, 'puesto_supervisor_id');
    }

    public function empleadosPrincipales(): HasMany
    {
        return $this->hasMany(Empleado::class, 'puesto_principal_id');
    }

    public function subordinados(): HasMany
    {
        return $this->hasMany(self::class, 'puesto_supervisor_id');
    }

    public function manual(): HasOne
    {
        return $this->hasOne(ManualPuesto::class, 'puesto_id');
    }

    public function definicionesKpi(): HasMany
    {
        return $this->hasMany(DefinicionKpi::class, 'puesto_id');
    }

    public function seguimientosKpi(): HasMany
    {
        return $this->hasMany(SeguimientoKpi::class, 'puesto_id');
    }
}
