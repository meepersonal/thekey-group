<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('container_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('container_code', 60);
            $table->unsignedTinyInteger('stage')->default(0);
            $table->date('event_date')->nullable();
            $table->string('location', 150)->nullable();
            $table->text('comments')->nullable();
            $table->uuid('created_by')->nullable();
            $table->timestamps();

            $table->index(['container_code', 'stage']);
            $table->index(['event_date']);

            $table->foreign('container_code')
                ->references('code')
                ->on('containers')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('container_events');
    }
};
