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
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('nip')->unique();
            $table->string('location')->nullable();
            $table->enum('division',['academic_service', 'laboratory', 'secretary', 'student_affair','finance_logistic_resource'])->notNullable(); //for staff and kaur
            // academic_service [note: 'under wadek1'] 
            // laboratorium [note: 'under wadek1']
            // secretary [note: 'under wadek2']
            // student_affair [note: 'under wadek2']
            // finance_logistic_resource [note: 'under wadek2']
            $table->enum('role', ['staf', 'kaur', 'wadek1', 'wadek2','sdm'])->default('staf');
            // staf
            // kaur
            // wadek1
            // wadek2
            // sdm
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('photo_profile')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignUuid('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
