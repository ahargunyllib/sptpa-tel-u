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
        Schema::create('work_target_values', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUlid('work_target_id')->constrained('work_targets')->onDelete('cascade');
            $table->integer('first_quarter_value')->default(0);
            $table->integer('second_quarter_value')->default(0);
            $table->integer('third_quarter_value')->default(0);
            $table->integer('fourth_quarter_value')->default(0);
            $table->enum('category', ['light', 'medium', 'heavy'])->default('light');
            $table->integer('first_quarter_score')->default(0);
            $table->integer('second_quarter_score')->default(0);
            $table->integer('third_quarter_score')->default(0);
            $table->integer('fourth_quarter_score')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_target_values');
    }
};
