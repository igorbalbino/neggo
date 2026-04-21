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

class AuthController extends Controller
{
    use ApiResponds;

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', Password::min(8)],
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
        $token = $user->createToken('neggo-session')->plainTextToken;
		
		// $secret_file = base_path()."\\neggo-cca92-firebase-adminsdk-fbsvc-08a57c1b0c.json";
		$secret_file = storage_path('app/private/neggo-cca92-firebase-adminsdk-fbsvc-08a57c1b0c.json');
    
		$firebase = (new Factory)
			->withServiceAccount($secret_file)
			->createAuth();

		$customChatToken = $firebase->createCustomToken((string) $user->id);
		$customChatToken = $customChatToken->toString();

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
