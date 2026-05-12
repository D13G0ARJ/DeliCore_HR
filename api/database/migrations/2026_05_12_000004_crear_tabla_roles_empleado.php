<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles_empleado', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empleado_id')->constrained('empleados')->cascadeOnDelete();
            $table->foreignId('puesto_id')->constrained('puestos')->cascadeOnDelete();
            $table->string('tipo_rol')->default('principal');
            $table->string('condicion')->default('permanente');
            $table->unsignedTinyInteger('porcentaje_tiempo')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('roles_empleado');
    }
};
