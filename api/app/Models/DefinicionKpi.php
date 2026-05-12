<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DefinicionKpi extends Model
{
    protected $table = 'definiciones_kpi';

    protected $fillable = [
        'puesto_id',
        'nombre',
        'descripcion',
        'formula',
        'frecuencia',
        'meta_valor',
        'unidad',
        'origen',
    ];

    protected $casts = [
        'meta_valor' => 'decimal:2',
    ];

    public function puesto(): BelongsTo
    {
        return $this->belongsTo(Puesto::class, 'puesto_id');
    }

    public function registros(): HasMany
    {
        return $this->hasMany(RegistroKpi::class, 'definicion_kpi_id');
    }
}
