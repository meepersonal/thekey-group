<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Agence;
use Illuminate\Http\JsonResponse;

class AgenceController extends Controller
{
    /**
     * Liste publique des agences actives, alimentée par la table `agences`
     * (alimentée depuis /admin/parametres → onglet Agences).
     */
    public function index(): JsonResponse
    {
        $agences = Agence::query()
            ->active()
            ->ordered()
            ->get()
            ->map(fn (Agence $agence) => $agence->toArrayForApi());

        return response()->json(['data' => $agences]);
    }

    public function show(Agence $agence): JsonResponse
    {
        abort_unless($agence->is_active, 404);

        return response()->json(['data' => $agence->toArrayForApi()]);
    }
}