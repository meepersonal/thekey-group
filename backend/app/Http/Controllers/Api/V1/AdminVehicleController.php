<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\VehicleImage;
use App\Models\VehicleOption;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminVehicleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'category' => 'nullable|string',
            'brand' => 'nullable|string',
            'status' => 'nullable|string',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
        ]);

        $query = Vehicle::query()
            ->with(['options', 'images'])
            ->search($validated['search'] ?? null)
            ->filter($validated);

        $perPage = (int) ($validated['per_page'] ?? 20);
        $page = (int) ($validated['page'] ?? 1);
        $paginated = $query->latest()->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data' => collect($paginated->items())->map(fn ($v) => $v->toArrayForApi()),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'brand' => 'required|string|max:50',
            'model' => 'required|string|max:100',
            'category' => 'required|string',
            'condition' => 'nullable|string',
            'year' => 'nullable|integer|min:1990|max:2030',
            'mileage_km' => 'nullable|integer|min:0',
            'energy' => 'nullable|in:' . implode(',', Vehicle::ENERGY_TYPES) . '|max:50',
            'transmission' => 'nullable|in:' . implode(',', Vehicle::TRANSMISSION_TYPES) . '|max:50',
            'nombre_places' => 'required|integer|min:2|max:7',
            'engine' => 'nullable|string|max:100',
            'consumption' => 'nullable|string|max:50',
            'price_fcfa' => 'required|integer|min:0',
            'badge' => 'nullable|string|max:50',
            'status' => 'nullable|string',
            'featured' => 'nullable|boolean',
            'highlights' => 'nullable|array',
            'description' => 'nullable|string',
            'options' => 'nullable|array',
            'options.*.label' => 'required_with:options|string',
            'options.*.price' => 'required_with:options|integer|min:0',
        ]);

        $vehicle = Vehicle::create([
            'slug' => Vehicle::makeSlug($validated['brand'], $validated['model']),
            'brand' => $validated['brand'],
            'model' => $validated['model'],
            'category' => $validated['category'],
            'condition' => $validated['condition'] ?? 'Neuf',
            'year' => $validated['year'] ?? now()->year,
            'mileage_km' => $validated['mileage_km'] ?? 0,
            'energy' => $validated['energy'] ?? 'Essence',
            'transmission' => $validated['transmission'] ?? 'Manuel',
            'nombre_places' => $validated['nombre_places'] ?? 5,
            'engine' => $validated['engine'] ?? null,
            'consumption' => $validated['consumption'] ?? null,
            'price_fcfa' => $validated['price_fcfa'],
            'badge' => $validated['badge'] ?? null,
            'status' => $validated['status'] ?? 'En Stock',
            'featured' => $validated['featured'] ?? false,
            'highlights' => $validated['highlights'] ?? [],
            'description' => $validated['description'] ?? null,
        ]);

        $this->syncOptions($vehicle, $validated['options'] ?? []);

        $vehicle->load(['options', 'images']);

        return response()->json(['data' => $vehicle->toArrayForApi()], 201);
    }

    public function show(Vehicle $vehicle): JsonResponse
    {
        $vehicle->load(['options', 'images']);
        return response()->json(['data' => $vehicle->toArrayForApi()]);
    }

    public function update(Request $request, Vehicle $vehicle): JsonResponse
    {
        $validated = $request->validate([
            'brand' => 'sometimes|string|max:50',
            'model' => 'sometimes|string|max:100',
            'category' => 'sometimes|string',
            'condition' => 'sometimes|string',
            'year' => 'sometimes|integer|min:1990|max:2030',
            'mileage_km' => 'sometimes|integer|min:0',
            'energy' => 'sometimes|in:' . implode(',', Vehicle::ENERGY_TYPES) . '|max:50',
            'transmission' => 'sometimes|in:' . implode(',', Vehicle::TRANSMISSION_TYPES) . '|max:50',
            'nombre_places' => 'sometimes|integer|min:2|max:7',
            'engine' => 'sometimes|nullable|string|max:100',
            'consumption' => 'sometimes|nullable|string|max:50',
            'price_fcfa' => 'sometimes|integer|min:0',
            'badge' => 'sometimes|nullable|string|max:50',
            'status' => 'sometimes|string',
            'featured' => 'sometimes|boolean',
            'highlights' => 'sometimes|array',
            'description' => 'sometimes|string',
            'options' => 'nullable|array',
            'options.*.label' => 'required_with:options|string',
            'options.*.price' => 'required_with:options|integer|min:0',
        ]);

        $vehicle->fill($validated);
        if (isset($validated['brand']) || isset($validated['model'])) {
            $vehicle->slug = Vehicle::makeSlug(
                $vehicle->brand,
                $vehicle->model
            );
        }
        $vehicle->save();

        if (array_key_exists('options', $validated)) {
            $this->syncOptions($vehicle, $validated['options'] ?? []);
        }

        $vehicle->load(['options', 'images']);

        return response()->json(['data' => $vehicle->toArrayForApi()]);
    }

    public function destroy(Vehicle $vehicle): JsonResponse
    {
        $vehicle->delete();
        return response()->json(null, 204);
    }

    public function statuses(): JsonResponse
    {
        return response()->json([
            'data' => Vehicle::STATUSES,
        ]);
    }

    public function energyTypes(): JsonResponse
    {
        return response()->json([
            'data' => Vehicle::ENERGY_TYPES,
        ]);
    }

    public function transmissionTypes(): JsonResponse
    {
        return response()->json([
            'data' => Vehicle::TRANSMISSION_TYPES,
        ]);
    }

    public function uploadImages(Request $request, Vehicle $vehicle): JsonResponse
    {
        $request->validate([
            'images.*' => 'required|image|max:5120',
            'images' => 'required|array|max:7',
        ]);

        $currentCount = $vehicle->images()->count();
        $files = $request->file('images');

        if ($currentCount + count($files) > 7) {
            return response()->json([
                'message' => 'La limite de 7 images par véhicule est atteinte.',
            ], 422);
        }

        $uploaded = [];
        foreach ($files as $file) {
            $path = $file->store('media/vehicles', 'public');
            $image = VehicleImage::create([
                'vehicle_id' => $vehicle->id,
                'image' => $path,
                'uploaded_at' => now(),
            ]);
            $uploaded[] = $image->toArrayForApi();
        }

        $vehicle->load('images');

        return response()->json([
            'data' => $uploaded,
            'total' => $vehicle->images()->count(),
        ], 201);
    }

    public function destroyImage(Vehicle $vehicle, VehicleImage $image): JsonResponse
    {
        abort_unless($image->vehicle_id === $vehicle->id, 404);

        Storage::disk('public')->delete($image->image);
        $image->delete();

        $vehicle->load('images');

        return response()->json([
            'data' => $vehicle->images->map(fn ($i) => $i->toArrayForApi()),
            'total' => $vehicle->images()->count(),
        ]);
    }

    public function syncOptions(Vehicle $vehicle, array $options): void
    {
        $newIds = [];
        foreach ($options as $o) {
            $opt = VehicleOption::updateOrCreate(
                [
                    'vehicle_id' => $vehicle->id,
                    'label' => $o['label'],
                ],
                [
                    'price' => (int) ($o['price'] ?? 0),
                    'option_key' => isset($o['option_key']) ? Str::slug($o['option_key']) : Str::slug($o['label']),
                ]
            );
            $newIds[] = $opt->id;
        }
        VehicleOption::where('vehicle_id', $vehicle->id)
            ->whereNotIn('id', $newIds)
            ->delete();
    }

    public function destroyOption(Vehicle $vehicle, VehicleOption $option): JsonResponse
    {
        abort_unless($option->vehicle_id === $vehicle->id, 404);
        $option->delete();
        return response()->json(null, 204);
    }
}