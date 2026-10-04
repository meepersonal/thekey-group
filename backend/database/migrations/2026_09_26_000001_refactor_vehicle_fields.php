<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn('battery');
            $table->dropColumn('images');
            $table->renameColumn('seats', 'nombre_places');
            $table->unsignedTinyInteger('nombre_places')->change();
        });

        Schema::create('vehicle_images', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('vehicle_id')->constrained()->cascadeOnDelete();
            $table->string('image');
            $table->timestamp('uploaded_at')->nullable();
            $table->timestamps();
            $table->index(['vehicle_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_images');

        Schema::table('vehicles', function (Blueprint $table) {
            $table->string('battery')->nullable();
            $table->longText('images')->nullable();
            $table->unsignedSmallInteger('nombre_places')->default(5)->change();
            $table->renameColumn('nombre_places', 'seats');
        });
    }
};
