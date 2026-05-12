<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seguimientos_kpi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empleado_id')->nullable()->constrained('empleados')->nullOnDelete();
            $table->foreignId('puesto_id')->constrained('puestos')->cascadeOnDelete();
            $table->foreignId('definicion_kpi_id')->nullable()->constrained('definiciones_kpi')->nullOnDelete();
            $table->string('titulo');
            $table->text('descripcion')->nullable();
            $table->string('frecuencia')->nullable();
            $table->date('fecha_seguimiento');
            $table->boolean('completado')->default(false);
            $table->decimal('valor_actual', 10, 2)->nullable();
            $table->decimal('meta_valor', 10, 2)->nullable();
            $table->string('unidad')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seguimientos_kpi');
    }
};
