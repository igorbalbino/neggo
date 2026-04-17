<?php

namespace App\Http\Controllers\Api\Concerns;

use Illuminate\Http\JsonResponse;

trait ApiResponds
{
    protected function ok(mixed $data = null): JsonResponse
    {
        return response()->json([
            'success' => true,
            'error' => false,
            'data' => $data,
        ]);
    }

    protected function fail(string $message, int $status = 400): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error' => $message,
            'data' => null,
        ], $status);
    }
}
