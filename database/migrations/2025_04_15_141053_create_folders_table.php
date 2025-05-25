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
        // Step 1: Buat tabel tanpa foreign key yang self-reference dulu
        Schema::create('folders', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->ulid('parent_id')->nullable();
            $table->foreignUlid('work_target_id')->nullable()->constrained('work_targets')->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['user', 'kepegawaian', 'kinerja', 'kinerja_year', 'target_kinerja']);
            $table->timestamps();
        });

        // Step 2: Tambahkan constraint foreign key setelah tabel dibuat
        Schema::table('folders', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('folders')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('folders', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
        });

        Schema::dropIfExists('folders');
    }
};
