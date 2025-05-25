<?php

namespace Database\Seeders;


use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Traits\Log;


class UserSeeder extends Seeder
{
    use Log;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = ['staf', 'kaur', 'wadek1', 'wadek2', 'sdm'];
        $divisions = ['academic_service', 'laboratory', 'secretary', 'student_affair', 'finance_logistic_resource'];

        $role = $roles[4];
        $division = $divisions[4];
        $i = 1;

        User::create([
            'name' => strtoupper($role) . ' ' . ucwords(str_replace('_', ' ', $division)) . " $i",
            'nip' => rand(10000000, 99999999),
            'email' => "$role.$division$i@gmail.com",
            'location' => "Bandung",
            'division' => $division,
            'photo_profile' => null,
            'role' => $role,
            'password' => Hash::make('password123')
        ]);
    }
}
