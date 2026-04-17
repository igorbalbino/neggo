<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiResponds;
use App\Http\Controllers\Controller;

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
        ]);
    }
}
