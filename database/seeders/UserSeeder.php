<?php

namespace Database\Seeders;

use App\Models\Tag;
use App\Models\TagWeeklyReport;
use App\Models\User;
use App\Models\WeeklyReport;
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
        $roles = ['tpa', 'kaur', 'wadek', 'sdm'];
        $tags = [];
        $tpaWeeklyReports = [];

        foreach ($roles as $role) {
            for ($i = 1; $i <= 2; $i++) {
                $user = User::create([
                    'name' => strtoupper($role) . " $i",
                    'nip' => rand(10000000, 99999999),
                    'email' => "$role$i@gmail.com",
                    'location' => "Bandung",
                    'division' => "humas",
                    'photo_profile' => null,
                    'role' => $role,
                    'password' => Hash::make('password123')
                ]);

                // Buat Tag dan simpan ke array
                $tag = Tag::create([
                    'name' => "Tag $i",
                ]);
                $tags[] = $tag;

                if ($role === 'tpa') {
                    // Buat WeeklyReport dan simpan ke array
                    $weeklyReport = WeeklyReport::create([
                        'content' => "Billy itu orangnya rame banget, selalu jadi pusat perhatian di tongkrongan. Dia punya gaya ngomong yang nyablak tapi bikin ketawa, kadang sok tahu tapi justru itu yang bikin obrolan makin hidup. Apa aja dijadiin bahan becandaan, bahkan hal-hal receh bisa dia bawa jadi topik seru. Tapi di balik kelakuannya yang heboh, dia sebenarnya peka juga sama temen-temennya—selalu ada kalau dibutuhin. Pokoknya kalau ada Billy, suasana dijamin gak bakal sepi!",
                        'user_id' => $user->id,
                    ]);
                    $tpaWeeklyReports[] = $weeklyReport;
                }
            }
        }

        // Mapping semua tag ke setiap weekly report TPA
        foreach ($tpaWeeklyReports as $report) {
            foreach ($tags as $tag) {
                TagWeeklyReport::create([
                    'tag_id' => $tag->id,
                    'weekly_report_id' => $report->id,
                ]);
            }
        }
    }
}
