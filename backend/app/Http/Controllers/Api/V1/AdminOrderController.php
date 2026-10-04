<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Preorder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'status' => 'nullable|string',
            'container_code' => 'nullable|string|max:60',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
        ]);

        $query = Preorder::query()
            ->with(['vehicle', 'container'])
            ->when($validated['status'] ?? null, fn ($q, $s) => $q->where('status', $s))
            ->when($validated['container_code'] ?? null, fn ($q, $c) => $q->where('container_code', $c))
            ->when($validated['search'] ?? null, fn ($q, $term) => $q->where(function ($x) use ($term) {
                $x->where('reference', 'like', "%{$term}%")
                  ->orWhere('client_name', 'like', "%{$term}%")
                  ->orWhere('phone', 'like', "%{$term}%");
            }))
            ->latest();

        $perPage = (int) ($validated['per_page'] ?? 20);
        $page = (int) ($validated['page'] ?? 1);
        $paginated = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data' => collect($paginated->items())->map(fn ($o) => $o->toArrayForApi(true)),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
        ]);
    }

    public function update(Request $request, Preorder $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'sometimes|string|in:Nouvelle demande,Prise en charge,Acompte Versé,Annulée',
            'container_code' => 'nullable|string|exists:containers,code',
            'notes' => 'nullable|string|max:2000',
        ]);

        $order->update($validated);
        $order->load(['vehicle', 'container']);

        return response()->json(['data' => $order->toArrayForApi(true)]);
    }

    public function destroy(Preorder $order): JsonResponse
    {
        $order->delete();
        return response()->json(null, 204);
    }
}