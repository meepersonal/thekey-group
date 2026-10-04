<?php

namespace App\Providers;

use App\Models\PersonalAccessToken;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Les clés du projet sont des uuid : le modèle de token doit en générer un,
        // sinon l'authentification Sanctum échoue à l'insertion.
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
    }
}
