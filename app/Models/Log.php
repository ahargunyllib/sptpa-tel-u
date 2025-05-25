<?php

namespace App\Models;

use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Log extends Model
{
    protected $fillable = [
        'user_id',
        'description',
        'ip_address',
    ];
    
    use HasUlid;
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
