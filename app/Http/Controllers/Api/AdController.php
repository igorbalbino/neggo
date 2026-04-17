<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiResponds;
use App\Http\Controllers\Controller;
use App\Models\Ad;
use App\Models\AdBoost;
use Illuminate\Http\Request;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class AdController extends Controller
{
    use ApiResponds;

    public function index()
    {
        $ads = Ad::query()
            ->with('seller')
            ->where('status', 'active')
            ->orderByDesc('is_boosted')
            ->latest()
            ->get()
            ->map(fn (Ad $ad) => $this->transformAd($ad));

        return $this->ok($ads);
    }

    public function show(Ad $ad)
    {
        $ad->load('seller');

        return $this->ok($this->transformAd($ad));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['nullable'],
            'isNational' => ['required', 'boolean'],
            'locations' => ['nullable', 'array'],
            'type' => ['required', 'in:product,service'],
            'category' => ['required', 'string', 'max:100'],
            'images' => ['nullable', 'array'],
            'condition' => ['nullable', 'in:new,used'],
            'serviceType' => ['nullable', 'in:remote,in_person'],
        ]);

        $ad = Ad::create([
            'seller_id' => $request->user()->id,
            'title' => $data['title'],
            'description' => $data['description'],
            'price' => is_numeric($data['price'] ?? null) ? (float) $data['price'] : null,
            'is_negotiable' => ($data['price'] ?? null) === 'negotiable',
            'is_national' => $data['isNational'],
            'locations' => $data['locations'] ?? [],
            'type' => $data['type'],
            'category' => $data['category'],
            'images' => $data['images'] ?? [],
            'condition' => $data['condition'] ?? null,
            'service_type' => $data['serviceType'] ?? null,
        ]);

        $ad->load('seller');

        return $this->ok($this->transformAd($ad));
    }

    public function boost(Request $request, Ad $ad)
    {
        if ((int) $ad->seller_id !== (int) $request->user()->id) {
            return $this->fail('Only the ad owner can boost this ad.', 403);
        }

        Stripe::setApiKey((string) env('STRIPE_SECRET_KEY'));

        $session = Session::create([
            'mode' => 'payment',
            'line_items' => [[
                'price_data' => [
                    'currency' => env('STRIPE_CURRENCY', 'usd'),
                    'product_data' => ['name' => 'Neggo ad boost'],
                    'unit_amount' => (int) env('AD_BOOST_PRICE_CENTS', 990),
                ],
                'quantity' => 1,
            ]],
            'success_url' => env('FRONTEND_URL', 'http://localhost:5173').'/plans?boost=success',
            'cancel_url' => env('FRONTEND_URL', 'http://localhost:5173').'/plans?boost=cancelled',
        ]);

        AdBoost::create([
            'ad_id' => $ad->id,
            'user_id' => $request->user()->id,
            'stripe_session_id' => $session->id,
            'status' => 'created',
            'starts_at' => now(),
            'ends_at' => now()->addDays((int) env('AD_BOOST_DURATION_DAYS', 7)),
        ]);

        $ad->update(['is_boosted' => true]);

        return $this->ok(['success' => true, 'checkoutUrl' => $session->url]);
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
                'phone' => $ad->seller->phone,
            ] : null,
        ];
    }
}
