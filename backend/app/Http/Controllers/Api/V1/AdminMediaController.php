<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AdminSetting;
use App\Support\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminMediaController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file' => 'required|mimes:png,jpg,jpeg,webp,gif,svg,ico|max:5120',
            'type' => 'nullable|in:logo,favicon',
        ]);

        /** @var \Illuminate\Http\UploadedFile $file */
        $file = $request->file('file');

        $path = Media::disk()->putFile('media', $file);
        $url = Media::url($path);

        if (array_key_exists('type', $validated) && $validated['type'] !== null) {
            AdminSetting::set('site_' . $validated['type'], $url);
        }

        return response()->json([
            'data' => [
                'url' => $url,
                'path' => $path,
            ],
        ], 201);
    }
}
