<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiResponds;
use App\Http\Controllers\Controller;
use App\Mcp\McpCatalog;
use App\Models\AgentAccessToken;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class IntegrationTokenController extends Controller
{
    use ApiResponds;

    public function scopes()
    {
        return $this->ok(McpCatalog::scopes());
    }

    public function index(Request $request)
    {
        $tokens = AgentAccessToken::query()
            ->where('user_id', $request->user()->id)
            ->whereNull('revoked_at')
            ->latest('id')
            ->get()
            ->map(fn (AgentAccessToken $token) => $token->toPublicArray())
            ->values();

        return $this->ok($tokens);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'scopes' => ['required', 'array', 'min:1'],
            'scopes.*' => ['required', 'string', Rule::in(McpCatalog::scopeIds())],
        ]);

        $scopes = array_values(array_unique($data['scopes']));

        $issued = AgentAccessToken::issue(
            (int) $request->user()->id,
            $data['name'],
            $scopes
        );

        /** @var AgentAccessToken $model */
        $model = $issued['model'];

        return $this->ok([
            'token' => $issued['plain'],
            'expiresAt' => $model->expires_at?->toIso8601String(),
            'expiresInDays' => AgentAccessToken::EXPIRY_DAYS,
            'integration' => $model->toPublicArray(),
            'warning' => 'Copy this token now. It will not be shown again.',
        ]);
    }

    public function destroy(Request $request, AgentAccessToken $token)
    {
        if ((int) $token->user_id !== (int) $request->user()->id) {
            return $this->fail('Token not found.', 404);
        }

        if ($token->revoked_at === null) {
            $token->revoke();
        }

        return $this->ok(null);
    }
}
