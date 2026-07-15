<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiResponds;
use App\Http\Controllers\Controller;
use App\Models\Ad;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    use ApiResponds;

    public function index(Request $request)
    {
        $userId = (int) $request->user()->id;

        $ads = Ad::query()
            ->with('seller')
            ->whereIn('id', Favorite::query()->where('user_id', $userId)->select('ad_id'))
            ->latest()
            ->get()
            ->map(fn (Ad $ad) => $this->transformAd($ad));

        return $this->ok($ads);
    }

    public function toggle(Request $request, Ad $ad)
    {
        $userId = (int) $request->user()->id;

        $existing = Favorite::query()
            ->where('user_id', $userId)
            ->where('ad_id', (int) $ad->id)
            ->first();

        if ($existing) {
            $existing->delete();

            return $this->ok(null);
        }

        Favorite::create([
            'user_id' => $userId,
            'ad_id' => (int) $ad->id,
        ]);

        return $this->ok(null);
    }

    private function transformAd(Ad $ad): array
    {
        return [
            'id' => (string) $ad->id,
            'title' => $ad->title,
            'description' => $ad->description,
            'price' => $ad->is_negotiable ? 'negotiable' : (float) $ad->price,
            'isNational' => $ad->is_national,
            'locations' => $ad->locations ?? [],
            'type' => $ad->type,
            'category' => $ad->category,
            'images' => $ad->images ?? [],
            'sellerId' => (string) $ad->seller_id,
            'condition' => $ad->condition,
            'serviceType' => $ad->service_type,
            'isBoosted' => $ad->is_boosted,
            'status' => $ad->status,
            'createdAt' => $ad->created_at?->toIso8601String(),
            'seller' => $ad->seller ? [
                'id' => (string) $ad->seller->id,
                'name' => $ad->seller->name,
                'photoUrl' => $ad->seller->photo_url,
                'rating' => $ad->seller->rating,
                'isPro' => $ad->seller->is_pro,
            ] : null,
        ];
    }
}

