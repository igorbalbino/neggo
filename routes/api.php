<?php

use App\Http\Controllers\Api\AdController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\PlanController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/ads', [AdController::class, 'index']);
Route::get('/ads/{ad}', [AdController::class, 'show']);
Route::get('/plans', [PlanController::class, 'index']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/ads', [AdController::class, 'store']);
    Route::post('/ads/{ad}/boost', [AdController::class, 'boost']);

    Route::get('/profile', [ProfileController::class, 'show']);

    Route::get('/chats', [ChatController::class, 'index']);
    Route::get('/chats/{chat}/messages', [ChatController::class, 'messages']);
    Route::post('/chats/{chat}/messages', [ChatController::class, 'sendMessage']);

    Route::post('/plans/{plan}/buy', [PlanController::class, 'buy']);
});
