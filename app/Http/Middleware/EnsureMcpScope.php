<?php

namespace App\Http\Middleware;

use App\Models\AgentAccessToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMcpScope
{
    public function handle(Request $request, Closure $next, string $scope): Response
    {
        /** @var AgentAccessToken|null $token */
        $token = $request->attributes->get('mcp_token');

        if (! $token instanceof AgentAccessToken || ! $token->hasScope($scope)) {
            return response()->json([
                'success' => false,
                'error' => "Missing required scope: {$scope}",
                'data' => null,
            ], 403);
        }

        return $next($request);
    }
}
