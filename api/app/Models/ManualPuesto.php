<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ManualPuesto extends Model
{
    protected $table = 'manuales_puesto';

    protected $fillable = [
        'puesto_id',
        'departamento_id',
        'titulo',
        'contenido',
        'archivo_origen',
    ];

    public function puesto(): BelongsTo
    {
        return $this->belongsTo(Puesto::class, 'puesto_id');
    }

    public function departamento(): BelongsTo
    {
        return $this->belongsTo(Departamento::class, 'departamento_id');
    }
}
