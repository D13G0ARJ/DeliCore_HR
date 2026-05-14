<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('definiciones_kpi', function (Blueprint $table) {
            $table->foreignId('empleado_id')
                ->nullable()
                ->after('puesto_id')
                ->constrained('empleados')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('definiciones_kpi', function (Blueprint $table) {
            $table->dropConstrainedForeignId('empleado_id');
        });
    }
};
