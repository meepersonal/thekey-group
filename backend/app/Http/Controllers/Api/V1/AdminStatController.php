<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Container;
use App\Models\Preorder;
use App\Models\Vehicle;
use App\Models\VehiclePageView;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminStatController extends Controller
{
    private const MONTHS = 6;

    public function overview(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'months' => 'nullable|integer|min:1|max:24',
            'from' => 'nullable|date_format:Y-m-d',
            'to' => 'nullable|date_format:Y-m-d|after_or_equal:from',
            'granularity' => 'nullable|in:day,month',
        ]);

        $customRange = ! empty($validated['from']) || ! empty($validated['to']);

        if ($customRange) {
            $start = Carbon::parse($validated['from'] ?? now()->subDays(29)->toDateString())->startOfDay();
            $end = Carbon::parse($validated['to'] ?? $validated['from'])->endOfDay();
        } else {
            $months = (int) ($validated['months'] ?? self::MONTHS);
            $start = now()->subMonths($months - 1)->startOfMonth();
            $end = now()->endOfDay();
        }

        $totalDays = (int) $start->diffInDays($end) + 1;
        $granularity = $validated['granularity'] ?? ($totalDays <= 92 ? 'day' : 'month');
        if ($granularity === 'day' && $totalDays > 366) {
            $granularity = 'month';
        }
        $dateFormat = $granularity === 'day' ? '%Y-%m-%d' : '%Y-%m';
        $periodFormat = $granularity === 'day' ? 'Y-m-d' : 'Y-m';

        $totals = VehiclePageView::whereBetween('viewed_at', [$start, $end])
            ->selectRaw('COUNT(*) as views')
            ->selectRaw('COUNT(DISTINCT visitor_hash) as visitors')
            ->selectRaw('COALESCE(SUM(duration_seconds), 0) as duration')
            ->selectRaw('COALESCE(SUM(clicks), 0) as clicks')
            ->first();

        $views = (int) $totals->views;
        $duration = (int) $totals->duration;

        $series = VehiclePageView::whereBetween('viewed_at', [$start, $end])
            ->selectRaw(
                "DATE_FORMAT(viewed_at, '$dateFormat') as period,
                 COUNT(*) as views,
                 COUNT(DISTINCT visitor_hash) as visitors"
            )
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->keyBy('period');

        $timeline = [];
        $cursor = $granularity === 'day' ? $start->copy() : $start->copy()->startOfMonth();
        while ($cursor->lte($end)) {
            $key = $cursor->format($periodFormat);
            $row = $series->get($key);
            $timeline[] = [
                'period' => $key,
                'label' => $granularity === 'day'
                    ? $cursor->format('d/m')
                    : $cursor->translatedFormat('M'),
                'full_label' => $granularity === 'day'
                    ? $cursor->translatedFormat('d M Y')
                    : $cursor->translatedFormat('M Y'),
                'views' => (int) ($row->views ?? 0),
                'visitors' => (int) ($row->visitors ?? 0),
            ];
            $cursor = $granularity === 'day' ? $cursor->copy()->addDay() : $cursor->copy()->addMonthNoOverflow();
        }

        $previous = VehiclePageView::whereBetween('viewed_at', [
            $start->copy()->subDays($totalDays),
            $start->copy()->subSecond(),
        ])->count();

        $topPages = VehiclePageView::query()
            ->join('vehicles', 'vehicles.id', '=', 'vehicle_page_views.vehicle_id')
            ->whereBetween('vehicle_page_views.viewed_at', [$start, $end])
            ->selectRaw('vehicles.id, vehicles.brand, vehicles.model, vehicles.slug')
            ->selectRaw('COUNT(*) as views')
            ->selectRaw('COALESCE(SUM(vehicle_page_views.duration_seconds), 0) as duration')
            ->selectRaw('COALESCE(SUM(vehicle_page_views.clicks), 0) as clicks')
            ->groupBy('vehicles.id', 'vehicles.brand', 'vehicles.model', 'vehicles.slug')
            ->orderByDesc('views')
            ->limit(10)
            ->get()
            ->map(fn ($r) => [
                'vehicle_id' => (int) $r->id,
                'path' => '/vehicules/' . $r->id,
                'label' => trim($r->brand . ' ' . $r->model),
                'views' => (int) $r->views,
                'clicks' => (int) $r->clicks,
                'avg_duration_seconds' => (int) round($r->duration / max(1, $r->views)),
            ]);

        return response()->json([
            'data' => [
                'totals' => [
                    'views' => $views,
                    'visitors' => (int) $totals->visitors,
                    'clicks' => (int) $totals->clicks,
                    'total_duration_seconds' => $duration,
                    'avg_duration_seconds' => $views > 0 ? (int) round($duration / $views) : 0,
                    'clicks_per_view' => $views > 0 ? round((int) $totals->clicks / $views, 2) : 0,
                    'views_previous_period' => $previous,
                    'views_change_pct' => $previous > 0
                        ? round((($views - $previous) / $previous) * 100, 1)
                        : null,
                ],
                'timeline' => $timeline,
                'range' => [
                    'from' => $start->toDateString(),
                    'to' => $end->toDateString(),
                    'days' => $totalDays,
                    'granularity' => $granularity,
                ],
                'top_pages' => $topPages,
            ],
        ]);
    }

    /**
     * Agrégats du tableau de bord : catalogue, précommandes, revenus, conteneurs.
     */
    public function dashboard(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'months' => 'nullable|integer|min:1|max:24',
        ]);
        $months = (int) ($validated['months'] ?? self::MONTHS);

        $since = now()->subMonths($months)->startOfMonth();

        $vehiclesTotal = Vehicle::query()->count();
        $vehiclesPrevious = Vehicle::query()
            ->where('created_at', '<', now()->subDays(30)->startOfDay())
            ->count();

        $preordersTotal = Preorder::query()->count();
        $activePreorders = Preorder::query()->whereNotIn('status', ['Annulée'])->count();

        $revenueByPeriod = $this->revenueByMonth($since, $months);
        $revenueTotal = (int) collect($revenueByPeriod)->sum('revenue');
        $revenueThisMonth = (int) collect($revenueByPeriod)->last()['revenue'] ?? 0;
        $revenueLastMonth = (int) collect($revenueByPeriod)->slice(-2, 1)->first()['revenue'] ?? 0;

        $stageCounts = [];
        $rawStageCounts = Container::query()
            ->selectRaw('stage, COUNT(*) as total')
            ->groupBy('stage')
            ->pluck('total', 'stage')
            ->all();
        foreach (array_keys(Container::STAGES) as $stage) {
            $stageCounts[$stage] = (int) ($rawStageCounts[$stage] ?? 0);
        }

        $byBrand = Vehicle::query()
            ->selectRaw('brand, COUNT(*) as total')
            ->groupBy('brand')
            ->orderByDesc('total')
            ->limit(8)
            ->get()
            ->map(fn ($r) => ['name' => (string) $r->brand, 'value' => (int) $r->total])
            ->values();

        $byStatus = Preorder::query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($r) => ['status' => (string) $r->status, 'value' => (int) $r->total])
            ->values();

        return response()->json([
            'data' => [
                'vehicles' => [
                    'total' => $vehiclesTotal,
                    'in_stock' => Vehicle::query()->where('status', 'En Stock')->count(),
                    'on_order' => Vehicle::query()->where('status', 'Sur Commande')->count(),
                    'hidden' => Vehicle::query()->where('status', 'Masqué')->count(),
                    'change_pct' => $this->changePct($vehiclesTotal, $vehiclesPrevious),
                ],
                'preorders' => [
                    'total' => $preordersTotal,
                    'active' => $activePreorders,
                    'new' => Preorder::query()->where('status', 'Nouvelle demande')->count(),
                    'cancelled' => Preorder::query()->where('status', 'Annulée')->count(),
                    'change_pct' => $this->changePct(
                        $preordersTotal,
                        Preorder::query()->where('created_at', '<', now()->subDays(30)->startOfDay())->count()
                    ),
                ],
                'revenue' => [
                    'total' => $revenueTotal,
                    'month' => $revenueThisMonth,
                    'previous_month' => $revenueLastMonth,
                    'change_pct' => $this->changePct($revenueThisMonth, $revenueLastMonth),
                ],
                'containers' => [
                    'total' => Container::query()->count(),
                    'in_transit' => array_sum(array_slice($stageCounts, 0, 3, true)),
                    'stage_counts' => $stageCounts,
                ],
                'by_brand' => $byBrand,
                'by_status' => $byStatus,
                'by_month' => $revenueByPeriod,
            ],
        ]);
    }

    /**
     * Commandes et revenus mois par mois sur la période demandée.
     */
    private function revenueByMonth(\DateTimeInterface $since, int $months): array
    {
        $preorders = Preorder::query()
            ->where('created_at', '>=', $since)
            ->whereNotIn('status', ['Annulée'])
            ->get(['created_at', 'base_price', 'options']);

        $grouped = [];
        foreach ($preorders as $preorder) {
            $period = $preorder->created_at?->format('Y-m') ?? now()->format('Y-m');
            $grouped[$period] ??= ['orders' => 0, 'revenue' => 0];
            $grouped[$period]['orders']++;
            $grouped[$period]['revenue'] += $preorder->total;
        }

        $series = [];
        for ($i = $months - 1; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $key = $date->format('Y-m');
            $row = $grouped[$key] ?? ['orders' => 0, 'revenue' => 0];
            $series[] = [
                'month' => $date->translatedFormat('M'),
                'period' => $key,
                'orders' => (int) $row['orders'],
                'revenue' => (int) $row['revenue'],
            ];
        }

        return $series;
    }

    private function changePct(int $current, int $previous): ?float
    {
        if ($previous <= 0) {
            return $current > 0 ? 100.0 : null;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }

    public function vehicle(Vehicle $vehicle, Request $request): JsonResponse    {
        $validated = $request->validate([
            'days' => 'nullable|integer|min:1|max:365',
        ]);
        $days = (int) ($validated['days'] ?? 30);
        $since = now()->subDays($days);

        $base = VehiclePageView::where('vehicle_id', $vehicle->id);

        $totals = (clone $base)
            ->where('viewed_at', '>=', $since)
            ->selectRaw('COUNT(*) as views')
            ->selectRaw('COUNT(DISTINCT visitor_hash) as visitors')
            ->selectRaw('COALESCE(SUM(duration_seconds), 0) as duration')
            ->selectRaw('COALESCE(SUM(clicks), 0) as clicks')
            ->first();

        $views = (int) $totals->views;
        $duration = (int) $totals->duration;

        $daily = (clone $base)
            ->where('viewed_at', '>=', $since)
            ->selectRaw('DATE(viewed_at) as day, COUNT(*) as views')
            ->selectRaw('COALESCE(SUM(duration_seconds), 0) as duration')
            ->selectRaw('COALESCE(SUM(clicks), 0) as clicks')
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->keyBy('day');

        $timeline = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $row = $daily->get($date->toDateString());
            $timeline[] = [
                'day' => $date->toDateString(),
                'label' => $date->translatedFormat('d M'),
                'views' => (int) ($row->views ?? 0),
                'avg_duration_seconds' => (int) round((int) ($row->duration ?? 0) / max(1, (int) ($row->views ?? 0))),
                'clicks' => (int) ($row->clicks ?? 0),
            ];
        }

        $referrers = (clone $base)
            ->where('viewed_at', '>=', $since)
            ->whereNotNull('referer_host')
            ->selectRaw('referer_host, COUNT(*) as views')
            ->groupBy('referer_host')
            ->orderByDesc('views')
            ->limit(5)
            ->pluck('views', 'referer_host')
            ->map(fn ($v, $k) => ['host' => $k, 'views' => (int) $v])
            ->values();

        return response()->json([
            'data' => [
                'vehicle' => [
                    'id' => $vehicle->id,
                    'label' => trim($vehicle->brand . ' ' . $vehicle->model),
                ],
                'totals' => [
                    'views' => $views,
                    'visitors' => (int) $totals->visitors,
                    'clicks' => (int) $totals->clicks,
                    'avg_duration_seconds' => $views > 0 ? (int) round($duration / $views) : 0,
                    'clicks_per_view' => $views > 0 ? round((int) $totals->clicks / $views, 2) : 0,
                ],
                'timeline' => $timeline,
                'referrers' => $referrers,
            ],
        ]);
    }
}
