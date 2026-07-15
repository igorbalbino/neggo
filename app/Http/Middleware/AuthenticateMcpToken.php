<?php

namespace App\Http\Middleware;

use App\Models\AgentAccessToken;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateMcpToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $plain = $request->bearerToken();

        if (! is_string($plain) || $plain === '') {
            return response()->json([
                'success' => false,
                'error' => 'Missing Bearer token.',
                'data' => null,
            ], 401);
        }

        $token = AgentAccessToken::findValidByPlainToken($plain);

        if (! $token) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid or expired agent token.',
                'data' => null,
            ], 401);
        }

        $user = $token->user;
        if (! $user) {
            return response()->json([
                'success' => false,
                'error' => 'Token owner not found.',
                'data' => null,
            ], 401);
        }

        $token->touchLastUsed();

        Auth::setUser($user);
        $request->setUserResolver(static fn () => $user);
        $request->attributes->set('mcp_token', $token);

        return $next($request);
    }
}
