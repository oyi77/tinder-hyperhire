<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'age',
        'pictures',
        'location',
    ];

    protected function casts(): array
    {
        return [
            'pictures' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class, 'liked_id');
    }

    public function matches()
    {
        return $this->hasMany(\App\Models\UserMatch::class, 'user2_id');
    }
}

