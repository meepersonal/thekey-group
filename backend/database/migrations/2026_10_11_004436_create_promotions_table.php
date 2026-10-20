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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('variant')->default('promo'); // promo | shipping | info
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('badge')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->string('cta_label');
            $table->string('cta_href');
            $table->integer('priority')->default(1);
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->index(['active', 'expires_at']);
            $table->index('priority');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
