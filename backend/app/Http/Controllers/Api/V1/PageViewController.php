<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\VehiclePageView;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PageViewController extends Controller
{
    private const MAX_DURATION = 3600;

    public function store(Request $request, Vehicle $vehicle): JsonResponse
    {
        $validated = $request->validate([
            'view_token' => 'required|string|max:64',
            'visitor_id' => 'required|string|max:64',
            'duration_seconds' => 'nullable|integer|min:0|max:' . self::MAX_DURATION,
            'clicks' => 'nullable|integer|min:0|max:500',
        ]);

        $refererHost = null;
        if ($ref = $request->headers->get('referer')) {
            $refererHost = parse_url($ref, PHP_URL_HOST) ?: null;
        }

        $view = VehiclePageView::updateOrCreate(
            ['view_token' => $validated['view_token']],
            [
                'vehicle_id' => $vehicle->id,
                'visitor_hash' => $this->visitorHash($validated['visitor_id']),
                'duration_seconds' => min(
                    (int) ($validated['duration_seconds'] ?? 0),
                    self::MAX_DURATION
                ),
                'clicks' => (int) ($validated['clicks'] ?? 0),
                'referer_host' => $refererHost,
                'viewed_at' => now(),
            ]
        );

        return response()->json(['data' => $view->toArrayForApi()], 201);
    }

    /**
     * Hachage salé journalier : identifie un visiteur pour la journée sans
     * stocker d'IP ni de donnée personnelle, et ne permet pas de le suivre
     * au-delà de 24 h.
     */
    private function visitorHash(string $visitorId): string
    {
        return hash_hmac('sha256', $visitorId . now()->toDateString(), (string) config('app.key'));
    }
}
