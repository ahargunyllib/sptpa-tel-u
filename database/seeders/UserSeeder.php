<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = ['tpa', 'kaur', 'wadek', 'sdm'];

        foreach ($roles as $role) {
            for ($i = 1; $i <= 2; $i++) {
                User::create([
                    'name' => strtoupper($role) . " User $i",
                    'nip' => rand(10000000, 99999999),
                    'email' => "$role$i@gmail.com",
                    'location' => "Bandung",
                    'division' => "Divisi $role",
                    'photo_profile' => null,
                    'role' => $role,
                    'password' => Hash::make('password123')
                ]);
            }
        }
    }
}
