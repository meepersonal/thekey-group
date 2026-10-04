<?php

namespace Database\Seeders;

use App\Models\Preorder;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $orders = [
            [
                'reference' => 'RES-2026-001',
                'client_name' => 'Koffi MENSAH',
                'phone' => '97 00 11 22',
                'dial' => '+229',
                'email' => 'koffi.mensah@example.bj',
                'city' => 'Cotonou',
                'status' => 'Acompte Versé',
                'container_code' => 'CONT-2026-BYD88',
                'options' => [
                    ['label' => 'Caméra 360°', 'price' => 150000],
                    ['label' => 'Chargeur rapide 7 kW', 'price' => 250000],
                ],
            ],
            [
                'reference' => 'RES-2026-002',
                'client_name' => 'Sègla DOSSOU',
                'phone' => '95 33 44 55',
                'dial' => '+229',
                'email' => 'segla.dossou@example.bj',
                'city' => 'Calavi',
                'status' => 'Prise en charge',
                'container_code' => 'CONT-2026-JET99',
                'options' => [
                    ['label' => 'Sièges cuir ventilés', 'price' => 400000],
                ],
            ],
            [
                'reference' => 'RES-2026-003',
                'client_name' => 'Adjovi SOGLO',
                'phone' => '96 12 78 90',
                'dial' => '+229',
                'email' => 'adjovi.soglo@example.bj',
                'city' => 'Porto-Novo',
                'status' => 'Nouvelle demande',
                'container_code' => null,
                'options' => [
                    ['label' => 'Teinte de vitres', 'price' => 150000],
                ],
            ],
            [
                'reference' => 'RES-2026-004',
                'client_name' => 'Sté Logibenin',
                'phone' => '94 55 66 77',
                'dial' => '+229',
                'email' => 'contact@logibenin.bj',
                'city' => 'Cotonou',
                'status' => 'Nouvelle demande',
                'container_code' => null,
                'options' => [],
            ],
            [
                'reference' => 'RES-2026-005',
                'client_name' => 'Rachidi DOSSOU',
                'phone' => '91 22 33 44',
                'dial' => '+229',
                'email' => 'rachidi.d@example.bj',
                'city' => 'Parakou',
                'status' => 'Annulée',
                'container_code' => null,
                'options' => [
                    ['label' => 'Jantes alliage 19″', 'price' => 620000],
                ],
            ],
        ];

        $vehicleMap = [
            'RES-2026-001' => 'byd-song-plus-ev',
            'RES-2026-002' => 'changan-uni-k',
            'RES-2026-003' => 'jetour-dashing',
            'RES-2026-004' => null,
            'RES-2026-005' => 'byd-seal',
        ];

        foreach ($orders as $o) {
            $vehicle = $o['reference'] && isset($vehicleMap[$o['reference']]) && $vehicleMap[$o['reference']]
                ? Vehicle::where('slug', $vehicleMap[$o['reference']])->first()
                : null;

            Preorder::updateOrCreate(
                ['reference' => $o['reference']],
                [
                    'vehicle_id' => $vehicle?->id,
                    'client_name' => $o['client_name'],
                    'phone' => $o['phone'],
                    'dial' => $o['dial'],
                    'email' => $o['email'],
                    'city' => $o['city'],
                    'notes' => null,
                    'base_price' => $vehicle?->price_fcfa ?? 0,
                    'options' => $o['options'],
                    'status' => $o['status'],
                    'container_code' => $o['container_code'],
                ]
            );
        }
    }
}