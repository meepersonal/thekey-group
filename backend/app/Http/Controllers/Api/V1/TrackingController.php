<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Container;
use App\Models\Preorder;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TrackingController extends Controller
{
    /**
     * Suivi public d'une commande.
     *
     * Référence acceptée (dans l'ordre) :
     *  - référence de précommande  : RES-2026-007
     *  - code de rendez-vous       : MW94
     *  - code de conteneur         : CONT-2026-BYD88 (compatibilité)
     */
    public function show(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:60',
        ]);

        $code = trim($validated['code']);

        $preorder = Preorder::query()
            ->where('reference', $code)
            ->orWhere('appointment_code', $code)
            ->first();

        if ($preorder) {
            $vehicle = Vehicle::with('images')->find($preorder->vehicle_id);
            $container = $preorder->container_code
                ? Container::with('events')->where('code', $preorder->container_code)->first()
                : null;

            return response()->json([
                'data' => [
                    'lookup' => $preorder->appointment_code === $code ? 'appointment_code' : 'reference',
                    'preorder' => [
                        'reference' => $preorder->reference,
                        'appointment_code' => $preorder->appointment_code,
                        'status' => $preorder->status,
                        'created_at' => $preorder->created_at?->toIso8601String(),
                    ],
                    'vehicle' => $vehicle ? [
                        'id' => $vehicle->id,
                        'brand' => $vehicle->brand,
                        'model' => $vehicle->model,
                        'slug' => $vehicle->slug,
                        'year' => (int) $vehicle->year,
                        'mileage_km' => (int) $vehicle->mileage_km,
                        'nombre_places' => (int) $vehicle->nombre_places,
                        'condition' => $vehicle->condition,
                        'energy' => $vehicle->energy,
                        'transmission' => $vehicle->transmission,
                        'image' => $vehicle->images->first()?->url,
                    ] : null,
                    'container' => $container ? $this->containerPayload($container) : null,
                    'events' => $this->eventsPayload($container),
                ],
            ]);
        }

        $container = Container::with('events')->where('code', $code)->first();

        if (! $container) {
            return response()->json([
                'message' => "Aucune commande ni aucun conteneur ne correspond à « {$code} ».",
                'code' => $code,
            ], 404);
        }

        return response()->json([
            'data' => [
                'lookup' => 'container_code',
                'preorder' => null,
                'vehicle' => null,
                'container' => $this->containerPayload($container),
                'events' => $this->eventsPayload($container),
            ],
        ]);
    }

    private function containerPayload(Container $container): array
    {
        return [
            'code' => $container->code,
            'vessel' => $container->vessel,
            'carrier' => $container->carrier,
            'port_depart' => $container->port_depart,
            'port_arrivee' => $container->port_arrivee,
            'departure_date' => $container->departure_date,
            'eta' => $container->eta,
            'stage' => (int) $container->stage,
            'stage_label' => Container::STAGES[(int) $container->stage] ?? 'Étape inconnue',
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function eventsPayload(?Container $container): array
    {
        if (! $container) {
            return [];
        }

        return $container->events
            ->sortBy(fn ($event) => [$event->event_date?->toDateString() ?? '', $event->id])
            ->map(fn ($event) => [
                'stage' => (int) $event->stage,
                'stage_label' => Container::STAGES[(int) $event->stage] ?? 'Étape inconnue',
                'event_date' => $event->event_date?->toDateString(),
                'location' => $event->location,
                'comments' => $event->comments,
            ])
            ->values()
            ->all();
    }
}
