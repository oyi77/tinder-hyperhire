<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return ['message' => 'Tinder App API'];
});

// Health check endpoint for Railway
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Cronjob webhook endpoint (for external cron services)
Route::get('/api/cron/check-notifications', function () {
    try {
        Artisan::call('app:check-admin-notifications');
        $output = Artisan::output();
        return response()->json([
            'status' => 'success',
            'message' => 'Admin notifications checked',
            'output' => $output,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
});

