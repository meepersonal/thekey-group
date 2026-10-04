<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContainerEvent extends Model
{
    use HasUuids;

    protected $table = 'container_events';

    protected $fillable = [
        'container_code',
        'stage',
        'event_date',
        'location',
        'comments',
        'created_by',
    ];

    protected $casts = [
        'stage' => 'integer',
        'event_date' => 'date',
    ];

    public function container(): BelongsTo
    {
        return $this->belongsTo(Container::class, 'container_code', 'code');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function toArrayForApi(): array
    {
        return [
            'id' => $this->id,
            'container_code' => $this->container_code,
            'stage' => (int) $this->stage,
            'stage_label' => Container::STAGES[(int) $this->stage] ?? 'Étape inconnue',
            'event_date' => $this->event_date?->toDateString(),
            'location' => $this->location,
            'comments' => $this->comments,
            'created_by' => $this->created_by,
            'author_name' => $this->author?->name,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
