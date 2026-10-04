<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Agence;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminAgenceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'active' => 'nullable|string',
        ]);

        $query = Agence::query();

        $active = $validated['active'] ?? null;
        if ($active === '1' || $active === 'true') {
            $query->active();
        } elseif ($active === '0' || $active === 'false') {
            $query->where('is_active', false);
        }

        $agences = $query->ordered()->get();

        return response()->json([
            'data' => $agences->map(fn ($a) => $a->toArrayForApi()),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'location' => 'required|string|max:255',
            'map_url' => 'nullable|url|max:255',
            'phone' => 'nullable|string|max:50',
            'hours' => 'nullable|string|max:150',
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $agence = Agence::create([
            'name' => $validated['name'],
            'location' => $validated['location'],
            'map_url' => $validated['map_url'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'hours' => $validated['hours'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return response()->json(['data' => $agence->toArrayForApi()], 201);
    }

    public function show(Agence $agence): JsonResponse
    {
        return response()->json(['data' => $agence->toArrayForApi()]);
    }

    public function update(Request $request, Agence $agence): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'location' => 'sometimes|string|max:255',
            'map_url' => 'nullable|url|max:255',
            'phone' => 'nullable|string|max:50',
            'hours' => 'nullable|string|max:150',
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $agence->fill($validated);
        $agence->save();

        return response()->json(['data' => $agence->fresh()->toArrayForApi()]);
    }

    public function destroy(Agence $agence): JsonResponse
    {
        $agence->delete();
        return response()->json(null, 204);
    }
}
