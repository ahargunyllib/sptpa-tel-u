<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasUuid, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $keyType = 'string';
    public $incrementing = false;


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    protected static function booted()
    {
        static::created(function ($user) {
            // Create a root folder for the user
            $userFolder = Folder::create([
                'name' => $user->name,
                'parent_id' => null,
                'user_id' => $user->id,
                'type' => 'user',
            ]);

            // Create a kepegawaian folder with the user folder as its parent
            $kepegawaianFolder = Folder::create([
                'name' => 'Kepegawaian',
                'parent_id' => $userFolder->id,
                'user_id' => $user->id,
                'type' => 'kepegawaian',
            ]);

            $kinerjaFolder = Folder::create([
                'name' => 'Kinerja',
                'parent_id' => $userFolder->id,
                'user_id' => $user->id,
                'type' => 'kinerja',
            ]);
            $kinerjaYearFolder = Folder::create([
                'name' => date('Y'),
                'parent_id' => $kinerjaFolder->id,
                'user_id' => $user->id,
                'type' => 'kinerja_year',
            ]);

            File::create([
                'name' => 'Default File',
                'type' => 'text/plain',
                'size' => 0,
                'path' => 'default-file.txt',
                'folder_id' => $kepegawaianFolder->id,
                'user_id' => $user->id,
                'thumbnail' => null,
            ]);
        });
    }

    public function folders()
    {
        return $this->hasMany(Folder::class);
    }

    public function files()
    {
        return $this->hasMany(File::class);
    }
}
