# Chat — Iniciar conversa

## Objetivo

A partir de um anúncio, abrir (ou retomar) uma conversa entre o usuário autenticado e o vendedor.

## Pontos de entrada

| Origem | Ação |
|--------|------|
| `AdDetail` | CTA “Conversar” / chat |
| (futuro) | Deep link, notificação |

## Implementação atual (Firebase)

Função tipicamente `startChat(sellerId, adId, …)` em `firebase.ts` / `ChatContext`:

1. Verifica se já existe documento de chat entre os dois participantes para aquele anúncio.
2. Se existir → reutiliza id.
3. Se não → cria doc em `chats` com:
   - `users[]` / participantes
   - metadata do ad (id, título, imagem opcional)
   - unread inicial
4. Navega para `/chat/room/{chatId}`.

## O que NÃO existe

Documentação legada (`endpoints_documentation.txt`) menciona:

```http
POST /ads/:id/chat
```

**Não está em `routes/api.php`.** O frontend não depende desse endpoint.

## Fluxo Laravel teórico (schema existe)

Tabelas `chats` (`ad_id`, `buyer_id`, `seller_id`, `status`, `last_message`…) e `messages` — prontas para um start API, mas a UX live usa Firestore.

## Regras de negócio desejáveis

| Regra | Observação |
|-------|------------|
| Não conversar consigo mesmo | Owner não deve iniciar chat no próprio ad |
| Um chat por par user–ad | Evitar duplicatas |
| Exige auth | Sim |
| Vendedor precisa existir | seller_id do ad |

## Pré-requisitos técnicos

- Sanctum ok
- Firebase Auth com custom token (UID = id Laravel)
- Security rules Firestore alinhadas aos UIDs

## Gaps

- Endpoint Laravel de start ausente
- Risk of orphan chats se Firebase criar e SQL não
- Sem mensagem automática inicial (“Olá, tenho interesse em {título}”)
- Sem impedir chat em ads `sold`/`cancelled`
