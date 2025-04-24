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
        Schema::create('user_attitude_evaluations', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->integer('communication')->default(0);
            $table->integer('teamwork')->default(0);
            $table->integer('collaboration')->default(0);
            $table->integer('solidarity')->default(0);
            $table->integer('work_ethic')->default(0);
            $table->integer('technology_usage')->default(0);
            $table->integer('work_smart')->default(0);
            $table->integer('initiative')->default(0);
            $table->integer('role_model')->default(0);
            $table->integer('responsibility')->default(0);
            $table->integer('professional_ethic')->default(0);
            $table->integer('image_maintenance')->default(0);
            $table->integer('discipline')->default(0);
            $table->string('evidance')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_attitude_evaluations');
    }
};
