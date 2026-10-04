<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Preorder extends Model
{
    use HasUuids;

    protected $table = 'preorders';

    protected $fillable = [
        'reference',
        'appointment_code',
        'vehicle_id',
        'client_name',
        'full_name',
        'phone',
        'dial',
        'email',
        'city',
        'country',
        'appointment_date',
        'appointment_time',
        'notes',
        'base_price',
        'options',
        'status',
        'container_code',
    ];

    protected $casts = [
        'base_price' => 'integer',
        'options' => 'array',
    ];

    const STATUSES = [
        'Nouvelle demande',
        'Prise en charge',
        'Acompte Versé',
        'Annulée',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function container()
    {
        return $this->belongsTo(Container::class, 'container_code', 'code');
    }

    public function getTotalAttribute(): int
    {
        $optionsTotal = collect($this->options ?? [])->sum(fn ($o) => (int) ($o['price'] ?? 0));
        return (int) $this->base_price + $optionsTotal;
    }

    public function scopeStatus($query, ?string $status)
    {
        if (!$status) {
            return $query;
        }
        return $query->where('status', $status);
    }

    public static function generateReference(): string
    {
        $year = now()->year;
        $count = self::whereYear('created_at', now()->year)->count() + 1;
        return 'RES-'.$year.'-'.str_pad((string) $count, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Code de rendez-vous court : 2 lettres + 2 chiffres aléatoires (ex. KD47).
     */
    public static function generateAppointmentCode(): string
    {
        $letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

        do {
            $code = collect(range(1, 2))
                ->map(fn () => $letters[random_int(0, strlen($letters) - 1)])
                ->implode('')
                .str_pad((string) random_int(0, 99), 2, '0', STR_PAD_LEFT);
        } while (self::where('appointment_code', $code)->exists());

        return $code;
    }

    public function toArrayForApi(bool $admin = false): array
    {
        $data = [
            'id' => $this->id,
            'reference' => $this->reference,
            'appointment_code' => $this->appointment_code,
            'client_name' => $this->client_name,
            'full_name' => $this->full_name,
            'phone' => $this->phone,
            'dial' => $this->dial,
            'email' => $this->email,
            'city' => $this->city,
            'country' => $this->country,
            'appointment_date' => $this->appointment_date,
            'appointment_time' => $this->appointment_time,
            'notes' => $this->notes,
            'vehicle' => $this->vehicle ? [
                'id' => $this->vehicle->id,
                'brand' => $this->vehicle->brand,
                'model' => $this->vehicle->model,
                'slug' => $this->vehicle->slug,
            ] : null,
            'base_price' => (int) $this->base_price,
            'options' => $this->options ?? [],
            'total' => $this->total,
            'status' => $this->status,
            'container_code' => $this->container_code,
            'created_at' => $this->created_at?->toIso8601String(),
        ];

        if ($admin) {
            $data['updated_at'] = $this->updated_at?->toIso8601String();
        }

        return $data;
    }
}