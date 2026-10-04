<?php

namespace Database\Seeders;

use App\Models\{Brand, Category, Vehicle, VehicleImage};
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $this->createBrands();
        $this->createCategories();
        $this->createVehicles();
    }

    private function createBrands(): void
    {
        $brands = [
            ['name' => 'BYD', 'origin' => 'Chine', 'is_active' => true, 'sort_order' => 1],
            ['name' => 'CHANGAN', 'origin' => 'Chine', 'is_active' => true, 'sort_order' => 2],
            ['name' => 'JETOUR', 'origin' => 'Chine', 'is_active' => true, 'sort_order' => 3],
            ['name' => 'GAC', 'origin' => 'Chine', 'is_active' => true, 'sort_order' => 4],
            ['name' => 'CHERY', 'origin' => 'Chine', 'is_active' => true, 'sort_order' => 5],
        ];
        foreach ($brands as $b) {
            Brand::firstOrCreate(['name' => $b['name']], $b);
        }
    }

    private function createCategories(): void
    {
        $categories = [
            ['name' => 'SUV', 'sort_order' => 1],
            ['name' => 'Berline', 'sort_order' => 2],
            ['name' => 'Utilitaire', 'sort_order' => 3],
            ['name' => 'Électrique', 'sort_order' => 4],
            ['name' => 'Hybride', 'sort_order' => 5],
            ['name' => 'Pick-up', 'sort_order' => 6],
        ];
        foreach ($categories as $c) {
            Category::firstOrCreate(['name' => $c['name']], $c);
        }
    }

    // private function createVehicles(): void
    // {
    //     $byd = Brand::where('name', 'BYD')->first();
    //     $changan = Brand::where('name', 'CHANGAN')->first();
    //     $jetour = Brand::where('name', 'JETOUR')->first();
    //     $gac = Brand::where('name', 'GAC')->first();
    //     $chery = Brand::where('name', 'CHERY')->first();

    //     $catSuv = Category::where('name', 'SUV')->first();
    //     $catBerline = Category::where('name', 'Berline')->first();
    //     $catUtilitaire = Category::where('name', 'Utilitaire')->first();
    //     $catElectrique = Category::where('name', 'Électrique')->first();
    //     $catHybride = Category::where('name', 'Hybride')->first();
    //     $catPickup = Category::where('name', 'Pick-up')->first();

    //     $vehicles = [
    //         [
    //             'brand_id' => $byd->id,
    //             'brand' => 'BYD',
    //             'category_id' => $catElectrique->id,
    //             'category' => 'Électrique',
    //             'model' => 'Song Plus EV',
    //             'condition' => 'Neuf',
    //             'year' => 2026,
    //             'mileage_km' => 0,
    //             'energy' => 'Essence',
    //             'transmission' => 'Automatique',
    //             'nombre_places' => 5,
    //             'engine' => 'Moteur électrique 150 kW',
    //             'consumption' => '15,4 kWh / 100 km',
    //             'price_fcfa' => 18500000,
    //             'badge' => 'Électrique',
    //             'status' => 'Disponible',
    //             'featured' => true,
    //             'highlights' => ['Autonomie 505 km', 'Charge rapide 80% en 35 min', 'Toit panoramique'],
    //             'image_files' => ['car-suv-white.jpg', 'car-sedan-blue.jpg', 'car-pickup-grey.jpg'],
    //         ],
    //         [
    //             'brand_id' => $changan->id,
    //             'brand' => 'CHANGAN',
    //             'category_id' => $catSuv->id,
    //             'category' => 'SUV',
    //             'model' => 'UNI-K',
    //             'condition' => 'Neuf',
    //             'year' => 2026,
    //             'mileage_km' => 0,
    //             'energy' => 'Essence',
    //             'transmission' => 'Automatique',
    //             'nombre_places' => 5,
    //             'engine' => '2.0 T GDI — 233 ch',
    //             'consumption' => '8,9 L / 100 km',
    //             'price_fcfa' => 21900000,
    //             'badge' => 'Disponible sur commande',
    //             'status' => 'Disponible',
    //             'featured' => true,
    //             'highlights' => ['4 roues motrices', 'Sièges cuir ventilés', 'Écran 12,3″'],
    //             'image_files' => ['car-suv-white.jpg', 'car-pickup-grey.jpg', 'car-sedan-blue.jpg'],
    //         ],
    //         [
    //             'brand_id' => $jetour->id,
    //             'brand' => 'JETOUR',
    //             'category_id' => $catSuv->id,
    //             'category' => 'SUV',
    //             'model' => 'Dashing',
    //             'condition' => 'Neuf',
    //             'year' => 2025,
    //             'mileage_km' => 0,
    //             'energy' => 'Essence',
    //             'transmission' => 'Automatique',
    //             'nombre_places' => 5,
    //             'engine' => '1.6 T — 197 ch',
    //             'consumption' => '7,4 L / 100 km',
    //             'price_fcfa' => 15400000,
    //             'badge' => 'Best-seller',
    //             'status' => 'Disponible',
    //             'featured' => false,
    //             'highlights' => ['Design sport', 'Caméra de recul', 'Apple CarPlay'],
    //             'image_files' => ['car-suv-white.jpg', 'car-sedan-blue.jpg'],
    //         ],
    //         [
    //             'brand_id' => $gac->id,
    //             'brand' => 'GAC',
    //             'category_id' => $catBerline->id,
    //             'category' => 'Berline',
    //             'model' => 'Empow GS',
    //             'condition' => 'Neuf',
    //             'year' => 2026,
    //             'mileage_km' => 0,
    //             'energy' => 'Essence',
    //             'transmission' => 'Automatique',
    //             'nombre_places' => 5,
    //             'engine' => '1.5 T — 177 ch',
    //             'consumption' => '6,8 L / 100 km',
    //             'price_fcfa' => 12800000,
    //             'badge' => null,
    //             'status' => 'Disponible',
    //             'featured' => false,
    //             'highlights' => ['Mode sport', 'Sono 8 haut-parleurs', 'Régulateur adaptatif'],
    //             'image_files' => ['car-sedan-blue.jpg', 'car-suv-white.jpg'],
    //         ],
    //         [
    //             'brand_id' => $chery->id,
    //             'brand' => 'CHERY',
    //             'category_id' => $catSuv->id,
    //             'category' => 'SUV',
    //             'model' => 'Tiggo 8 Pro',
    //             'condition' => 'Occasion certifiée',
    //             'year' => 2024,
    //             'mileage_km' => 18500,
    //             'energy' => 'Hybride',
    //             'transmission' => 'Automatique',
    //             'nombre_places' => 7,
    //             'engine' => '1.6 T Hybride — 245 ch',
    //             'consumption' => '7,9 L / 100 km',
    //             'price_fcfa' => 13200000,
    //             'badge' => 'Inspectée 150 points',
    //             'status' => 'Disponible',
    //             'featured' => false,
    //             'highlights' => ['7 places', 'Toit ouvrant', 'Historique vérifié'],
    //             'image_files' => ['car-suv-white.jpg', 'car-pickup-grey.jpg'],
    //         ],
    //         [
    //             'brand_id' => $byd->id,
    //             'brand' => 'BYD',
    //             'category_id' => $catBerline->id,
    //             'category' => 'Berline',
    //             'model' => 'Seal',
    //             'condition' => 'Neuf',
    //             'year' => 2026,
    //             'mileage_km' => 0,
    //             'energy' => 'Essence',
    //             'transmission' => 'Automatique',
    //             'nombre_places' => 5,
    //             'engine' => 'Moteur électrique 230 kW',
    //             'consumption' => '16,2 kWh / 100 km',
    //             'price_fcfa' => 24500000,
    //             'badge' => 'Électrique',
    //             'status' => 'Disponible',
    //             'featured' => true,
    //             'highlights' => ['0-100 km/h en 3,8 s', 'Suspension pilotée', 'Autonomie 570 km'],
    //             'image_files' => ['car-sedan-blue.jpg', 'car-suv-white.jpg'],
    //         ],
    //         [
    //             'brand_id' => $changan->id,
    //             'brand' => 'CHANGAN',
    //             'category_id' => $catPickup->id,
    //             'category' => 'Pick-up',
    //             'model' => 'Hunter Pick-up',
    //             'condition' => 'Neuf',
    //             'year' => 2025,
    //             'mileage_km' => 0,
    //             'energy' => 'Diesel',
    //             'transmission' => 'Automatique',
    //             'nombre_places' => 5,
    //             'engine' => '2.0 TD — 190 ch',
    //             'consumption' => '8,6 L / 100 km',
    //             'price_fcfa' => 17900000,
    //             'badge' => 'Robuste',
    //             'status' => 'Disponible',
    //             'featured' => false,
    //             'highlights' => ['Charge utile 1 t', '4x4 enclenchable', 'Benne renforcée'],
    //             'image_files' => ['car-pickup-grey.jpg', 'car-suv-white.jpg'],
    //         ],
    //         [
    //             'brand_id' => $gac->id,
    //             'brand' => 'GAC',
    //             'category_id' => $catUtilitaire->id,
    //             'category' => 'Utilitaire',
    //             'model' => 'M8 Utilitaire',
    //             'condition' => 'Neuf',
    //             'year' => 2025,
    //             'mileage_km' => 0,
    //             'energy' => 'Hybride',
    //             'transmission' => 'Automatique',
    //             'nombre_places' => 8,
    //             'engine' => '2.0 T Hybride — 245 ch',
    //             'consumption' => '5,9 L / 100 km',
    //             'price_fcfa' => 26900000,
    //             'badge' => 'Hybride',
    //             'status' => 'Disponible',
    //             'featured' => true,
    //             'highlights' => ['8 places modulables', 'Portes coulissantes électriques', 'Confort VIP'],
    //             'image_files' => ['car-pickup-grey.jpg', 'car-sedan-blue.jpg'],
    //         ],
    //         [
    //             'brand_id' => $chery->id,
    //             'brand' => 'CHERY',
    //             'category_id' => $catHybride->id,
    //             'category' => 'Hybride',
    //             'model' => 'Arrizo 8 Hybride',
    //             'condition' => 'Occasion certifiée',
    //             'year' => 2024,
    //             'mileage_km' => 9800,
    //             'energy' => 'Hybride',
    //             'transmission' => 'Automatique',
    //             'nombre_places' => 5,
    //             'engine' => '1.5 T Hybride — 204 ch',
    //             'consumption' => '4,7 L / 100 km',
    //             'price_fcfa' => 11500000,
    //             'badge' => null,
    //             'status' => 'Disponible',
    //             'featured' => false,
    //             'highlights' => ['Très faible consommation', 'Garantie 12 mois', 'Faible kilométrage'],
    //             'image_files' => ['car-sedan-blue.jpg', 'car-pickup-grey.jpg'],
    //         ],
    //     ];

    //     foreach ($vehicles as $data) {
    //         $slug = Vehicle::makeSlug($data['brand'], $data['model']);
    //         $vehicle = Vehicle::updateOrCreate(
    //             ['slug' => $slug],
    //             [
    //                 'brand_id' => $data['brand_id'],
    //                 'brand' => $data['brand'],
    //                 'category_id' => $data['category_id'],
    //                 'category' => $data['category'],
    //                 'model' => $data['model'],
    //                 'condition' => $data['condition'],
    //                 'year' => $data['year'],
    //                 'mileage_km' => $data['mileage_km'],
    //                 'energy' => $data['energy'],
    //                 'transmission' => $data['transmission'],
    //                 'nombre_places' => $data['nombre_places'],
    //                 'engine' => $data['engine'],
    //                 'consumption' => $data['consumption'],
    //                 'price_fcfa' => $data['price_fcfa'],
    //                 'badge' => $data['badge'],
    //                 'status' => $data['status'],
    //                 'featured' => $data['featured'],
    //                 'highlights' => $data['highlights'],
    //                 'description' => null,
    //             ]
    //         );

    //         // Only create image records for new vehicles
    //         if ($vehicle->wasRecentlyCreated) {
    //             foreach ($data['image_files'] as $filename) {
    //                 VehicleImage::create([
    //                     'vehicle_id' => $vehicle->id,
    //                     'image' => 'media/vehicles/' . $filename,
    //                     'uploaded_at' => now(),
    //                 ]);
    //             }
    //         }
    //     }
    // }
}
