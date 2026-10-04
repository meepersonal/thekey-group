<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('preorders', function (Blueprint $table) {
            $table->string('appointment_date')->nullable()->after('city');
            $table->string('appointment_time')->nullable()->after('appointment_date');
            $table->string('full_name')->nullable()->after('appointment_time');
            $table->string('country')->nullable()->after('full_name');
        });
    }

    public function down(): void
    {
        Schema::table('preorders', function (Blueprint $table) {
            $table->dropColumn(['appointment_date', 'appointment_time', 'full_name', 'country']);
        });
    }
};