<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminBrandController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'active' => 'nullable|string',
        ]);

        $query = Brand::query();

        $active = $validated['active'] ?? null;
        if ($active === '1' || $active === 'true') {
            $query->active();
        } elseif ($active === '0' || $active === 'false') {
            $query->where('is_active', false);
        }

        $brands = $query->ordered()->get();

        return response()->json([
            'data' => $brands->map(fn ($b) => $b->toArrayForApi()),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:brands,name',
            'origin' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:2000',
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $brand = Brand::create([
            'name' => $validated['name'],
            'origin' => $validated['origin'] ?? null,
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return response()->json(['data' => $brand->toArrayForApi()], 201);
    }

    public function show(Brand $brand): JsonResponse
    {
        return response()->json(['data' => $brand->toArrayForApi()]);
    }

    public function update(Request $request, Brand $brand): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100|unique:brands,name,'.$brand->id,
            'origin' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:2000',
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $brand->fill($validated);
        $brand->save();

        return response()->json(['data' => $brand->fresh()->toArrayForApi()]);
    }

    public function destroy(Brand $brand): JsonResponse
    {
        $brand->delete();
        return response()->json(null, 204);
    }
}
