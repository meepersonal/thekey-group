<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS)
    |--------------------------------------------------------------------------
    |
    | Configuration Laravel (HandleCors). Un fichier de config doit TOUJOURS
    | retourner un tableau : retourner autre chose empêche le framework de
    | démarrer (LoadConfiguration -> array_merge()).
    |
    | Les origines sont explicites (pas de "*") car le front envoie
    | `credentials: "include"` : le navigateur exige alors
    | `Access-Control-Allow-Credentials: true` sur une origine précise.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_filter([
        // Dev
        'http://localhost:8081',
        'http://127.0.0.1:8081',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        // Production
        'https://api-key-group.geant.app',
    ])),

    // Couvre les sous-domaines de geant.app (front de production, etc.).
    'allowed_origins_patterns' => [
        '#^https://([a-z0-9-]+\.)*geant\.app$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 86400,

    'supports_credentials' => true,
];
