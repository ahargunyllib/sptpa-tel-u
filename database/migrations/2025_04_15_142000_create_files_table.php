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
        Schema::create('files', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('type');
            $table->bigInteger('size');
            $table->string('path');
            $table->string('thumbnail')->nullable();
            $table->foreignUlid('folder_id')->constrained('folders')->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained('users');
            $table->timestamps();
        });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
