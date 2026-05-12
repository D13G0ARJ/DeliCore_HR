<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('empleados', function (Blueprint $table) {
            $table->id();
            $table->foreignId('puesto_principal_id')->nullable()->constrained('puestos')->nullOnDelete();
            $table->foreignId('supervisor_inmediato_id')->nullable()->constrained('empleados')->nullOnDelete();
            $table->string('nombre_completo');
            $table->string('correo')->nullable();
            $table->string('antiguedad_texto')->nullable();
            $table->date('fecha_ingreso')->nullable();
            $table->string('estado')->default('activo');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('empleados');
    }
};
