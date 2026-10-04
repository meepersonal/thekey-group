<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('slug')->unique();
            $table->string('brand');
            $table->string('model');
            $table->string('category');
            $table->string('condition')->default('Neuf');
            $table->year('year');
            $table->unsignedBigInteger('mileage_km')->default(0);
            $table->string('energy');
            $table->string('transmission');
            $table->unsignedSmallInteger('seats')->default(5);
            $table->string('engine');
            $table->string('battery')->nullable();
            $table->string('consumption')->nullable();
            $table->unsignedBigInteger('price_fcfa')->default(0);
            $table->string('badge')->nullable();
            $table->string('status')->default('En Stock');
            $table->boolean('featured')->default(false);
            $table->longText('highlights')->nullable();
            $table->longText('images')->nullable();
            $table->timestamps();

            $table->index(['category', 'status']);
            $table->index(['brand']);
            $table->index(['model']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExist('vehicles');
    }
};