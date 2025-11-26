<?php

namespace App\Http\Controllers;

use App\Models\Like;
use App\Models\UserMatch;
use App\Models\Profile;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="People",
 *     description="People profiles and interactions endpoints"
 * )
 */
class PeopleController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/people/recommended",
     *     tags={"People"},
     *     summary="Get recommended people list",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Page number",
     *         required=false,
     *         @OA\Schema(type="integer", default=1)
     *     ),
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Items per page",
     *         required=false,
     *         @OA\Schema(type="integer", default=15)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of recommended profiles",
     *         @OA\JsonContent(type="object")
     *     )
     * )
     */
    public function recommended(Request $request)
    {
        $user = $request->user();
        $perPage = $request->get('per_page', 15);
        $page = $request->get('page', 1);

        // Get IDs of profiles already liked/disliked by user
        $interactedProfileIds = Like::where('liker_id', $user->id)
            ->pluck('liked_id')
            ->toArray();

        // Get user's own profile ID if exists
        $ownProfileId = $user->profile ? $user->profile->id : null;
        if ($ownProfileId) {
            $interactedProfileIds[] = $ownProfileId;
        }

        // Get recommended profiles (excluding interacted ones)
        $profiles = Profile::whereNotIn('id', $interactedProfileIds)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($profiles);
    }

    /**
     * @OA\Post(
     *     path="/api/people/{id}/like",
     *     tags={"People"},
     *     summary="Like a person",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Like successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="match", type="boolean")
     *         )
     *     )
     * )
     */
    public function like(Request $request, $id)
    {
        $user = $request->user();
        $profile = Profile::findOrFail($id);

        // Check if already liked/disliked
        $existingLike = Like::where('liker_id', $user->id)
            ->where('liked_id', $id)
            ->first();

        if ($existingLike) {
            if ($existingLike->action === 'like') {
                return response()->json([
                    'message' => 'Already liked',
                    'match' => false,
                ]);
            }
            // Update dislike to like
            $existingLike->update(['action' => 'like']);
        } else {
            // Create new like
            Like::create([
                'liker_id' => $user->id,
                'liked_id' => $id,
                'action' => 'like',
            ]);
        }

        // Check for mutual like (match)
        $mutualLike = Like::where('liker_id', $profile->user_id ?? null)
            ->where('liked_id', $user->profile?->id ?? null)
            ->where('action', 'like')
            ->first();

        $isMatch = false;
        if ($mutualLike && $profile->user_id) {
            // Create match if both users liked each other
            UserMatch::firstOrCreate([
                'user1_id' => $user->id,
                'user2_id' => $id,
            ]);
            $isMatch = true;
        }

        return response()->json([
            'message' => 'Liked successfully',
            'match' => $isMatch,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/people/{id}/dislike",
     *     tags={"People"},
     *     summary="Dislike a person",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Dislike successful"
     *     )
     * )
     */
    public function dislike(Request $request, $id)
    {
        $user = $request->user();
        $profile = Profile::findOrFail($id);

        // Check if already liked/disliked
        $existingLike = Like::where('liker_id', $user->id)
            ->where('liked_id', $id)
            ->first();

        if ($existingLike) {
            if ($existingLike->action === 'dislike') {
                return response()->json(['message' => 'Already disliked']);
            }
            // Update like to dislike
            $existingLike->update(['action' => 'dislike']);
        } else {
            // Create new dislike
            Like::create([
                'liker_id' => $user->id,
                'liked_id' => $id,
                'action' => 'dislike',
            ]);
        }

        return response()->json(['message' => 'Disliked successfully']);
    }

    /**
     * @OA\Get(
     *     path="/api/people/liked",
     *     tags={"People"},
     *     summary="Get list of liked people",
     *     security={{"sanctum": {}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of liked profiles",
     *         @OA\JsonContent(type="array", @OA\Items(type="object"))
     *     )
     * )
     */
    public function liked(Request $request)
    {
        $user = $request->user();

        $likedProfileIds = Like::where('liker_id', $user->id)
            ->where('action', 'like')
            ->pluck('liked_id')
            ->toArray();

        $profiles = Profile::whereIn('id', $likedProfileIds)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($profiles);
    }

    /**
     * @OA\Delete(
     *     path="/api/people/{id}/like",
     *     tags={"People"},
     *     summary="Undo like",
     *     security={{"sanctum": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Like undone successfully"
     *     )
     * )
     */
    public function undoLike(Request $request, $id)
    {
        $user = $request->user();

        $like = Like::where('liker_id', $user->id)
            ->where('liked_id', $id)
            ->where('action', 'like')
            ->first();

        if (!$like) {
            return response()->json(['message' => 'Like not found'], 404);
        }

        $like->delete();

        // Also remove match if exists
        UserMatch::where('user1_id', $user->id)
            ->where('user2_id', $id)
            ->delete();

        return response()->json(['message' => 'Like undone successfully']);
    }
}

