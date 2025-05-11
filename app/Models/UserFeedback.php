<?php

namespace App\Models;

use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;

class UserFeedback extends Model
{
    use HasUlid;
    protected $fillable = [
        'user_id',
        'kaur_feedback',
        'wadek_feedback',
    ];

    protected $table = 'user_feedbacks';

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
