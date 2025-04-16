<?php

namespace App\Models;

use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Log extends Model
{
    use HasUlid;
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
