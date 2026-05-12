<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'mensaje' => 'API Laravel operativa',
        'documentacion' => [
            '/api/salud',
            '/api/panel-general',
        ],
    ]);
});
