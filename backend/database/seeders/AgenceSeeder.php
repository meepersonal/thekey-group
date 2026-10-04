<?php

namespace Database\Seeders;

use App\Models\Agence;
use Illuminate\Database\Seeder;

class AgenceSeeder extends Seeder
{
    public function run(): void
    {
        $agences = [
            [
                'name' => 'Agence de Cotonou',
                'location' => 'Boulevard de la Marina, Cotonou',
                'map_url' => 'https://maps.google.com/?q=Cotonou',
                'phone' => '+229 97 00 00 00',
                'hours' => 'Lun – Sam : 8h00 – 19h00',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Agence de Calavi',
                'location' => 'Route de Calavi, Abomey-Calavi',
                'map_url' => 'https://maps.google.com/?q=Calavi',
                'phone' => '+229 97 00 00 01',
                'hours' => 'Lun – Ven : 8h00 – 18h00',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Agence de Paris',
                'location' => '42 rue de la Roquette, Paris',
                'map_url' => 'https://maps.google.com/?q=Paris',
                'phone' => '+33 1 23 45 67 89',
                'hours' => 'Lun–Sam : 9h–19h',
                'is_active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($agences as $a) {
            Agence::firstOrCreate(['name' => $a['name']], $a);
        }
    }
}
