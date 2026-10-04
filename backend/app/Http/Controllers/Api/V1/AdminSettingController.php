<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AdminSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminSettingController extends Controller
{
    /** Clés exposées publiquement (aucune donnée sensible : ni SMTP, ni e-mail admin). */
    private const PUBLIC_KEYS = [
        'site_name',
        'site_about',
        'site_logo',
        'site_favicon',
        'email_contact',
        'support_phone',
        'whatsapp_number',
        'phones',
        'addresses',
        'socials',
        'facebook_url',
        'instagram_url',
        'linkedin_url',
    ];

    public function index(): JsonResponse
    {
        $settings = AdminSetting::all()->mapWithKeys(function ($item) {
            return [$item->key => $item->value];
        })->toArray();

        return response()->json(['data' => $settings]);
    }

    /** Réglages nécessaires à l'affichage du site public (logo, nom, coordonnées). */
    public function publicIndex(): JsonResponse
    {
        $data = [];
        foreach (self::PUBLIC_KEYS as $key) {
            $data[$key] = AdminSetting::get($key);
        }

        return response()->json(['data' => $data]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'site_name' => 'sometimes|string|max:150',
            'site_about' => 'sometimes|string',
            'site_logo' => 'sometimes|nullable|string|max:500',
            'site_favicon' => 'sometimes|nullable|string|max:500',
            'email_contact' => 'sometimes|email|max:150',
            'phones' => 'sometimes|array',
            'phones.*.label' => 'sometimes|string|max:100',
            'phones.*.value' => 'sometimes|string|max:100',
            'addresses' => 'sometimes|array',
            'addresses.*.label' => 'sometimes|string|max:100',
            'addresses.*.value' => 'sometimes|string|max:255',
            'socials' => 'sometimes|array',
            'socials.*.platform' => 'sometimes|string|max:50',
            'socials.*.url' => 'sometimes|string|max:255',
        ]);

        foreach ($validated as $key => $value) {
            AdminSetting::set($key, $value);
        }

        return response()->json(['data' => $validated]);
    }
}
