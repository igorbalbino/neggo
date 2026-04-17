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

        $session = Session::create([
            'mode' => 'payment',
            'line_items' => [[
                'price_data' => [
                    'currency' => env('STRIPE_CURRENCY', 'usd'),
                    'product_data' => ['name' => 'Neggo '.$plan->name],
                    'unit_amount' => (int) round($plan->price * 100),
                ],
                'quantity' => 1,
            ]],
            'success_url' => env('FRONTEND_URL', 'http://localhost:5173').'/plans?success=1',
            'cancel_url' => env('FRONTEND_URL', 'http://localhost:5173').'/plans?cancelled=1',
        ]);

        UserPlan::create([
            'user_id' => $request->user()->id,
            'plan_id' => $plan->id,
            'stripe_session_id' => $session->id,
            'status' => 'active',
            'starts_at' => now(),
            'expires_at' => now()->addDays((int) env('PLAN_DURATION_DAYS', 30)),
        ]);

        $request->user()->update(['is_pro' => true]);

        return $this->ok(['success' => true, 'checkoutUrl' => $session->url]);
    }
}
