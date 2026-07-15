<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiResponds;
use App\Http\Controllers\Controller;
use App\Models\Ad;
use App\Models\AdBoost;
use App\Models\UserPlan;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class AdController extends Controller
{
    use ApiResponds;

    public function index()
    {
        $this->expireBoosts();

        $ads = Ad::query()
            ->with('seller')
            ->where('status', 'active')
            ->orderByDesc('is_boosted')
            ->latest()
            ->get()
            ->map(fn (Ad $ad) => $this->transformAd($ad));

        return $this->ok($ads);
    }

    public function myAds(Request $request)
    {
        $ads = Ad::query()
            ->with('seller')
            ->where('seller_id', $request->user()->id)
            ->latest()
            ->get()
            ->map(fn (Ad $ad) => $this->transformAd($ad));

        return $this->ok($ads);
    }

    public function show(Request $request, Ad $ad)
    {
        if ($ad->status !== 'active') {
            $token = $request->bearerToken();
            $ownerId = null;
            if ($token) {
                $accessToken = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
                $ownerId = $accessToken?->tokenable?->id;
            }

            if ((int) $ownerId !== (int) $ad->seller_id) {
                return $this->fail('Ad not found.', 404);
            }
        }

        $ad->load('seller');

        return $this->ok($this->transformAd($ad));
    }

    public function store(Request $request)
    {
        $limit = $this->resolveAdLimitForUser((int) $request->user()->id);
        if ($limit !== null) {
            $activeCount = Ad::query()
                ->where('seller_id', $request->user()->id)
                ->where('status', 'active')
                ->count();

            if ($activeCount >= $limit) {
                return $this->fail("Você atingiu o limite de anúncios do seu plano ({$limit}). Faça upgrade para publicar mais.", 403);
            }
        }

        try {
            $data = $request->validate([
                'title' => ['required', 'string', 'max:255'],
                'description' => ['required', 'string'],
                'price' => ['nullable'],
                'isNational' => ['required', 'boolean'],
                'locations' => ['nullable', 'array'],
                'type' => ['required', 'in:product,service'],
                'category' => ['required', 'string', 'max:100'],
                'images' => ['nullable', 'array'],
                'images.*' => ['string', 'max:2048'],
                'condition' => ['nullable', 'in:new,used'],
                'serviceType' => ['nullable', 'in:remote,in_person'],
            ]);
        } catch (ValidationException $e) {
            return $this->fail($e->getMessage(), 422);
        }

        foreach ($data['images'] ?? [] as $imageUrl) {
            if (! $this->isAllowedUploadUrl((string) $imageUrl)) {
                return $this->fail('Invalid image URL.', 422);
            }
        }

        $ad = new Ad([
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
        $ad->seller_id = $request->user()->id;
        $ad->save();
        $ad->load('seller');

        return $this->ok($this->transformAd($ad));
    }

    private function resolveAdLimitForUser(int $userId): ?int
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

        $planName = $planName ?: 'Free';

        $key = mb_strtolower(trim($planName));

        return match ($key) {
            'free' => 2,
            'essencial' => 5,
            'profissional' => 25,
            'empresarial' => null,
            default => 2,
        };
    }

    public function destroy(Request $request, Ad $ad)
    {
        if ((int) $ad->seller_id !== (int) $request->user()->id) {
            return $this->fail('Only the ad owner can delete this ad.', 403);
        }

        $ad->delete();

        return $this->ok(null);
    }

    public function boost(Request $request, Ad $ad)
    {
        if ((int) $ad->seller_id !== (int) $request->user()->id) {
            return $this->fail('Only the ad owner can boost this ad.', 403);
        }

        Stripe::setApiKey((string) env('STRIPE_SECRET_KEY'));

        $user = $request->user();

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
            'client_reference_id' => (string) $user->id,
            'customer_email' => $user->email,
            'metadata' => [
                'kind' => 'boost',
                'user_id' => (string) $user->id,
                'ad_id' => (string) $ad->id,
            ],
        ]);

        AdBoost::create([
            'ad_id' => $ad->id,
            'user_id' => $user->id,
            'stripe_session_id' => $session->id,
            'status' => 'pending',
            'starts_at' => null,
            'ends_at' => null,
        ]);

        return $this->ok(['success' => true, 'checkoutUrl' => $session->url]);
    }

    private function expireBoosts(): void
    {
        $expiredAdIds = AdBoost::query()
            ->whereNotNull('ends_at')
            ->where('ends_at', '<', now())
            ->whereIn('status', ['paid', 'active', 'created'])
            ->pluck('ad_id')
            ->unique()
            ->all();

        if ($expiredAdIds === []) {
            return;
        }

        AdBoost::query()
            ->whereIn('ad_id', $expiredAdIds)
            ->whereNotNull('ends_at')
            ->where('ends_at', '<', now())
            ->whereIn('status', ['paid', 'active', 'created'])
            ->update(['status' => 'expired']);

        foreach ($expiredAdIds as $adId) {
            $stillActive = AdBoost::query()
                ->where('ad_id', $adId)
                ->whereIn('status', ['paid', 'active'])
                ->where(function ($query): void {
                    $query->whereNull('ends_at')->orWhere('ends_at', '>=', now());
                })
                ->exists();

            if (! $stillActive) {
                Ad::query()->whereKey($adId)->update(['is_boosted' => false]);
            }
        }
    }

    private function isAllowedUploadUrl(string $url): bool
    {
        $appUrl = rtrim((string) config('app.url'), '/');
        $legacy = $appUrl.'/img/';
        $storage = $appUrl.'/storage/img/';

        return str_starts_with($url, $storage) || str_starts_with($url, $legacy);
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
