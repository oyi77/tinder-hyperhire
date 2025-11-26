<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('liker_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('liked_id')->constrained('profiles')->onDelete('cascade');
            $table->enum('action', ['like', 'dislike']);
            $table->timestamps();
            
            $table->unique(['liker_id', 'liked_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};

