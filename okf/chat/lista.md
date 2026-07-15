# Chat — Lista de conversas

## Objetivo

Mostrar todas as conversas do usuário logado (como comprador ou vendedor), com último mensagem, unread e atalho para a sala.

## Rota / tela

| Item | Valor |
|------|--------|
| Rota | `/chats` |
| Página | `neggo-front/src/pages/ChatList.tsx` |
| Contexto | `neggo-front/src/contexts/ChatContext.tsx` |
| Auth | Protegida |
| Fonte de dados (UI real) | **Firebase Firestore** (não a API Laravel de chats) |

## Fonte primária (Firebase)

Coleção `chats` onde o usuário aparece em `users[]` (participantes). Campos típicos:

- Participantes / roles (contractor/artist naming legado possível)
- `last_message`
- Contadores de unread por lado
- Referência ao `adId` / metadados do anúncio
- Timestamps

Listener em tempo real (`onSnapshot`) atualiza a lista.

## Fonte secundária (Laravel — não usada pela UI de chat live)

```http
GET /api/chats
Authorization: Bearer {token}
```

Lista chats onde o user é `buyer_id` ou `seller_id`. Schema SQL paralelo a Firebase.

## UX da lista

- Avatar / nome da outra parte
- Preview da última mensagem
- Badge de não lidas
- Clique → `/chat/room/:id`
- Empty state se não houver conversas

## Pré-requisitos

1. Login Sanctum + Firebase custom token válidos
2. `signInWithCustomToken` ok (UID = Laravel user id)

## Gaps

- Dual stack: manter Laravel `chats`/`messages` e Firebase em sync **não** está garantido
- Sem arquivamento / delete de conversa na UI
- Sem busca na lista
- Naming contractor/artist pode não refletir domínio buyer/seller do marketplace
