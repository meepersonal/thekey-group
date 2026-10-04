<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Container;
use App\Models\ContainerEvent;
use App\Models\Preorder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminContainerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'stage' => 'nullable|integer|min:0|max:' . (count(Container::STAGES) - 1),
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
        ]);

        $query = Container::query()
            ->withCount(['preorders', 'events'])
            ->with('latestEvent')
            ->search($validated['search'] ?? null)
            ->stage(isset($validated['stage']) ? (int) $validated['stage'] : null)
            ->latest();

        $perPage = (int) ($validated['per_page'] ?? 20);
        $page = (int) ($validated['page'] ?? 1);
        $paginated = $query->paginate($perPage, ['*'], 'page', $page);

        $stageCounts = Container::query()
            ->search($validated['search'] ?? null)
            ->selectRaw('stage, COUNT(*) as total')
            ->groupBy('stage')
            ->pluck('total', 'stage')
            ->all();

        $counts = [];
        foreach (array_keys(Container::STAGES) as $stage) {
            $counts[$stage] = (int) ($stageCounts[$stage] ?? 0);
        }

        return response()->json([
            'data' => collect($paginated->items())->map(fn ($c) => $c->toArrayForApi()),
            'stage_counts' => $counts,
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
        ]);
    }

    public function show(Container $container): JsonResponse
    {
        $container->load(['events.author', 'latestEvent'])->loadCount(['preorders', 'events']);

        return response()->json(['data' => $container->toArrayForApi(true)]);
    }

    public function store(Request $request): JsonResponse
    {
        $maxStage = count(Container::STAGES) - 1;

        $validated = $request->validate([
            'code' => 'required|string|max:60|unique:containers,code',
            'vessel' => 'nullable|string|max:100',
            'carrier' => 'nullable|string|max:100',
            'port_depart' => 'nullable|string|max:100',
            'port_arrivee' => 'nullable|string|max:100',
            'departure_date' => 'nullable|date',
            'eta' => 'nullable|date',
            'stage' => 'nullable|integer|min:0|max:'.$maxStage,
            'note' => 'nullable|string|max:2000',
            'initial_event' => 'nullable|array',
            'initial_event.event_date' => 'nullable|date',
            'initial_event.location' => 'nullable|string|max:150',
            'initial_event.comments' => 'nullable|string|max:2000',
            'preorder_ids' => 'nullable|array',
            'preorder_ids.*' => 'string|exists:preorders,id',
        ]);

        $container = Container::create($validated);

        $preorderIds = $validated['preorder_ids'] ?? [];
        if ($preorderIds !== []) {
            Preorder::whereIn('id', $preorderIds)
                ->whereNull('container_code')
                ->update(['container_code' => $container->code]);
        }

        $initialEvent = $validated['initial_event'] ?? [];
        if ($this->hasEventData($initialEvent)) {
            $container->events()->create([
                'stage' => (int) $container->stage,
                'event_date' => $initialEvent['event_date'] ?? now()->toDateString(),
                'location' => $initialEvent['location'] ?? null,
                'comments' => $initialEvent['comments'] ?? null,
                'created_by' => $request->user()?->id,
            ]);

            $container->refresh()->load(['latestEvent'])->loadCount(['preorders', 'events']);
        }

        return response()->json(['data' => $container->toArrayForApi()], 201);
    }

    public function update(Request $request, Container $container): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'sometimes|string|max:60|unique:containers,code,'.$container->id,
            'vessel' => 'nullable|string|max:100',
            'carrier' => 'nullable|string|max:100',
            'port_depart' => 'nullable|string|max:100',
            'port_arrivee' => 'nullable|string|max:100',
            'departure_date' => 'nullable|date',
            'eta' => 'nullable|date',
            'stage' => 'nullable|integer|min:0|max:' . (count(Container::STAGES) - 1),
            'client' => 'nullable|string|max:100',
            'note' => 'nullable|string|max:2000',
        ]);

        $container->update($validated);
        $container->refresh()->load(['latestEvent'])->loadCount(['preorders', 'events']);

        return response()->json(['data' => $container->toArrayForApi()]);
    }

    public function destroy(Container $container): JsonResponse
    {
        $preordersCount = $container->preorders()->count();

        if ($preordersCount > 0) {
            $message = "Le conteneur {$container->code} est rattaché à {$preordersCount} commande(s) et ne peut pas être supprimé. Détachez d'abord les commandes.";

            return response()->json([
                'message' => $message,
                'errors' => ['container' => [$message]],
            ], 422);
        }

        $container->delete();

        return response()->json(null, 204);
    }

    /* ═══════════════════════ Timeline (étapes) ═══════════════════════ */

    public function events(Request $request, Container $container): JsonResponse
    {
        $events = $container->events()
            ->with('author')
            ->when($request->filled('stage'), fn ($q) => $q->where('stage', (int) $request->input('stage')))
            ->get()
            ->map(fn ($e) => $e->toArrayForApi());

        return response()->json(['data' => $events]);
    }

    public function storeEvent(Request $request, Container $container): JsonResponse
    {
        $maxStage = count(Container::STAGES) - 1;

        $validated = $request->validate([
            'stage' => 'required|integer|min:0|max:'.$maxStage,
            'event_date' => 'required|date',
            'location' => 'nullable|string|max:150',
            'comments' => 'nullable|string|max:2000',
            'update_stage' => 'nullable|boolean',
        ]);

        $event = $container->events()->create([
            'stage' => (int) $validated['stage'],
            'event_date' => $validated['event_date'],
            'location' => $validated['location'] ?? null,
            'comments' => $validated['comments'] ?? null,
            'created_by' => $request->user()?->id,
        ]);

        if ($request->boolean('update_stage')) {
            $container->update(['stage' => (int) $validated['stage']]);
        }

        $container->refresh()->load(['latestEvent'])->loadCount(['preorders', 'events']);

        return response()->json([
            'data' => $event->load('author')->toArrayForApi(),
            'container' => $container->toArrayForApi(),
        ], 201);
    }

    public function destroyEvent(Container $container, ContainerEvent $event): JsonResponse
    {
        abort_unless($event->container_code === $container->code, 404);

        $event->delete();

        return response()->json(null, 204);
    }

    private function hasEventData(array $event): bool
    {
        return collect(['event_date', 'location', 'comments'])
            ->contains(fn (string $key) => filled($event[$key] ?? null));
    }
}
