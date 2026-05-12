<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('puestos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('departamento_id')->constrained('departamentos')->cascadeOnDelete();
            $table->foreignId('puesto_supervisor_id')->nullable()->constrained('puestos')->nullOnDelete();
            $table->string('nombre');
            $table->string('nivel')->nullable();
            $table->text('proposito')->nullable();
            $table->boolean('es_activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('puestos');
    }
};
