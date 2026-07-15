<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ad;
use App\Models\AdBoost;
use App\Models\User;
use App\Models\UserPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;
use UnexpectedValueException;

class StripeWebhookController extends Controller
{
    public function __invoke(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = (string) $request->header('Stripe-Signature');
        $secret = (string) env('STRIPE_WEBHOOK_SECRET');

        if ($secret === '') {
            Log::error('Stripe webhook secret not configured.');

            return response()->json(['error' => 'Webhook not configured.'], 500);
        }

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (UnexpectedValueException $e) {
            return response()->json(['error' => 'Invalid payload.'], 400);
        } catch (SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature.'], 400);
        }

        $type = $event->type;
        $object = $event->data->object;

        if ($type === 'checkout.session.completed') {
            $this->handleCheckoutCompleted($object);
        }

        if ($type === 'customer.subscription.deleted') {
            $this->handleSubscriptionDeleted($object);
        }

        return response()->json(['received' => true]);
    }

    private function handleCheckoutCompleted(object $session): void
    {
        $sessionId = (string) ($session->id ?? '');
        $metadata = $this->metadataToArray($session->metadata ?? null);
        $kind = (string) ($metadata['kind'] ?? '');
        $mode = (string) ($session->mode ?? '');

        if ($kind === 'plan' || $mode === 'subscription') {
            $this->activatePlan($sessionId, $metadata, $session);

            return;
        }

        if ($kind === 'boost' || $mode === 'payment') {
            $this->activateBoost($sessionId, $metadata, $session);
        }
    }

    private function metadataToArray(mixed $metadata): array
    {
        if ($metadata === null) {
            return [];
        }

        if (is_array($metadata)) {
            return $metadata;
        }

        if (is_object($metadata) && method_exists($metadata, 'toArray')) {
            return $metadata->toArray();
        }

        return (array) $metadata;
    }

    private function activatePlan(string $sessionId, array $metadata, object $session): void
    {
        $userPlan = UserPlan::query()
            ->where('stripe_session_id', $sessionId)
            ->first();

        if (! $userPlan) {
            $userId = (int) ($metadata['user_id'] ?? 0);
            $planId = (int) ($metadata['plan_id'] ?? 0);
            if ($userId <= 0 || $planId <= 0) {
                return;
            }

            $userPlan = UserPlan::query()->create([
                'user_id' => $userId,
                'plan_id' => $planId,
                'stripe_session_id' => $sessionId,
                'status' => 'pending',
                'starts_at' => null,
                'expires_at' => null,
            ]);
        }

        if ($userPlan->status === 'active') {
            return;
        }

        UserPlan::query()
            ->where('user_id', $userPlan->user_id)
            ->where('id', '!=', $userPlan->id)
            ->where('status', 'active')
            ->update(['status' => 'cancelled']);

        $days = (int) env('PLAN_DURATION_DAYS', 30);

        $userPlan->status = 'active';
        $userPlan->starts_at = now();
        $userPlan->expires_at = $days > 0 ? now()->addDays($days) : null;
        if (! empty($session->payment_intent)) {
            $paymentIntent = $session->payment_intent;
            $userPlan->stripe_payment_intent_id = is_object($paymentIntent)
                ? (string) ($paymentIntent->id ?? '')
                : (string) $paymentIntent;
        }
        $userPlan->save();

        User::query()->whereKey($userPlan->user_id)->update(['is_pro' => true]);
    }

    private function activateBoost(string $sessionId, array $metadata, object $session): void
    {
        $boost = AdBoost::query()
            ->where('stripe_session_id', $sessionId)
            ->first();

        if (! $boost) {
            $adId = (int) ($metadata['ad_id'] ?? 0);
            $userId = (int) ($metadata['user_id'] ?? 0);
            if ($adId <= 0 || $userId <= 0) {
                return;
            }

            $boost = AdBoost::query()->create([
                'ad_id' => $adId,
                'user_id' => $userId,
                'stripe_session_id' => $sessionId,
                'status' => 'pending',
                'starts_at' => null,
                'ends_at' => null,
            ]);
        }

        if (in_array($boost->status, ['paid', 'active'], true)) {
            return;
        }

        $days = (int) env('AD_BOOST_DURATION_DAYS', 7);

        $boost->status = 'paid';
        $boost->starts_at = now();
        $boost->ends_at = now()->addDays($days);
        if (! empty($session->payment_intent)) {
            $paymentIntent = $session->payment_intent;
            $boost->stripe_payment_intent_id = is_object($paymentIntent)
                ? (string) ($paymentIntent->id ?? '')
                : (string) $paymentIntent;
        }
        $boost->save();

        Ad::query()->whereKey($boost->ad_id)->update(['is_boosted' => true]);
    }

    private function handleSubscriptionDeleted(object $subscription): void
    {
        // Soft revoke: mark related active user plans cancelled when we only have session linkage.
        // Without customer/subscription IDs stored, use metadata if present.
        $metadata = $this->metadataToArray($subscription->metadata ?? null);
        $userId = (int) ($metadata['user_id'] ?? 0);

        if ($userId <= 0) {
            return;
        }

        UserPlan::query()
            ->where('user_id', $userId)
            ->where('status', 'active')
            ->update(['status' => 'cancelled']);

        $stillActive = UserPlan::query()
            ->where('user_id', $userId)
            ->where('status', 'active')
            ->where(function ($query): void {
                $query->whereNull('expires_at')->orWhere('expires_at', '>=', now());
            })
            ->exists();

        if (! $stillActive) {
            User::query()->whereKey($userId)->update(['is_pro' => false]);
        }
    }
}
