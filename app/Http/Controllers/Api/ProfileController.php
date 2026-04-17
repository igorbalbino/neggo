<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiResponds;
use App\Http\Controllers\Controller;
use App\Models\UserPlan;

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
