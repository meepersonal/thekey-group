<?php

namespace App\Support;

use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;

class Media
{
    private static ?Filesystem $disk = null;

    /**
     * Disque des médiasUploadés.
     *
     * La racine est définie ici et non dans config/filesystems.php : le disque
     * est construit à la volée, donc un cache de configuration resté sur
     * l'ancienne valeur (storage/app/public) ne peut plus faire écrire les
     * fichiers au mauvais endroit. Les médias vivent dans public/storage/, à
     * l'intérieur de la racine web, et sont servis en statique sur /storage/...
     * sans dépendre du lien symbolique public/storage.
     */
    public static function disk(): Filesystem
    {
        return self::$disk ??= Storage::build([
            'driver' => 'local',
            'root' => public_path('storage'),
            'url' => rtrim(config('app.url'), '/').'/storage',
            'visibility' => 'public',
            'throw' => false,
        ]);
    }

    /**
     * URL publique d'un fichier stocké sur le disque des médias.
     * Le chemin est relatif au disque (ex. `media/vehicles/photo.jpg`).
     */
    public static function url(string $path): string
    {
        $path = ltrim($path, '/');

        return config('media.via_route')
            ? url('/api/v1/media/' . $path)
            : rtrim(config('app.url'), '/').'/storage/'.$path;
    }

    /** Chemin relatif à l'URL, pour l'inverse de self::url(). */
    public static function pathFromUrl(?string $url): ?string
    {
        if (! $url) {
            return null;
        }

        $marker = '/storage/';
        $position = strpos($url, $marker);

        return $position === false ? null : substr($url, $position + strlen($marker));
    }

    /**
     * Déplace vers public/storage/ les médias laissés dans l'ancien
     * emplacement storage/app/public par une version antérieure du code.
     * Renvoie le nombre de fichiers déplacés.
     */
    public static function migrateLegacyFiles(): int
    {
        $legacyRoot = storage_path('app/public');
        $target = self::disk();

        if (! is_dir($legacyRoot)) {
            return 0;
        }

        $moved = 0;
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($legacyRoot, \FilesystemIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::SELF_FIRST,
        );

        foreach ($iterator as $item) {
            $relative = ltrim(substr($item->getPathname(), strlen($legacyRoot)), '/');
            if ($item->isDir()) {
                $target->makeDirectory($relative);
                continue;
            }
            if ($target->exists($relative)) {
                continue;
            }
            $target->put($relative, file_get_contents($item->getPathname()));
            @unlink($item->getPathname());
            $moved++;
        }

        return $moved;
    }
}