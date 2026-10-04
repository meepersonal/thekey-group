<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'mindsanni@gmail.com'],
            [
                'name' => 'Junior SANNI',
                'password' => Hash::make('AutoTrack2026!'),
                'is_admin' => true,
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@autotrack.bj'],
            [
                'name' => 'Administrateur',
                'password' => Hash::make('AutoTrack2026!'),
                'is_admin' => true,
                'role' => 'admin',
            ]
        );
    }
}