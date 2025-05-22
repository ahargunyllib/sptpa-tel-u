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
            $table->string('name', 255)->notNullable();
            // $table->enum('unit', ['week', 'total', 'day', 'minute'])->default('total');
            $table->enum('category', ['light', 'medium', 'heavy'])->default('light');

            // $table->enum('comparator', ['eq', 'lte', 'gte', 'gt', 'lt'])->default('eq');
            $table->integer('first_quarter_target')->default(0);
            $table->integer('second_quarter_target')->default(0);
            $table->integer('third_quarter_target')->default(0);
            $table->integer('fourth_quarter_target')->default(0);

            $table->integer('first_quarter_value')->default(0);
            $table->integer('second_quarter_value')->default(0);
            $table->integer('third_quarter_value')->default(0);
            $table->integer('fourth_quarter_value')->default(0);


            $table->integer('first_quarter_score')->default(0);
            $table->integer('second_quarter_score')->default(0);
            $table->integer('third_quarter_score')->default(0);
            $table->integer('fourth_quarter_score')->default(0);

            $table->integer('final_score')->default(0);

            $table->foreignUuid('creator_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('assigned_id')->constrained('users')->onDelete('cascade');

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
