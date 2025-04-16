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
            $table->foreignUuid('user_id')->constrained('users');
            $table->foreignUlid('work_target_id')->constrained('work_targets');
            $table->integer('first_quarter_value');
            $table->integer('second_quarter_value');
            $table->integer('third_quarter_value');
            $table->integer('forth_quarter_value');
            $table->enum('category', ['performance', 'behavior']);
            $table->integer('first_half_score');
            $table->integer('second_half_score');
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
