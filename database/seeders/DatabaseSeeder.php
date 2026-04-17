<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '+595981000000',
            'is_pro' => false,
        ]);

        Plan::query()->insert([
            [
                'name' => 'Starter',
                'price' => 9.9,
                'ad_limit' => 15,
                'benefits' => json_encode(['Basic visibility', 'Chat support']),
                'is_active' => true,
                'popular' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pro',
                'price' => 29.9,
                'ad_limit' => 80,
                'benefits' => json_encode(['Boosted ranking', 'Priority listing', 'Priority support']),
                'is_active' => true,
                'popular' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Business',
                'price' => 69.9,
                'ad_limit' => 500,
                'benefits' => json_encode(['Unlimited boosts', 'Team access', 'Dedicated support']),
                'is_active' => true,
                'popular' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
