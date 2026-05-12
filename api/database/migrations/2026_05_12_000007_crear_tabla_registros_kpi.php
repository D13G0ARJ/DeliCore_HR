<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registros_kpi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empleado_id')->constrained('empleados')->cascadeOnDelete();
            $table->foreignId('definicion_kpi_id')->constrained('definiciones_kpi')->cascadeOnDelete();
            $table->date('periodo_inicio');
            $table->date('periodo_fin');
            $table->decimal('valor_real', 10, 2)->nullable();
            $table->text('comentarios')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registros_kpi');
    }
};
