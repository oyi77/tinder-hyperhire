<?php

use Illuminate\Support\Str;

// Helper function to get database URL (Railway MySQL uses MYSQL_URL, PostgreSQL uses DATABASE_URL)
$getDatabaseUrl = function () {
    $mysqlUrl = env('MYSQL_URL');
    $databaseUrl = env('DATABASE_URL');
    
    // Railway MySQL provides MYSQL_URL, PostgreSQL provides DATABASE_URL
    return $mysqlUrl ?: $databaseUrl;
};

$dbUrl = $getDatabaseUrl();

// Auto-detect connection type from URL scheme
$autoDetectConnection = function ($url) {
    if (!$url) {
        return env('DB_CONNECTION', 'mysql');
    }
    
    $scheme = parse_url($url, PHP_URL_SCHEME);
    
    if ($scheme && str_contains($scheme, 'mysql')) {
        return 'mysql';
    }
    
    if ($scheme && (str_contains($scheme, 'postgres') || str_contains($scheme, 'pgsql'))) {
        return 'pgsql';
    }
    
    // Default to mysql if MYSQL_URL is set, otherwise check DB_CONNECTION
    if (env('MYSQL_URL')) {
        return 'mysql';
    }
    
    return env('DB_CONNECTION', 'mysql');
};

return [

    'default' => $autoDetectConnection($dbUrl),

    'connections' => [

        'sqlite' => [
            'driver' => 'sqlite',
            'url' => $dbUrl,
            'database' => env('DB_DATABASE', database_path('database.sqlite')),
            'prefix' => '',
            'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
        ],

        'mysql' => [
            'driver' => 'mysql',
            'url' => $dbUrl,
            'host' => env('DB_HOST', $dbUrl ? (parse_url($dbUrl, PHP_URL_HOST) ?: '127.0.0.1') : '127.0.0.1'),
            'port' => env('DB_PORT', $dbUrl ? (parse_url($dbUrl, PHP_URL_PORT) ?: '3306') : '3306'),
            'database' => env('DB_DATABASE', $dbUrl ? (parse_url($dbUrl, PHP_URL_PATH) ? ltrim(parse_url($dbUrl, PHP_URL_PATH), '/') : 'tinder_app') : 'tinder_app'),
            'username' => env('DB_USERNAME', $dbUrl ? (parse_url($dbUrl, PHP_URL_USER) ?: 'root') : 'root'),
            'password' => env('DB_PASSWORD', $dbUrl ? (parse_url($dbUrl, PHP_URL_PASS) ?: '') : ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => true,
            'engine' => null,
            'options' => extension_loaded('pdo_mysql') ? array_filter([
                PDO::MYSQL_ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),
            ]) : [],
        ],

        'pgsql' => [
            'driver' => 'pgsql',
            'url' => $dbUrl,
            'host' => env('DB_HOST', $dbUrl ? (parse_url($dbUrl, PHP_URL_HOST) ?: '127.0.0.1') : '127.0.0.1'),
            'port' => env('DB_PORT', $dbUrl ? (parse_url($dbUrl, PHP_URL_PORT) ?: '5432') : '5432'),
            'database' => env('DB_DATABASE', $dbUrl ? (parse_url($dbUrl, PHP_URL_PATH) ? ltrim(parse_url($dbUrl, PHP_URL_PATH), '/') : 'tinder_app') : 'tinder_app'),
            'username' => env('DB_USERNAME', $dbUrl ? (parse_url($dbUrl, PHP_URL_USER) ?: 'root') : 'root'),
            'password' => env('DB_PASSWORD', $dbUrl ? (parse_url($dbUrl, PHP_URL_PASS) ?: '') : ''),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'search_path' => 'public',
            'sslmode' => 'prefer',
        ],

    ],

    'migrations' => 'migrations',

    'redis' => [

        'client' => env('REDIS_CLIENT', 'phpredis'),

        'options' => [
            'cluster' => env('REDIS_CLUSTER', 'redis'),
            'prefix' => env('REDIS_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_').'_database_'),
        ],

        'default' => [
            'url' => env('REDIS_URL'),
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'username' => env('REDIS_USERNAME'),
            'password' => env('REDIS_PASSWORD'),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_DB', '0'),
        ],

        'cache' => [
            'url' => env('REDIS_URL'),
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'username' => env('REDIS_USERNAME'),
            'password' => env('REDIS_PASSWORD'),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_CACHE_DB', '1'),
        ],

    ],

];

