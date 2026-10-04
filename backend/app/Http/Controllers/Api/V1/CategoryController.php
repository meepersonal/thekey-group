<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'active' => 'nullable|string',
        ]);

        $query = Category::query();

        $active = $request->query('active');
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

    public function show(Category $category): JsonResponse
    {
        return response()->json(['data' => $category->toArrayForApi()]);
    }
}
