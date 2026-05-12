<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Departamento extends Model
{
    protected $table = 'departamentos';

    protected $fillable = [
        'nombre',
        'descripcion',
        'departamento_padre_id',
        'lider_nombre',
    ];

    public function departamentoPadre(): BelongsTo
    {
        return $this->belongsTo(self::class, 'departamento_padre_id');
    }

    public function puestos(): HasMany
    {
        return $this->hasMany(Puesto::class, 'departamento_id');
    }

    public function manual(): HasOne
    {
        return $this->hasOne(ManualPuesto::class, 'departamento_id');
    }
}
