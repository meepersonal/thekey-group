<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class VehicleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'category' => 'nullable|string',
            'condition' => 'nullable|string',
            'brand' => 'nullable|string',
            'status' => 'nullable|string',
            'min_price' => 'nullable|integer|min:0',
            'max_price' => 'nullable|integer|min:0',
            'featured' => 'nullable|boolean',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
        ]);

        $query = Vehicle::query()
            ->with(['options', 'images'])
            ->visible()
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

    public function show(Vehicle $vehicle): JsonResponse
    {
        abort_unless($vehicle->status !== 'Masqué', 404);
        $vehicle->load(['options', 'images']);
        return response()->json(['data' => $vehicle->toArrayForApi()]);
    }
}