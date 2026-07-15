<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class AgentAccessToken extends Model
{
    public const TOKEN_PREFIX = 'ngo_';

    public const EXPIRY_DAYS = 60;

    protected $fillable = [
        'user_id',
        'name',
        'token_hash',
        'token_prefix',
        'scopes',
        'expires_at',
        'last_used_at',
        'revoked_at',
    ];

    protected function casts(): array
    {
        return [
            'scopes' => 'array',
            'expires_at' => 'datetime',
            'last_used_at' => 'datetime',
            'revoked_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isValid(): bool
    {
        if ($this->revoked_at !== null) {
            return false;
        }

        return $this->expires_at !== null && $this->expires_at->isFuture();
    }

    public function hasScope(string $scope): bool
    {
        return in_array($scope, $this->scopes ?? [], true);
    }

    /**
     * @return array{plain: string, model: self}
     */
    public static function issue(int $userId, string $name, array $scopes): array
    {
        $random = Str::lower(Str::random(40));
        $plain = self::TOKEN_PREFIX.$random;
        $prefix = substr($plain, 0, 12);

        $model = self::query()->create([
            'user_id' => $userId,
            'name' => $name,
            'token_hash' => hash('sha256', $plain),
            'token_prefix' => $prefix,
            'scopes' => array_values($scopes),
            'expires_at' => now()->addDays(self::EXPIRY_DAYS),
        ]);

        return ['plain' => $plain, 'model' => $model];
    }

    public static function findValidByPlainToken(string $plain): ?self
    {
        $hash = hash('sha256', $plain);

        /** @var self|null $token */
        $token = self::query()
            ->where('token_hash', $hash)
            ->whereNull('revoked_at')
            ->where('expires_at', '>', now())
            ->first();

        return $token;
    }

    public function touchLastUsed(): void
    {
        $this->forceFill(['last_used_at' => now()])->save();
    }

    public function revoke(): void
    {
        $this->forceFill(['revoked_at' => now()])->save();
    }

    public function toPublicArray(): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'tokenPrefix' => $this->token_prefix,
            'scopes' => $this->scopes ?? [],
            'expiresAt' => $this->expires_at?->toIso8601String(),
            'lastUsedAt' => $this->last_used_at?->toIso8601String(),
            'revokedAt' => $this->revoked_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
