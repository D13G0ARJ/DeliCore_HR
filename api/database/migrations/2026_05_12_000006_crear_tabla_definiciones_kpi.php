<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('definiciones_kpi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('puesto_id')->constrained('puestos')->cascadeOnDelete();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->string('formula')->nullable();
            $table->string('frecuencia')->nullable();
            $table->decimal('meta_valor', 10, 2)->nullable();
            $table->string('unidad')->nullable();
            $table->string('origen')->default('ia_sugerida');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('definiciones_kpi');
    }
};
