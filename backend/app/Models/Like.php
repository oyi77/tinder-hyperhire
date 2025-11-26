<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    use HasFactory;

    protected $fillable = [
        'liker_id',
        'liked_id',
        'action',
    ];

    public function liker()
    {
        return $this->belongsTo(User::class, 'liker_id');
    }

    public function liked()
    {
        return $this->belongsTo(Profile::class, 'liked_id');
    }
}

