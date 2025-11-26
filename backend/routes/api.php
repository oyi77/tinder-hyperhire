<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PeopleController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

// People routes (protected)
Route::prefix('people')->middleware('auth:sanctum')->group(function () {
    Route::get('/recommended', [PeopleController::class, 'recommended']);
    Route::post('/{id}/like', [PeopleController::class, 'like']);
    Route::post('/{id}/dislike', [PeopleController::class, 'dislike']);
    Route::get('/liked', [PeopleController::class, 'liked']);
    Route::delete('/{id}/like', [PeopleController::class, 'undoLike']);
});
