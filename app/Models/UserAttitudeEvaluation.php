<?php

namespace App\Models;

use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;

class UserAttitudeEvaluation extends Model
{
    use HasUlid;

    protected $fillable = [
        'user_id',
        'communication',
        'teamwork',
        'collaboration',
        'solidarity',
        'work_ethic',
        'technology_usage',
        'work_smart',
        'initiative',
        'role_model',
        'responsibility',
        'professional_ethic',
        'image_maintenance',
        'discipline',
        'evidance',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
