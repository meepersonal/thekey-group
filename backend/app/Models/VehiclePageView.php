<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehiclePageView extends Model
{
    use HasUuids;

    protected $table = 'vehicle_page_views';

    protected $fillable = [
        'vehicle_id',
        'view_token',
        'visitor_hash',
        'duration_seconds',
        'clicks',
        'referer_host',
        'viewed_at',
    ];

    protected $casts = [
        'duration_seconds' => 'integer',
        'clicks' => 'integer',
        'viewed_at' => 'datetime',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function toArrayForApi(): array
    {
        return [
            'id' => $this->id,
            'vehicle_id' => $this->vehicle_id,
            'duration_seconds' => $this->duration_seconds,
            'clicks' => $this->clicks,
            'referer_host' => $this->referer_host,
            'viewed_at' => $this->viewed_at?->toIso8601String(),
        ];
    }
}
