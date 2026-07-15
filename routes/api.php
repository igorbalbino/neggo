<?php

use App\Http\Controllers\Api\AdController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\IntegrationTokenController;
use App\Http\Controllers\Api\PlanController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\StripeWebhookController;
use App\Http\Controllers\Api\UploadController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:5,1')->group(function (): void {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
});

Route::post('/stripe/webhook', StripeWebhookController::class);

Route::get('/ads', [AdController::class, 'index']);
Route::get('/ads/{ad}', [AdController::class, 'show']);
Route::get('/plans', [PlanController::class, 'index']);

Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function (): void {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::post('/ads', [AdController::class, 'store']);
    Route::post('/ads/{ad}/boost', [AdController::class, 'boost']);
    Route::delete('/ads/{ad}', [AdController::class, 'destroy']);
    Route::get('/my-ads', [AdController::class, 'myAds']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::post('/upload', [UploadController::class, 'store']);

    Route::get('/chats', [ChatController::class, 'index']);
    Route::get('/chats/{chat}/messages', [ChatController::class, 'messages']);
    Route::post('/chats/{chat}/messages', [ChatController::class, 'sendMessage']);

    Route::post('/plans/{plan}/buy', [PlanController::class, 'buy']);

    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/ads/{ad}/favorite', [FavoriteController::class, 'toggle']);

    Route::get('/integrations/scopes', [IntegrationTokenController::class, 'scopes']);
    Route::get('/integrations/tokens', [IntegrationTokenController::class, 'index']);
    Route::post('/integrations/tokens', [IntegrationTokenController::class, 'store']);
    Route::delete('/integrations/tokens/{token}', [IntegrationTokenController::class, 'destroy']);
});
