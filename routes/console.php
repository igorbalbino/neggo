<?php

use App\Models\Ad;
use App\Models\AdBoost;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function (): void {
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
})->daily()->name('expire-ad-boosts');
