<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicle_page_views', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('vehicle_id')->constrained()->cascadeOnDelete();
            $table->string('view_token', 64)->unique();
            $table->string('visitor_hash', 64)->index();
            $table->unsignedSmallInteger('duration_seconds')->default(0);
            $table->unsignedSmallInteger('clicks')->default(0);
            $table->string('referer_host')->nullable();
            $table->timestamp('viewed_at')->index();
            $table->timestamps();

            $table->index(['vehicle_id', 'viewed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_page_views');
    }
};
