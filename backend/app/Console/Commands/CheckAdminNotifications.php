<?php

namespace App\Console\Commands;

use App\Models\AdminNotification;
use App\Models\Like;
use App\Models\Profile;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class CheckAdminNotifications extends Command
{
    protected $signature = 'app:check-admin-notifications';
    protected $description = 'Check for users who received 50+ likes and send email to admin';

    public function handle()
    {
        $adminEmail = config('mail.from.address', 'admin@example.com');

        // Get profiles that received 50+ likes
        $popularProfiles = Profile::whereHas('likes', function ($query) {
            $query->where('action', 'like');
        })
        ->withCount(['likes' => function ($query) {
            $query->where('action', 'like');
        }])
        ->having('likes_count', '>=', 50)
        ->get();

        foreach ($popularProfiles as $profile) {
            // Skip if notification already sent
            if ($profile->user_id) {
                $existingNotification = AdminNotification::where('user_id', $profile->user_id)
                    ->where('notification_sent_at', '>=', now()->subDay())
                    ->first();

                if ($existingNotification) {
                    continue;
                }

                // Send email notification
                try {
                    Mail::raw(
                        "Profile ID: {$profile->id}\nName: {$profile->name}\nReceived {$profile->likes_count} likes",
                        function ($message) use ($adminEmail, $profile) {
                            $message->to($adminEmail)
                                ->subject("User {$profile->name} received 50+ likes");
                        }
                    );

                    // Record notification
                    AdminNotification::create([
                        'user_id' => $profile->user_id,
                        'notification_sent_at' => now(),
                    ]);

                    $this->info("Notification sent for profile: {$profile->name} ({$profile->likes_count} likes)");
                } catch (\Exception $e) {
                    $this->error("Failed to send notification for profile {$profile->id}: " . $e->getMessage());
                }
            }
        }

        return Command::SUCCESS;
    }
}

