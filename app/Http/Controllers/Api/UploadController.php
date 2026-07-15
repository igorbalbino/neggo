<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiResponds;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UploadController extends Controller
{
    use ApiResponds;

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'file' => ['required', 'file', 'mimes:jpeg,jpg,png,webp,gif', 'max:5120'],
            ]);
        } catch (ValidationException $e) {
            return $this->fail($e->getMessage(), 422);
        }

        $file = $data['file'];
        $ext = strtolower((string) $file->extension());
        $allowed = ['jpeg', 'jpg', 'png', 'webp', 'gif'];

        if (! in_array($ext, $allowed, true)) {
            return $this->fail('Invalid image type.', 422);
        }

        $filename = Str::uuid()->toString().'.'.$ext;
        $path = $file->storeAs('img', $filename, 'public');

        if ($path === false) {
            return $this->fail('Upload failed.', 500);
        }

        $url = rtrim((string) config('app.url'), '/').'/storage/'.ltrim($path, '/');

        return $this->ok([
            'url' => $url,
        ]);
    }
}
