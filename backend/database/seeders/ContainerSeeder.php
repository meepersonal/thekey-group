<?php

namespace Database\Seeders;

use App\Models\Container;
use Illuminate\Database\Seeder;

class ContainerSeeder extends Seeder
{
    public function run(): void
    {
        $containers = [
            [
                'code' => 'CONT-2026-BYD88',
                'vessel' => 'MSC ANTONIA',
                'carrier' => 'MSC',
                'port_depart' => 'Shanghai',
                'port_arrivee' => 'Cotonou, Bénin',
                'departure_date' => '2026-08-12',
                'eta' => '2026-09-25',
                'stage' => 3,
                'client' => 'Koffi MENSAH',
                'note' => 'Position actuelle : Golfe de Guinée',
            ],
            [
                'code' => 'CONT-2026-JET99',
                'vessel' => 'CMA CGM BENIN',
                'carrier' => 'CMA CGM',
                'port_depart' => 'Ningbo',
                'port_arrivee' => 'Cotonou, Bénin',
                'departure_date' => '2026-07-02',
                'eta' => '2026-09-12',
                'stage' => 5,
                'client' => 'Sègla DOSSOU',
                'note' => 'Dédouanement en cours au Port de Cotonou',
            ],
            [
                'code' => 'CONT-2026-GAC42',
                'vessel' => 'OOCL LAGOS',
                'carrier' => 'OOCL',
                'port_depart' => 'Guangzhou',
                'port_arrivee' => 'Cotonou, Bénin',
                'departure_date' => '2026-10-18',
                'eta' => '2026-10-18',
                'stage' => 2,
                'client' => 'Sté Logibenin',
                'note' => 'Chargement prévu ce vendredi',
            ],
        ];

        foreach ($containers as $c) {
            Container::updateOrCreate(['code' => $c['code']], $c);
        }
    }
}