<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('preorders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('reference')->unique();
            $table->foreignUuid('vehicle_id')->nullable()->constrained('vehicles')->nullOnDelete();
            $table->string('client_name');
            $table->string('phone');
            $table->string('dial')->default('+229');
            $table->string('email')->nullable();
            $table->string('city')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('base_price')->default(0);
            $table->longText('options')->nullable();
            $table->string('status')->default('Nouvelle demande');
            $table->string('container_code')->nullable();
            $table->timestamps();

            $table->index(['status']);
            $table->index(['created_at']);
        });
    }

    public function down(): void
    {
        Schema::table('preorders', function (Blueprint $table) {
            $table->dropForeign(['vehicle_id']);
        });
        Schema::dropIfExist('preorders');
    }
};