<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Brand extends Model
{
    use HasUuids;

    protected $table = 'brands';

    protected $fillable = [
        'name',
        'slug',
        'origin',
        'description',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    protected static function booted(): void
    {
        static::creating(function (Brand $brand) {
            if (!$brand->slug) {
                $brand->slug = static::makeSlug($brand->name);
            }
        });
    }

    public static function makeSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 1;
        while (self::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }
        return $slug;
    }

    public function toArrayForApi(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'origin' => $this->origin,
            'description' => $this->description,
            'is_active' => (bool) $this->is_active,
            'vehicles_count' => $this->vehicles()->count(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}