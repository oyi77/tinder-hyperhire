<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Auto-detect HTTPS from Railway
        if (env('RAILWAY_PUBLIC_DOMAIN')) {
            $url = 'https://' . env('RAILWAY_PUBLIC_DOMAIN');
            config(['app.url' => $url]);
            URL::forceScheme('https');
        } elseif (env('APP_ENV') === 'production' && request()->header('X-Forwarded-Proto') === 'https') {
            // Force HTTPS if behind Railway proxy
            URL::forceScheme('https');
        }
    }
}

