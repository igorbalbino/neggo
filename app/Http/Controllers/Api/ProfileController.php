<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiResponds;
use App\Http\Controllers\Controller;
use App\Models\UserPlan;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    use ApiResponds;

    public function show()
    {
        $user = auth()->user();

        return $this->ok([
            'id' => (string) $user->id,
            'name' => $user->name,
            'photoUrl' => $user->photo_url,
            'rating' => $user->rating,
            'isPro' => $user->is_pro,
            'phone' => $user->phone,
            'plan' => $this->resolveCurrentPlanName((int) $user->id),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'photoUrl' => ['sometimes', 'nullable', 'string', 'max:2048'],
        ]);

        $user = $request->user();

        if (array_key_exists('name', $data)) {
            $user->name = $data['name'];
        }
        if (array_key_exists('phone', $data)) {
            $user->phone = $data['phone'];
        }
        if (array_key_exists('photoUrl', $data)) {
            $photoUrl = $data['photoUrl'];
            if ($photoUrl !== null && $photoUrl !== '' && ! $this->isAllowedUploadUrl((string) $photoUrl)) {
                return $this->fail('Invalid photo URL.', 422);
            }
            $user->photo_url = $photoUrl;
        }

        $user->save();

        return $this->ok([
            'id' => (string) $user->id,
            'name' => $user->name,
            'photoUrl' => $user->photo_url,
            'rating' => $user->rating,
            'isPro' => $user->is_pro,
            'phone' => $user->phone,
            'plan' => $this->resolveCurrentPlanName((int) $user->id),
        ]);
    }

    private function isAllowedUploadUrl(string $url): bool
    {
        $appUrl = rtrim((string) config('app.url'), '/');
        $legacy = $appUrl.'/img/';
        $storage = $appUrl.'/storage/img/';

        return str_starts_with($url, $storage) || str_starts_with($url, $legacy);
    }

    private function resolveCurrentPlanName(int $userId): string
    {
        $planName = UserPlan::query()
            ->with('plan:id,name')
            ->where('user_id', $userId)
            ->where('status', 'active')
            ->where(function ($query): void {
                $query->whereNull('expires_at')->orWhere('expires_at', '>=', now());
            })
            ->latest('id')
            ->first()
            ?->plan
            ?->name;

        return $planName ?: 'Free';
    }
}
