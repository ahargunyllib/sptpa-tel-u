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
            $table->foreignUuid('user_id')->constrained('users');
            $table->integer('communication');
            $table->integer('teamwork');
            $table->integer('collaboration');
            $table->integer('solidarity');
            $table->integer('work_ethic');
            $table->integer('technology_usage');
            $table->integer('work_smart');
            $table->integer('initiative');
            $table->integer('role_model');
            $table->integer('responsibility');
            $table->integer('professional_ethic');
            $table->integer('image_maintenance');
            $table->integer('discipline');
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
