<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('manuales_puesto', function (Blueprint $table) {
            $table->id();
            $table->foreignId('puesto_id')->nullable()->constrained('puestos')->nullOnDelete();
            $table->foreignId('departamento_id')->nullable()->constrained('departamentos')->nullOnDelete();
            $table->string('titulo');
            $table->longText('contenido');
            $table->string('archivo_origen')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('manuales_puesto');
    }
};
