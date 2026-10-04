<?php

namespace App\Models;

use App\Support\Media;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehicleImage extends Model
{
    use HasUuids;

    protected $table = 'vehicle_images';

    protected $fillable = [
        'vehicle_id',
        'image',
        'uploaded_at',
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
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
            'url' => Media::url($this->image),
            'uploaded_at' => $this->uploaded_at?->toIso8601String(),
        ];
    }
}
