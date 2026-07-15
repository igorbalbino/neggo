<?php

use App\Http\Controllers\Api\AdController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\PlanController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Mcp\McpAuthController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth.mcp', 'throttle:60,1'])->group(function (): void {
    Route::post('/auth', [McpAuthController::class, 'auth']);

    Route::middleware('mcp.scope:ads.read')->group(function (): void {
        Route::get('/ads', [AdController::class, 'index']);
        Route::get('/ads/{ad}', [AdController::class, 'show']);
    });

    Route::middleware('mcp.scope:ads.write')->group(function (): void {
        Route::post('/ads', [AdController::class, 'store']);
        Route::delete('/ads/{ad}', [AdController::class, 'destroy']);
    });

    Route::middleware('mcp.scope:ads.boost')->group(function (): void {
        Route::post('/ads/{ad}/boost', [AdController::class, 'boost']);
    });

    Route::middleware('mcp.scope:my_ads.read')->group(function (): void {
        Route::get('/my-ads', [AdController::class, 'myAds']);
    });

    Route::middleware('mcp.scope:favorites.read')->group(function (): void {
        Route::get('/favorites', [FavoriteController::class, 'index']);
    });

    Route::middleware('mcp.scope:favorites.write')->group(function (): void {
        Route::post('/ads/{ad}/favorite', [FavoriteController::class, 'toggle']);
    });

    Route::middleware('mcp.scope:profile.read')->group(function (): void {
        Route::get('/profile', [ProfileController::class, 'show']);
    });

    Route::middleware('mcp.scope:profile.write')->group(function (): void {
        Route::put('/profile', [ProfileController::class, 'update']);
    });

    Route::middleware('mcp.scope:plans.read')->group(function (): void {
        Route::get('/plans', [PlanController::class, 'index']);
    });

    Route::middleware('mcp.scope:chats.read')->group(function (): void {
        Route::get('/chats', [ChatController::class, 'index']);
        Route::get('/chats/{chat}/messages', [ChatController::class, 'messages']);
    });

    Route::middleware('mcp.scope:chats.write')->group(function (): void {
        Route::post('/chats/{chat}/messages', [ChatController::class, 'sendMessage']);
    });
});
