<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 12, 2)->nullable();
            $table->boolean('is_negotiable')->default(false);
            $table->boolean('is_national')->default(false);
            $table->json('locations')->nullable();
            $table->json('images')->nullable();
            $table->enum('type', ['product', 'service']);
            $table->string('category');
            $table->enum('condition', ['new', 'used'])->nullable();
            $table->enum('service_type', ['remote', 'in_person'])->nullable();
            $table->boolean('is_boosted')->default(false);
            $table->enum('status', ['active', 'sold', 'cancelled'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ads');
    }
};
