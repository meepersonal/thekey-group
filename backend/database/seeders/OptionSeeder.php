<?php

namespace Database\Seeders;

use App\Models\Vehicle;
use App\Models\VehicleOption;
use Illuminate\Database\Seeder;

class OptionSeeder extends Seeder
{
    public function run(): void
    {
        $options = [
            'byd-song-plus-ev' => [
                ['label' => 'Caméra 360°', 'price' => 150000, 'option_key' => 'cam360'],
                ['label' => 'Chargeur rapide 7 kW', 'price' => 250000, 'option_key' => 'chargeur'],
            ],
            'changan-uni-k' => [
                ['label' => 'Sièges cuir ventilés', 'price' => 400000, 'option_key' => 'sieges'],
            ],
            'jetour-dashing' => [
                ['label' => 'Teinte de vitres', 'price' => 150000, 'option_key' => 'vitres'],
            ],
            'chery-tiggo-8-pro' => [
                ['label' => 'Barres de toit', 'price' => 120000, 'option_key' => 'barres'],
            ],
            'byd-seal' => [
                ['label' => 'Jantes alliage 19″', 'price' => 620000, 'option_key' => 'jantes'],
            ],
        ];

        foreach ($options as $slug => $opts) {
            $vehicle = Vehicle::where('slug', $slug)->first();
            if (!$vehicle) {
                continue;
            }
            foreach ($opts as $o) {
                VehicleOption::firstOrCreate(
                    ['vehicle_id' => $vehicle->id, 'option_key' => $o['option_key']],
                    [
                        'label' => $o['label'],
                        'price' => $o['price'],
                    ]
                );
            }
        }
    }
}