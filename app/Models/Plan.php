<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'price',
        'ad_limit',
        'benefits',
        'is_active',
        'popular',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'float',
            'benefits' => 'array',
            'is_active' => 'boolean',
            'popular' => 'boolean',
        ];
    }

    public function userPlans(): HasMany
    {
        return $this->hasMany(UserPlan::class);
    }
}
