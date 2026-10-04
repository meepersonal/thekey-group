<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'active' => 'nullable|string',
        ]);

        $query = Brand::query();

        $active = $request->query('active');
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

    public function show(Brand $brand): JsonResponse
    {
        return response()->json(['data' => $brand->toArrayForApi()]);
    }
}
