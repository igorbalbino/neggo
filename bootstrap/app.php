<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (ValidationException $exception) {
            return response()->json([
                'success' => false,
                'error' => $exception->validator->errors()->first() ?: 'Validation error.',
                'data' => null,
            ], 422);
        });

        $exceptions->render(function (AuthenticationException $exception) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthenticated.',
                'data' => null,
            ], 401);
        });

        $exceptions->render(function (HttpExceptionInterface $exception) {
            if ($exception->getStatusCode() < 500) {
                return response()->json([
                    'success' => false,
                    'error' => $exception->getMessage() ?: 'Request failed.',
                    'data' => null,
                ], $exception->getStatusCode());
            }
        });
    })->create();
