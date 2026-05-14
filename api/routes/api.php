<?php

use App\Http\Controllers\Api\ControladorAsistenteIaRol;
use App\Http\Controllers\Api\ControladorAccesoDemo;
use App\Http\Controllers\Api\ControladorCentroKpis;
use App\Http\Controllers\Api\ControladorDirectorioEmpleados;
use App\Http\Controllers\Api\ControladorGestionUsuarios;
use App\Http\Controllers\Api\ControladorOrganigrama;
use App\Http\Controllers\Api\ControladorPanelGeneral;
use App\Http\Controllers\Api\ControladorPerfilTalento;
use Illuminate\Support\Facades\Route;

Route::get('/salud', function () {
    return response()->json([
        'mensaje' => 'API operativa',
        'proyecto' => 'Sistema integral de roles y desempeno',
    ]);
});

Route::get('/acceso-demo', [ControladorAccesoDemo::class, 'mostrar']);
Route::get('/panel-general', [ControladorPanelGeneral::class, 'mostrar']);
Route::get('/organigrama', [ControladorOrganigrama::class, 'mostrar']);
Route::get('/directorio-empleados', [ControladorDirectorioEmpleados::class, 'mostrar']);
Route::get('/perfil-talento', [ControladorPerfilTalento::class, 'mostrar']);
Route::get('/gestion-usuarios', [ControladorGestionUsuarios::class, 'mostrar']);
Route::post('/gestion-usuarios/empleados', [ControladorGestionUsuarios::class, 'crearEmpleado']);
Route::patch('/gestion-usuarios/empleados/{empleado}', [ControladorGestionUsuarios::class, 'actualizarEmpleado']);
Route::get('/centro-kpis', [ControladorCentroKpis::class, 'mostrar']);
Route::post('/centro-kpis/definiciones', [ControladorCentroKpis::class, 'crearDefinicion']);
Route::patch('/centro-kpis/seguimientos/{seguimiento}', [ControladorCentroKpis::class, 'actualizarSeguimiento']);
Route::get('/asistente-ia-rol', [ControladorAsistenteIaRol::class, 'mostrar']);
Route::post('/asistente-ia-rol/consultar', [ControladorAsistenteIaRol::class, 'consultar']);
