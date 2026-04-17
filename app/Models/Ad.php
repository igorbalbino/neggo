<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ad extends Model
{
    protected $fillable = [
        'seller_id',
        'title',
        'description',
        'price',
        'is_negotiable',
        'is_national',
        'locations',
        'images',
        'type',
        'category',
        'condition',
        'service_type',
        'is_boosted',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'float',
            'is_negotiable' => 'boolean',
            'is_national' => 'boolean',
            'locations' => 'array',
            'images' => 'array',
            'is_boosted' => 'boolean',
        ];
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function boosts(): HasMany
    {
        return $this->hasMany(AdBoost::class);
    }
}
