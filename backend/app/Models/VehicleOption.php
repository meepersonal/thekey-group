<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehicleOption extends Model
{
    use HasUuids;

    protected $table = 'vehicle_options';

    protected $fillable = [
        'vehicle_id',
        'label',
        'price',
        'option_key',
    ];

    protected $casts = [
        'price' => 'integer',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function toArrayForApi(): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'price' => (int) $this->price,
            'option_key' => $this->option_key,
        ];
    }
}