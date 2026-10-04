<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Service des médias du disque `public`
    |--------------------------------------------------------------------------
    |
    | Les uploads sont toujours écrits dans `public/storage/` (cf.
    | config/filesystems.php), jamais dans storage/app/public.
    |
    | true (défaut) : les fichiers sont streamés par Laravel via
    |         /api/v1/media/{chemin}. Fonctionne même quand le serveur web
    |         refuse de lire /storage (403 observés sur l'hôte de production).
    |         Coût : une requête PHP par image, mise en cache 1 an.
    |
    | false : les URL pointent vers /storage et sont servies statiquement par le
    |         serveur web. Plus rapide, mais exige que le serveur web puisse lire
    |         public/storage (droits + absence de règle de refus).
    |
    */

    'via_route' => env('MEDIA_VIA_ROUTE', true),
];