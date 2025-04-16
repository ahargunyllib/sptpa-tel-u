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
        Schema::create('tag_weekly_reports', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('tag_id')->constrained('tags');
            $table->foreignUlid('weekly_report_id')->constrained('weekly_reports');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tag_weekly_reports');
    }
};
