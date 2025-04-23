<?php

namespace App\Models;

use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkTargetValue extends Model
{
  use HasUlid;

  protected $fillable = [
    'user_id',
    'work_target_id',
    'first_quarter_value',
    'second_quarter_value',
    'third_quarter_value',
    'fourth_quarter_value',
    'category',
    'first_quarter_score',
    'second_quarter_score',
    'third_quarter_score',
    'fourth_quarter_score',
  ];

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function workTarget(): BelongsTo
  {
    return $this->belongsTo(WorkTarget::class);
  }
}
