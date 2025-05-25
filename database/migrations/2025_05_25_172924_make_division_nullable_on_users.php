<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('division', [
                'academic_service',
                'laboratory',
                'secretary',
                'student_affair',
                'finance_logistic_resource'
            ])->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('your_table_name', function (Blueprint $table) {
            $table->enum('division', [
                'academic_service',
                'laboratory',
                'secretary',
                'student_affair',
                'finance_logistic_resource'
            ])->nullable(false)->change();
        });
    }
};
