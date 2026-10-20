<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Illuminate\Http\JsonResponse;

class PromotionController extends Controller
{
    public function active(): JsonResponse
    {
        $promotions = Promotion::query()
            ->where('active', true)
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->orderBy('priority')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'variant' => $p->variant,
                'title' => $p->title,
                'description' => $p->description,
                'badge' => $p->badge,
                'expiresAt' => $p->expires_at?->toIso8601String(),
                'ctaLabel' => $p->cta_label,
                'ctaHref' => $p->cta_href,
                'priority' => $p->priority,
                'active' => $p->active,
            ]);

        return response()->json(['data' => $promotions]);
    }
}