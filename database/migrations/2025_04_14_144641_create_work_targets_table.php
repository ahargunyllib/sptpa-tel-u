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
        Schema::create('work_targets', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name', 255);
            $table->enum('unit', ['week', 'total', 'day']);
            $table->enum('comparator', ['equal', 'less_than_equal', 'more_than_equal', 'more_than', 'less_than']);
            $table->integer('first_quarter_target');
            $table->integer('second_quarter_target');
            $table->integer('third_quarter_target');
            $table->integer('forth_quarter_target');
            $table->foreignUuid('user_id')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_targets');
    }
};
