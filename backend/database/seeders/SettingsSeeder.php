<?php

namespace Database\Seeders;

use App\Models\AdminSetting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'site_name' => 'AutoTrack Bénin',
            'site_about' => "Importation de véhicules chinois neufs et d'occasion certifiée, avec suivi maritime jusqu'au Port de Cotonou.",
            'email_contact' => 'mindsanni@gmail.com',
            'email_admin' => 'mindsanni@gmail.com',
            'support_phone' => '+229 97 00 00 00',
            'whatsapp_number' => '22997000000',
            'address' => 'Calavi / Abomey-Calavi, Bénin',
            'facebook_url' => 'https://facebook.com/easycar',
            'instagram_url' => '',
            'linkedin_url' => '',
            'phones' => [
                ['label' => 'Standard', 'value' => '+229 97 00 00 00'],
                ['label' => 'WhatsApp', 'value' => '+229 97 00 00 01'],
            ],
            'addresses' => [
                ['label' => 'Siège', 'value' => 'Calavi / Abomey-Calavi, Bénin'],
            ],
            'socials' => [
                ['platform' => 'Facebook', 'url' => 'https://facebook.com/easycar'],
                ['platform' => 'WhatsApp', 'url' => 'https://wa.me/22997000000'],
            ],
            'smtp_host' => '',
            'smtp_port' => '',
            'smtp_username' => '',
            'smtp_password' => '',
            'smtp_encryption' => '',
            'mail_from_address' => 'mindsanni@gmail.com',
            'mail_from_name' => 'AutoTrack Bénin',
        ];

        foreach ($settings as $key => $value) {
            AdminSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }
    }
}