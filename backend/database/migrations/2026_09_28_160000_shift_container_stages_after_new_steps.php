<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Deux étapes ont été ajoutées en tête de liste (Commande effectuée depuis la Chine,
     * Démarrage du bateau depuis la Chine) : on décale les étapes existantes de 2.
     */
    public function up(): void
    {
        DB::table('containers')->update(['stage' => DB::raw('stage + 2')]);
        DB::table('container_events')->update(['stage' => DB::raw('stage + 2')]);
    }

    public function down(): void
    {
        DB::table('containers')->update(['stage' => DB::raw('GREATEST(stage - 2, 0)')]);
        DB::table('container_events')->update(['stage' => DB::raw('GREATEST(stage - 2, 0)')]);
    }
};
