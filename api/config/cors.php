<?php

$allowedOriginsEnv = env('CORS_ALLOWED_ORIGINS');

return [
    'paths' => ['api/*', 'up'],
    'allowed_methods' => ['*'],
    'allowed_origins' => $allowedOriginsEnv
        ? array_values(array_filter(array_map('trim', explode(',', $allowedOriginsEnv))))
        : ['http://127.0.0.1:5173', 'http://localhost:5173'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
