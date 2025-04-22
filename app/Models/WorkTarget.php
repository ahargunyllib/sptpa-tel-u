<?php

namespace App\Models;

use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;

class WorkTarget extends Model
{
    use HasUlid;

    protected $fillable = [
        'name',
        'unit',
        'comparator',
        'first_quarter_target',
        'second_quarter_target',
        'third_quarter_target',
        'fourth_quarter_target',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function workTargetValues()
    {
        return $this->hasMany(WorkTargetValue::class);
    }
}
