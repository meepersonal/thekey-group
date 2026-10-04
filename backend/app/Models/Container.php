<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Container extends Model
{
    use HasUuids;

    protected $table = 'containers';

    protected $fillable = [
        'code',
        'vessel',
        'carrier',
        'port_depart',
        'port_arrivee',
        'departure_date',
        'eta',
        'stage',
        'client',
        'note',
    ];

    protected $casts = [
        'stage' => 'integer',
    ];

    const STAGES = [
        0 => 'Commande effectuée depuis la Chine',
        1 => 'Démarrage du bateau depuis la Chine',
        2 => 'En transit maritime',
        3 => 'Arrivé au port',
        4 => 'Dédouanement en cours',
        5 => 'Dédouané',
        6 => 'En livraison',
    ];

    /**
     * Les conteneurs sont adressés par leur code (ex. CONT-2026-BYD88).
     */
    public function getRouteKeyName(): string
    {
        return 'code';
    }

    public function events(): HasMany
    {
        return $this->hasMany(ContainerEvent::class, 'container_code', 'code')
            ->orderByDesc('event_date')
            ->orderByDesc('id');
    }

    public function latestEvent(): HasOne
    {
        return $this->hasOne(ContainerEvent::class, 'container_code', 'code')
            ->latestOfMany('event_date');
    }

    public function preorders(): HasMany
    {
        return $this->hasMany(Preorder::class, 'container_code', 'code');
    }

    public function scopeStage($query, ?int $stage)
    {
        if ($stage === null || $stage === '') {
            return $query;
        }
        return $query->where('stage', $stage);
    }

    public function scopeSearch($query, ?string $term)
    {
        if (!$term) {
            return $query;
        }
        return $query->where(function ($q) use ($term) {
            $q->where('code', 'like', "%{$term}%")
              ->orWhere('vessel', 'like', "%{$term}%")
              ->orWhere('client', 'like', "%{$term}%");
        });
    }

    public function toArrayForApi(bool $withEvents = false): array
    {
        $data = [
            'id' => $this->id,
            'code' => $this->code,
            'vessel' => $this->vessel,
            'carrier' => $this->carrier,
            'port_depart' => $this->port_depart,
            'port_arrivee' => $this->port_arrivee,
            'departure_date' => $this->departure_date,
            'eta' => $this->eta,
            'stage' => (int) $this->stage,
            'stage_label' => self::STAGES[(int) $this->stage] ?? 'Étape inconnue',
            'client' => $this->client,
            'note' => $this->note,
            'preorders_count' => $this->preorders_count ?? $this->preorders()->count(),
            'events_count' => $this->events_count ?? $this->events()->count(),
            'latest_event' => $this->latestEvent?->toArrayForApi(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];

        if ($withEvents) {
            $data['events'] = $this->events->map(fn ($e) => $e->toArrayForApi())->values();
        }

        return $data;
    }
}