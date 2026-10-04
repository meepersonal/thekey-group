<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            VehicleSeeder::class,
            OptionSeeder::class,
            OrderSeeder::class,
            ContainerSeeder::class,
            AgenceSeeder::class,
            AdminUserSeeder::class,
            SettingsSeeder::class,
        ]);
    }
}