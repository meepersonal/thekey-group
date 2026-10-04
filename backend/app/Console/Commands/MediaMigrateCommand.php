<?php

namespace App\Console\Commands;

use App\Support\Media;
use Illuminate\Console\Command;

class MediaMigrateCommand extends Command
{
    protected $signature = 'media:migrate';

    protected $description = 'Déplace les médias de storage/app/public vers public/storage (nouvel emplacement des uploads)';

    public function handle(): int
    {
        $target = Media::disk();
        $target->makeDirectory('media');

        $moved = Media::migrateLegacyFiles();

        $this->info("Emplacement des médias : {$target->path('')}");
        $this->info($moved === 0
            ? 'Aucun fichier à déplacer.'
            : "{$moved} fichier(s) déplacé(s) vers public/storage.");

        return self::SUCCESS;
    }
}