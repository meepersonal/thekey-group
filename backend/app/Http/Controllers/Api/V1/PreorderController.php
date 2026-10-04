<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Mail\AppointmentRequestMail;
use App\Models\Preorder;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PreorderController extends Controller
{
    public const OPENING_HOURS_START = '09:00';
    public const OPENING_HOURS_END = '19:00';

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|string|exists:vehicles,id',
            'name' => 'required|string|max:255',
            'full_name' => 'nullable|string|max:255',
            'phone' => 'required|string|max:30',
            'dial' => 'nullable|string|max:10',
            'email' => 'nullable|email|max:255',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'appointment_date' => 'nullable|date',
            'appointment_time' => [
                'nullable',
                'string',
                'max:10',
                'regex:/^([01]\d|2[0-3]):[0-5]\d$/',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (! $this->isWithinOpeningHours((string) $value)) {
                        $fail("Le créneau doit être compris entre ".self::OPENING_HOURS_START.' et '.self::OPENING_HOURS_END.'.');
                    }
                },
            ],
            'notes' => 'nullable|string|max:2000',
            'options' => 'nullable|array',
            'options.*.label' => 'required_with:options|string',
            'options.*.price' => 'required_with:options|integer|min:0',
        ]);

        $vehicle = Vehicle::find($validated['vehicle_id']);
        if (!$vehicle || $vehicle->status === 'Masqué') {
            return response()->json(['message' => 'Véhicule introuvable.'], 404);
        }

        $options = collect($validated['options'] ?? [])->map(fn ($o) => [
            'label' => $o['label'],
            'price' => (int) ($o['price'] ?? 0),
        ])->all();

        $preorder = Preorder::create([
            'reference' => Preorder::generateReference(),
            'appointment_code' => Preorder::generateAppointmentCode(),
            'vehicle_id' => $vehicle->id,
            'client_name' => $validated['name'],
            'full_name' => $validated['full_name'] ?? $validated['name'],
            'phone' => $validated['phone'],
            'dial' => $validated['dial'] ?? '+229',
            'email' => $validated['email'] ?? null,
            'city' => $validated['city'] ?? null,
            'country' => $validated['country'] ?? null,
            'appointment_date' => $validated['appointment_date'] ?? null,
            'appointment_time' => $validated['appointment_time'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'base_price' => $vehicle->price_fcfa,
            'options' => $options,
            'status' => 'Nouvelle demande',
            'container_code' => null,
        ]);

        $preorder->load('vehicle');

        $this->notifyStaff($preorder);

        return response()->json([
            'data' => $preorder->toArrayForApi(),
            'message' => 'Votre précommande a bien été enregistrée.',
        ], 201);
    }

    /**
     * Avertit les comptes admin et manager de la nouvelle demande.
     */
    private function notifyStaff(Preorder $preorder): void
    {
        try {
            $recipients = User::notificationEmails();

            if (empty($recipients)) {
                Log::warning('Aucun utilisateur admin/manager pour notifier du rendez-vous '.$preorder->reference);

                return;
            }

            Mail::to($recipients)->send(new AppointmentRequestMail($preorder));

            Log::info('Notification de rendez-vous envoyée', [
                'reference' => $preorder->reference,
                'appointment_code' => $preorder->appointment_code,
                'recipients' => $recipients,
            ]);
        } catch (\Throwable $e) {
            Log::error('Échec de la notification de rendez-vous : '.$e->getMessage());
        }
    }

    private function isWithinOpeningHours(string $time): bool
    {
        if (! preg_match('/^(\d{2}):(\d{2})$/', trim($time), $matches)) {
            return false;
        }

        $minutes = ((int) $matches[1]) * 60 + (int) $matches[2];

        return $minutes >= $this->minutes(self::OPENING_HOURS_START)
            && $minutes <= $this->minutes(self::OPENING_HOURS_END);
    }

    private function minutes(string $time): int
    {
        [$hours, $mins] = array_map('intval', explode(':', $time));

        return $hours * 60 + $mins;
    }
}