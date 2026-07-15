<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiResponds;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use App\Models\User;
use App\Models\UserPlan;
use Kreait\Firebase\Factory;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    use ApiResponds;

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', Password::min(8)->mixedCase()->numbers()],
            'phone' => ['nullable', 'string', 'max:30'],
        ]);

        User::create($data);

        return $this->ok(null);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials)) {
            return $this->fail('Invalid credentials.', 401);
        }

        /** @var User $user */
        $user = $request->user();
        $user->tokens()->delete();
        $token = $user->createToken('neggo-session')->plainTextToken;

        $secretFile = (string) env(
            'FIREBASE_CREDENTIALS',
            storage_path('app/private/neggo-cca92-firebase-adminsdk-fbsvc-08a57c1b0c.json')
        );

        try {
            $firebase = (new Factory)
                ->withServiceAccount($secretFile)
                ->createAuth();

            $customChatToken = $firebase->createCustomToken((string) $user->id)->toString();
        } catch (\Throwable $e) {
            return $this->fail('Chat service unavailable.', 503);
        }

        return $this->ok([
            'id' => (string) $user->id,
            'token' => $token,
            'firebaseToken' => $customChatToken,
            'chatToken' => $customChatToken,
            'user' => [
                'id' => (string) $user->id,
                'name' => $user->name,
                'photoUrl' => $user->photo_url,
                'rating' => $user->rating,
                'isPro' => $user->is_pro,
                'phone' => $user->phone,
                'plan' => $this->resolveCurrentPlanName((int) $user->id),
            ],
        ]);
    }

    public function logout(Request $request)
    {
        /** @var PersonalAccessToken|null $token */
        $token = $request->user()?->currentAccessToken();
        if ($token) {
            $token->delete();
        }

        return $this->ok(null);
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
