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
        Stripe::setApiKey((string) env('STRIPE_SECRET_KEY'));

        $priceId = $this->resolveStripePriceIdForPlan($plan);
        if (!$priceId) {
            return $this->fail('Stripe price ID não configurado para este plano.', 500);
        }

        $session = Session::create([
            'mode' => 'subscription',
            'line_items' => [[
                'price' => $priceId,
                'quantity' => 1,
            ]],
            'success_url' => env('FRONTEND_URL', 'http://localhost:5173').'/plans?success=1',
            'cancel_url' => env('FRONTEND_URL', 'http://localhost:5173').'/plans?cancelled=1',
        ]);

        UserPlan::create([
            'user_id' => $request->user()->id,
            'plan_id' => $plan->id,
            'stripe_session_id' => $session->id,
            // Nota: ideal seria ativar via webhook; por ora deixamos ativo para destravar o app.
            'status' => 'active',
            'starts_at' => now(),
            'expires_at' => null,
        ]);

        $request->user()->update(['is_pro' => true]);

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
