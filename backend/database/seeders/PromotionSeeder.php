<?php

namespace Database\Seeders;

use App\Models\Promotion;
use Illuminate\Database\Seeder;

class PromotionSeeder extends Seeder
{
    public function run(): void
    {
        Promotion::create([
            'variant' => 'promo',
            'title' => 'Offre de lancement : -10% sur votre premier véhicule',
            'description' => 'Valable jusqu\'au 31 décembre 2024 pour toute réservation.',
            'badge' => 'Nouveau',
            'expires_at' => '2024-12-31 23:59:59',
            'cta_label' => 'Voir les véhicules',
            'cta_href' => '/catalogue',
            'priority' => 1,
            'active' => true,
        ]);

        Promotion::create([
            'variant' => 'shipping',
            'title' => 'Transport maritime offert vers Cotonou',
            'description' => 'Livraison incluse pour les 5 prochaines commandes.',
            'badge' => 'Édition limitée',
            'expires_at' => '2024-11-30 23:59:59',
            'cta_label' => 'En profiter',
            'cta_href' => '/contact?subject=Devis+v%C3%A9hicule',
            'priority' => 2,
            'active' => true,
        ]);

        Promotion::create([
            'variant' => 'info',
            'title' => 'Nouvelles procédures douanières Bénin 2024',
            'description' => 'Consultez notre guide mis à jour pour importer en toute sérénité.',
            'expires_at' => null,
            'cta_label' => 'Lire le guide',
            'cta_href' => '/guide-douane-benin',
            'priority' => 3,
            'active' => true,
        ]);
    }
}