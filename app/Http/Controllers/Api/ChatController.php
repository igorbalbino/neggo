<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiResponds;
use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Models\Message;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    use ApiResponds;

    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $chats = Chat::query()
            ->with('ad')
            ->where(fn ($query) => $query->where('buyer_id', $userId)->orWhere('seller_id', $userId))
            ->latest('updated_at')
            ->get()
            ->map(fn (Chat $chat) => [
                'id' => (string) $chat->id,
                'adId' => (string) $chat->ad_id,
                'adTitle' => $chat->ad?->title,
                'adImageUrl' => $chat->ad?->images[0] ?? null,
                'buyerId' => (string) $chat->buyer_id,
                'sellerId' => (string) $chat->seller_id,
                'lastMessage' => $chat->last_message,
                'status' => $chat->status,
                'updatedAt' => $chat->updated_at?->toIso8601String(),
            ]);

        return $this->ok($chats);
    }

    public function messages(Request $request, Chat $chat)
    {
        if (! $this->userInChat($request->user()->id, $chat)) {
            return $this->fail('You are not allowed to access this chat.', 403);
        }

        $messages = $chat->messages()
            ->orderBy('created_at')
            ->get()
            ->map(fn (Message $message) => [
                'id' => (string) $message->id,
                'chatId' => (string) $message->chat_id,
                'senderId' => (string) $message->sender_id,
                'text' => $message->text,
                'timestamp' => $message->created_at?->toIso8601String(),
            ]);

        return $this->ok($messages);
    }

    public function sendMessage(Request $request, Chat $chat)
    {
        if (! $this->userInChat($request->user()->id, $chat)) {
            return $this->fail('You are not allowed to send messages to this chat.', 403);
        }

        $data = $request->validate([
            'text' => ['required', 'string', 'max:5000'],
        ]);

        $message = Message::create([
            'chat_id' => $chat->id,
            'sender_id' => $request->user()->id,
            'text' => $data['text'],
        ]);

        $chat->update([
            'last_message' => $message->text,
            'last_message_at' => now(),
        ]);

        return $this->ok([
            'id' => (string) $message->id,
            'chatId' => (string) $message->chat_id,
            'senderId' => (string) $message->sender_id,
            'text' => $message->text,
            'timestamp' => $message->created_at?->toIso8601String(),
        ]);
    }

    private function userInChat(int $userId, Chat $chat): bool
    {
        return (int) $chat->buyer_id === $userId || (int) $chat->seller_id === $userId;
    }
}
