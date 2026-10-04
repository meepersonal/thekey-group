<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\VehicleOption;
use Illuminate\Http\JsonResponse;

class OptionController extends Controller
{
    public function index(): JsonResponse
    {
        $options = VehicleOption::query()
            ->with('vehicle')
            ->latest()
            ->get()
            ->map(fn ($o) => $o->toArrayForApi());

        return response()->json(['data' => $options]);
    }
}