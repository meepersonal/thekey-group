<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Vehicle extends Model
{
    use HasUuids;

    protected $table = 'vehicles';

    const STATUSES = [
        'En Stock',
        'Sur Commande',
        'Masqué',
    ];

    const ENERGY_TYPES = [
        'Essence',
        'Hybride',
        'Diesel',
    ];

    const TRANSMISSION_TYPES = [
        'Manuel',
        'Automatique',
    ];

    protected $fillable = [
        'slug',
        'brand_id',
        'brand',
        'model',
        'category_id',
        'category',
        'condition',
        'year',
        'mileage_km',
        'energy',
        'transmission',
        'nombre_places',
        'engine',
        'consumption',
        'price_fcfa',
        'badge',
        'status',
        'featured',
        'highlights',
        'description',
    ];

    protected $casts = [
        'year' => 'integer',
        'mileage_km' => 'integer',
        'nombre_places' => 'integer',
        'price_fcfa' => 'integer',
        'featured' => 'boolean',
        'highlights' => 'array',
    ];

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(VehicleOption::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(VehicleImage::class);
    }

    public function preorders(): HasMany
    {
        return $this->hasMany(Preorder::class);
    }

    public function scopeVisible($query)
    {
        return $query->where('status', '!=', 'Masqué');
    }

    public function scopeSearch($query, ?string $term)
    {
        if (!$term) {
            return $query;
        }

        return $query->where(function ($q) use ($term) {
            $q->where('vehicles.brand', 'like', "%{$term}%")
              ->orWhere('vehicles.model', 'like', "%{$term}%")
              ->orWhere('vehicles.category', 'like', "%{$term}%")
              ->orWhereHas('brand', fn ($b) => $b->where('name', 'like', "%{$term}%"))
              ->orWhereHas('category', fn ($c) => $c->where('name', 'like', "%{$term}%"));
        });
    }

    public function scopeFilter($query, array $filters)
    {
        return $query
            ->when($filters['category'] ?? null, fn ($q, $cat) => $q->where('vehicles.category', $cat))
            ->when($filters['brand'] ?? null, fn ($q, $brand) => $q->where('vehicles.brand', $brand))
            ->when($filters['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->when($filters['condition'] ?? null, fn ($q, $cond) => $q->where('condition', $cond))
            ->when(isset($filters['max_price']) && $filters['max_price'] !== null, fn ($q, $price) => $q->where('price_fcfa', '<=', $price))
            ->when(isset($filters['min_price']) && $filters['min_price'] !== null, fn ($q, $price) => $q->where('price_fcfa', '>=', $price))
            ->when(isset($filters['featured']) && $filters['featured'], fn ($q) => $q->where('featured', true));
    }

    public function toArrayForApi(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'brand' => $this->brand,
            'brand_id' => $this->brand_id,
            'model' => $this->model,
            'category' => $this->category,
            'category_id' => $this->category_id,
            'condition' => $this->condition,
            'year' => (int) $this->year,
            'mileage_km' => (int) $this->mileage_km,
            'energy' => $this->energy,
            'transmission' => $this->transmission,
            'nombre_places' => (int) $this->nombre_places,
            'engine' => $this->engine,
            'consumption' => $this->consumption,
            'price_fcfa' => (int) $this->price_fcfa,
            'badge' => $this->badge,
            'status' => $this->status,
            'featured' => (bool) $this->featured,
            'highlights' => $this->highlights ?? [],
            'description' => $this->description,
            'vehicle_images' => $this->images->map(fn ($i) => $i->toArrayForApi()),
            'options' => $this->options->map(fn ($o) => $o->toArrayForApi()),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    public static function makeSlug(string $brand, string $model): string
    {
        $base = Str::slug($brand.' '.$model);
        $slug = $base;
        $i = 1;
        while (self::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }
        return $slug;
    }
}