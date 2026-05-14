<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SeguimientoKpi extends Model
{
    protected $table = 'seguimientos_kpi';

    protected $fillable = [
        'empleado_id',
        'puesto_id',
        'definicion_kpi_id',
        'titulo',
        'descripcion',
        'frecuencia',
        'fecha_seguimiento',
        'completado',
        'valor_actual',
        'meta_valor',
        'unidad',
        'justificacion_respuesta',
    ];

    protected $casts = [
        'fecha_seguimiento' => 'date',
        'completado' => 'boolean',
        'valor_actual' => 'decimal:2',
        'meta_valor' => 'decimal:2',
    ];

    public function empleado(): BelongsTo
    {
        return $this->belongsTo(Empleado::class, 'empleado_id');
    }

    public function puesto(): BelongsTo
    {
        return $this->belongsTo(Puesto::class, 'puesto_id');
    }

    public function definicionKpi(): BelongsTo
    {
        return $this->belongsTo(DefinicionKpi::class, 'definicion_kpi_id');
    }
}
