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
        Schema::create('work_reports', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('work_target_id')->constrained('work_targets')->nullable(false)->onDelete('cascade');
            $table->foreignUuid('creator_id')->constrained('users')->nullable(false);
            $table->text('content')->nullable(false);;
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_reports');
    }
};
