<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicle_options', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('vehicle_id')->constrained('vehicles')->cascadeOnDelete();
            $table->string('label');
            $table->integer('price')->default(0);
            $table->string('option_key')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_options', function (Blueprint $table) {
            $table->dropForeign(['vehicle_id']);
        });
        Schema::dropIfExist('vehicle_options');
    }
};