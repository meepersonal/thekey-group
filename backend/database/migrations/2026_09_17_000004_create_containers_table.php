<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('containers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();
            $table->string('vessel')->nullable();
            $table->string('carrier')->nullable();
            $table->string('port_depart')->nullable();
            $table->string('port_arrivee')->nullable()->default('Cotonou, Bénin');
            $table->string('departure_date')->nullable();
            $table->string('eta')->nullable();
            $table->unsignedTinyInteger('stage')->default(0);
            $table->string('client')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();

            $table->index(['stage']);
            $table->index(['eta']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExist('containers');
    }
};