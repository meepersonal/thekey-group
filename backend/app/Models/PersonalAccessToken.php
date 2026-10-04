<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

/**
 * La table `personal_access_tokens` utilise une clé primaire uuid (cf. la
 * migration create_personal_access_tokens_table), alors que le modèle fourni
 * par Sanctum laisse l'identifiant à l'auto-incrément de MySQL.
 * Sans HasUuids, l'INSERT omet `id` et MySQL répond
 * « 1364 Field 'id' doesn't have a default value ».
 *
 * Modèle déclaré via Sanctum::usePersonalAccessTokenModel() dans
 * AppServiceProvider::boot().
 */
class PersonalAccessToken extends SanctumPersonalAccessToken
{
    use HasUuids;
}
