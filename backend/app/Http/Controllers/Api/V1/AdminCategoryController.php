<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminCategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'active' => 'nullable|string',
        ]);

        $query = Category::query();

        $active = $validated['active'] ?? null;
        if ($active === '1' || $active === 'true') {
            $query->active();
        } elseif ($active === '0' || $active === 'false') {
            $query->where('is_active', false);
        }

        $categories = $query->ordered()->get();

        return response()->json([
            'data' => $categories->map(fn ($c) => $c->toArrayForApi()),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name',
            'description' => 'nullable|string|max:2000',
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $category = Category::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return response()->json(['data' => $category->toArrayForApi()], 201);
    }

    public function show(Category $category): JsonResponse
    {
        return response()->json(['data' => $category->toArrayForApi()]);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100|unique:categories,name,'.$category->id,
            'description' => 'nullable|string|max:2000',
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $category->fill($validated);
        $category->save();

        return response()->json(['data' => $category->fresh()->toArrayForApi()]);
    }

    public function destroy(Category $category): JsonResponse
    {
        $category->delete();
        return response()->json(null, 204);
    }
}
