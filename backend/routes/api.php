<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\{
    VehicleController,
    BrandController,
    CategoryController,
    OptionController,
    AgenceController,
    MediaController,
    PreorderController,
    TrackingController,
    PageViewController,
    AdminAuthController,
    AdminVehicleController,
    AdminOrderController,
    AdminContainerController,
    AdminBrandController,
    AdminCategoryController,
    AdminAgenceController,
    AdminMediaController,
    AdminSettingController,
    AdminStatController,
    AdminUserController,
};

/*
|==========================================================================
| API REST FULL — AutoTrack Bénin (Plateforme importation véhicules chinois)
|==========================================================================
| Base URL : /api/v1
| Authentification : Laravel Sanctum (token) pour l'administration.
*/

Route::prefix('v1')->group(function () {

    /* ---- Public : Lecture seule ---- */
    Route::get('/vehicles', [VehicleController::class, 'index']);
    Route::get('/vehicles/{vehicle}', [VehicleController::class, 'show']);
    Route::get('/brands', [BrandController::class, 'index']);
    Route::get('/brands/{brand}', [BrandController::class, 'show']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);
    Route::get('/options', [OptionController::class, 'index']);
    Route::get('/settings', [AdminSettingController::class, 'publicIndex']);
    Route::get('/media/{path}', [MediaController::class, 'show'])->where('path', '.*');
    Route::get('/agences', [AgenceController::class, 'index']);
    Route::get('/agences/{agence}', [AgenceController::class, 'show']);

    /* ---- Public : Précommande & Tracking (création) ---- */
    Route::post('/preorders', [PreorderController::class, 'store']);
    Route::get('/track', [TrackingController::class, 'show'])->middleware('throttle:60,1');

    /* ---- Public : Statistiques de page véhicule ---- */
    Route::post('/vehicles/{vehicle}/page-view', [PageViewController::class, 'store'])
        ->middleware('throttle:180,1');

    /* ---- Admin : Authentification Sanctum ---- */
    Route::post('/admin/login', [AdminAuthController::class, 'login']);
    Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->middleware('auth:sanctum');

    Route::middleware('auth:sanctum')->group(function () {
        /* Catalogue */
        Route::get('/admin/vehicles/statuses', [AdminVehicleController::class, 'statuses']);
        Route::get('/admin/vehicles/energy-types', [AdminVehicleController::class, 'energyTypes']);
        Route::get('/admin/vehicles/transmission-types', [AdminVehicleController::class, 'transmissionTypes']);
        Route::post('/admin/vehicles/{vehicle}/images', [AdminVehicleController::class, 'uploadImages']);
        Route::delete('/admin/vehicles/{vehicle}/images/{image}', [AdminVehicleController::class, 'destroyImage']);
        Route::apiResource('admin/vehicles', AdminVehicleController::class);
        Route::post('/admin/vehicles/{vehicle}/options', [AdminVehicleController::class, 'syncOptions']);
        Route::delete('/admin/vehicles/{vehicle}/options/{option}', [AdminVehicleController::class, 'destroyOption']);

        /* Précommandes */
        Route::get('/admin/preorders', [AdminOrderController::class, 'index']);
        Route::patch('/admin/preorders/{order}', [AdminOrderController::class, 'update']);
        Route::delete('/admin/preorders/{order}', [AdminOrderController::class, 'destroy']);

        /* Tracking / Conteneurs */
        Route::get('/admin/containers', [AdminContainerController::class, 'index']);
        Route::post('/admin/containers', [AdminContainerController::class, 'store']);
        Route::get('/admin/containers/{container}', [AdminContainerController::class, 'show']);
        Route::patch('/admin/containers/{container}', [AdminContainerController::class, 'update']);
        Route::delete('/admin/containers/{container}', [AdminContainerController::class, 'destroy']);
        Route::get('/admin/containers/{container}/events', [AdminContainerController::class, 'events']);
        Route::post('/admin/containers/{container}/events', [AdminContainerController::class, 'storeEvent']);
        Route::delete('/admin/containers/{container}/events/{event}', [AdminContainerController::class, 'destroyEvent']);

        /* Catalogue : Marques & Catégories */
        Route::apiResource('admin/brands', AdminBrandController::class)->except(['create', 'edit']);
        Route::apiResource('admin/categories', AdminCategoryController::class)->except(['create', 'edit']);

        /* Agences */
        Route::apiResource('admin/agences', AdminAgenceController::class)->except(['create', 'edit']);

        /* Médias (upload logo / favicon) */
        Route::post('/admin/media/upload', [AdminMediaController::class, 'upload']);

        /* Paramètres (table admin_settings) */
        Route::get('/admin/settings', [AdminSettingController::class, 'index']);
        Route::patch('/admin/settings', [AdminSettingController::class, 'update']);

        /* Statistiques pages véhicules */
        Route::get('/admin/stats/overview', [AdminStatController::class, 'overview']);
        Route::get('/admin/stats/dashboard', [AdminStatController::class, 'dashboard']);
        Route::get('/admin/stats/vehicles/{vehicle}', [AdminStatController::class, 'vehicle']);

        /* Utilisateurs */
        Route::get('/admin/users/roles', [AdminUserController::class, 'roles']);
        Route::patch('/admin/users/{user}/toggle-block', [AdminUserController::class, 'toggleBlock']);
        Route::apiResource('admin/users', AdminUserController::class)->except(['create', 'edit']);
    });
});