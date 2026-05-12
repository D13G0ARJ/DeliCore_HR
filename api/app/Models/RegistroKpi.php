<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RegistroKpi extends Model
{
    protected $table = 'registros_kpi';

    protected $fillable = [
        'empleado_id',
        'definicion_kpi_id',
        'periodo_inicio',
        'periodo_fin',
        'valor_real',
        'comentarios',
    ];

    protected $casts = [
        'periodo_inicio' => 'date',
        'periodo_fin' => 'date',
        'valor_real' => 'decimal:2',
    ];

    public function empleado(): BelongsTo
    {
        return $this->belongsTo(Empleado::class, 'empleado_id');
    }

    public function definicionKpi(): BelongsTo
    {
        return $this->belongsTo(DefinicionKpi::class, 'definicion_kpi_id');
    }
}
