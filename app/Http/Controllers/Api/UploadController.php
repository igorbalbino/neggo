<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiResponds;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class UploadController extends Controller
{
    use ApiResponds;

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'file' => ['required', 'file', 'image', 'max:5120'],
            ]);
        } catch (ValidationException $e) {
            return $this->fail($e->getMessage(), 422);
        }

        // $path = $data['file']->store('uploads', 'public');

        // Build a URL that works even when APP_URL is missing the port.
        // $url = rtrim($request->getSchemeAndHttpHost(), '/').'/storage/'.ltrim($path, '/');

		$filename = uniqid().'.'.$data['file']->getClientOriginalExtension();

		$data['file']->move(public_path('img'), $filename);

		$url = rtrim($request->getSchemeAndHttpHost(), '/').'/img/'.$filename;
		
        return $this->ok([
            'url' => $url,
        ]);
    }
}

