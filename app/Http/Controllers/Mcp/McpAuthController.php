<?php

namespace App\Http\Controllers\Mcp;

use App\Http\Controllers\Api\Concerns\ApiResponds;
use App\Http\Controllers\Controller;
use App\Mcp\McpCatalog;
use App\Models\AgentAccessToken;
use Illuminate\Http\Request;

class McpAuthController extends Controller
{
    use ApiResponds;

    public function auth(Request $request)
    {
        /** @var AgentAccessToken $token */
        $token = $request->attributes->get('mcp_token');
        $user = $request->user();

        $scopes = $token->scopes ?? [];

        return $this->ok([
            'user' => [
                'id' => (string) $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'token' => [
                'name' => $token->name,
                'prefix' => $token->token_prefix,
                'expiresAt' => $token->expires_at?->toIso8601String(),
                'scopes' => $scopes,
            ],
            'scopes' => $scopes,
            'capabilities' => McpCatalog::capabilitiesForScopes($scopes),
            'baseUrl' => rtrim((string) config('app.url'), '/').'/mcp',
            'authHeader' => 'Authorization: Bearer <token>',
            'responseFormat' => [
                'success' => 'boolean',
                'error' => 'string|false',
                'data' => 'mixed',
            ],
        ]);
    }
}
