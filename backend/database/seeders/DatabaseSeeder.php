<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create test user for login
        $testUser = User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['password' => Hash::make('password123')]
        );

        // Update password to ensure it's correct (in case user was created before)
        if ($testUser->wasRecentlyCreated === false) {
            $testUser->update(['password' => Hash::make('password123')]);
        }

        if (!$testUser->profile) {
            $testUser->profile()->create([
            'name' => 'Test User',
            'age' => 28,
            'pictures' => [
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
                'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
            ],
            'location' => 'New York, NY',
            ]);
        }

        // Generate 30 mock profiles for swiping
        $names = [
            'Emma', 'Olivia', 'Sophia', 'Isabella', 'Ava', 'Mia', 'Charlotte', 'Amelia',
            'Harper', 'Evelyn', 'Liam', 'Noah', 'Oliver', 'William', 'Elijah', 'James',
            'Benjamin', 'Lucas', 'Mason', 'Ethan', 'Alexander', 'Henry', 'Michael',
            'Daniel', 'Logan', 'Jackson', 'Sebastian', 'Jack', 'Aiden', 'Owen',
        ];

        $locations = [
            'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
            'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
            'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL',
            'San Francisco, CA', 'Columbus, OH', 'Fort Worth, TX', 'Charlotte, NC',
            'Detroit, MI', 'El Paso, TX', 'Seattle, WA', 'Denver, CO',
        ];

        $pictureUrls = [
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
            'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400',
        ];

        // Only create profiles if they don't exist
        if (Profile::whereNull('user_id')->count() < 30) {
            for ($i = 0; $i < 30; $i++) {
                $age = rand(18, 65);
                $numPictures = rand(3, 6);
                $selectedPictures = array_rand($pictureUrls, $numPictures);
                $pictures = array_map(fn($idx) => $pictureUrls[$idx], (array)$selectedPictures);

                Profile::firstOrCreate(
                    [
                        'name' => $names[$i % count($names)] . ' ' . ($i + 1),
                        'user_id' => null,
                    ],
                    [
                        'age' => $age,
                        'pictures' => $pictures,
                        'location' => $locations[$i % count($locations)],
                    ]
                );
            }
        }

        $this->command->info('Test user created:');
        $this->command->info('Email: test@example.com');
        $this->command->info('Password: password123');
        $this->command->info('30 mock profiles created for swiping.');
    }
}

