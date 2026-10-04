<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\StreamedResponse;
use App\Support\Media;

class MediaController extends Controller
{
    /**
     * Sert un fichier du disque `public` (logo, favicon, photos de véhicules).
     *
     * Le disque `public` est hors de la racine web : sans cette route, tout le
     * contenu `/storage/...` dépend du lien symbolique `public/storage`, qui
     * renvoie un 403 sur l'hôte de production. Les noms de fichiers étant
     * générés aléatoirement, la réponse est mise en cache immuablement.
     */
    public function show(string $path): StreamedResponse
    {
        $path = ltrim($path, '/');

        if ($path === '' || preg_match('#(^|/)\.\.?(/|$)#', $path)) {
            abort(404);
        }

        $disk = Media::disk();

        if ($disk->missing($path)) {
            abort(404);
        }

        return $disk->response($path, null, [
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ]);
    }
}