<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiResponds;
use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\UserPlan;
use Illuminate\Http\Request;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class PlanController extends Controller
{
    use ApiResponds;

    public function index(Request $request)
    {
        $userId = $request->user()?->id;
        $activePlanId = null;

        if ($userId) {
            $activePlanId = UserPlan::query()
                ->where('user_id', $userId)
                ->where('status', 'active')
                ->where(function ($query): void {
                    $query->whereNull('expires_at')->orWhere('expires_at', '>=', now());
                })
                ->latest('id')
                ->value('plan_id');
        }

        $plans = Plan::query()
            ->where('is_active', true)
            ->orderBy('price')
            ->get()
            ->map(fn (Plan $plan) => [
                'id' => (string) $plan->id,
                'name' => $plan->name,
                'price' => (float) $plan->price,
                'adLimit' => $plan->ad_limit,
                'benefits' => $plan->benefits ?? [],
                'isCurrent' => (int) $activePlanId === (int) $plan->id,
                'popular' => $plan->popular,
            ]);

        return $this->ok($plans);
    }

    public function buy(Request $request, Plan $plan)
    {
        if (! $plan->is_active) {
            return $this->fail('Plan not available.', 404);
        }

        Stripe::setApiKey((string) env('STRIPE_SECRET_KEY'));

        $priceId = $this->resolveStripePriceIdForPlan($plan);
        if (!$priceId) {
            return $this->fail('Stripe price ID não configurado para este plano.', 500);
        }

        $user = $request->user();

        $session = Session::create([
            'mode' => 'subscription',
            'line_items' => [[
                'price' => $priceId,
                'quantity' => 1,
            ]],
            'success_url' => env('FRONTEND_URL', 'http://localhost:5173').'/plans?success=1',
            'cancel_url' => env('FRONTEND_URL', 'http://localhost:5173').'/plans?cancelled=1',
            'client_reference_id' => (string) $user->id,
            'customer_email' => $user->email,
            'metadata' => [
                'kind' => 'plan',
                'user_id' => (string) $user->id,
                'plan_id' => (string) $plan->id,
            ],
            'subscription_data' => [
                'metadata' => [
                    'user_id' => (string) $user->id,
                    'plan_id' => (string) $plan->id,
                ],
            ],
        ]);

        UserPlan::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'stripe_session_id' => $session->id,
            'status' => 'pending',
            'starts_at' => null,
            'expires_at' => null,
        ]);

        return $this->ok(['success' => true, 'checkoutUrl' => $session->url]);
    }

    private function resolveStripePriceIdForPlan(Plan $plan): ?string
    {
        // Configure estes IDs no .env (Stripe Dashboard -> Products -> Pricing).
        // Ex.: STRIPE_PRICE_ID_ESSENCIAL=price_...
        $normalized = mb_strtoupper(preg_replace('/[^a-z0-9]+/i', '_', trim((string) $plan->name)));
        $key = "STRIPE_PRICE_ID_{$normalized}";

        $value = env($key);

        return is_string($value) && $value !== '' ? $value : null;
    }
}
