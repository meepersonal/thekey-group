<?php

namespace App\Console\Commands;

use App\Support\Media;
use Illuminate\Console\Command;


class MediaCheckCommand extends Command
{
    protected $signature = 'media:check {file? : Un fichier relatif, ex. media/logo.png}';

    protected $description = "Diagnostique le service des médias : racine, permissions et URL";

    public function handle(): int
    {
        $root = Media::disk()->path('');
        $ok = true;

        $this->line('<info>Emplacement des uploads</info>');
        $this->line('  racine           : '.$root);
        $this->line('  via API          : '.(config('media.via_route') ? 'oui (/api/v1/media)' : 'non (/storage)'));
        $this->line('  dossier présent : '.(is_dir($root) ? 'oui' : 'NON — créez-le'));
        $this->line('  inscriptible     : '.(is_dir($root) && is_writable($root) ? 'oui' : 'NON — PHP ne peut pas écrire'));
        $this->line('  lisible          : '.(is_dir($root) && is_readable($root) ? 'oui' : 'NON'));
        $this->line('  fichier legacy   : '.(is_dir(storage_path('app/public')) ? storage_path('app/public').' (lancez media:migrate)' : 'aucun'));

        $files = $this->files();
        $this->line('');
        $this->line('<info>Fichiers</info>');
        $this->line('  nombre           : '.count($files));

        if ($file = $this->argument('file')) {
            $file = ltrim((string) $file, '/');
            $exists = Media::disk()->exists($file);
            $this->line('  '.$file.' : '.($exists ? 'trouvé' : 'INTROUVABLE'));
            $this->line('  URL              : '.Media::url($file));

            if ($exists) {
                $this->line('');
                $this->line('<info>Test HTTP</info>');
                $this->line('  '.Media::url($file));
            }
            $ok = $exists;
        }

        foreach (array_slice($files, 0, 3) as $sample) {
            $this->line('  exemple : '.Media::url($sample));
        }

        return $ok ? self::SUCCESS : self::FAILURE;
    }

    private function files(): array
    {
        $root = Media::disk()->path('');

        if (! is_dir($root)) {
            return [];
        }

        $found = [];
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($root, \FilesystemIterator::SKIP_DOTS),
        );

        foreach ($iterator as $item) {
            if ($item->isFile()) {
                $found[] = ltrim(substr($item->getPathname(), strlen($root)), '/');
            }
        }

        return $found;
    }
}