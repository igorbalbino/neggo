# Chat — Sala de conversa

## Objetivo

Permitir troca de mensagens em tempo real entre interessado e vendedor sobre um anúncio, marcar mensagens como lidas e (no futuro) ações de negociação.

## Rota / tela

| Item | Valor |
|------|--------|
| Rota | `/chat/room/:id` |
| Página | `neggo-front/src/pages/ChatRoom.tsx` |
| Auth | Protegida |
| Realtime | Firestore `onSnapshot` em `chats/{id}/messages` |

## Fluxo na sala

1. Carrega chat id da URL.
2. Assina mensagens (subcollection `messages`).
3. Renderiza bolhas (próprias vs outras).
4. Input de texto → send:
   - Cria documento em `messages`
   - Atualiza `last_message` no doc do chat
   - Incrementa unread da outra parte
5. Ao abrir / ao visualizar: `markAsRead` zera unread do papel atual.
6. Header: dados do outro usuário + referência ao anúncio (quando houver).

## Envio via Laravel (API existente, UI não usa para live)

```http
POST /api/chats/{chat}/messages
Authorization: Bearer {token}
Content-Type: application/json

{ "text": "Olá, ainda está disponível?" }
```

- `text` max 5000
- Participante-only
- Tabela SQL `messages`

Leitura:

```http
GET /api/chats/{chat}/messages
```

## Status do chat (modelo SQL)

`open` | `negotiating` | `closed` | `cancelled`

O Firestore pode ter campos equivalentes ou diferentes — dualidade é um risco.

## Ações de negociação (stubs de UI)

Botões presentes ou previstos **sem wiring backend completo**:

| Ação UI | Status |
|---------|--------|
| Fazer Proposta | Stub |
| Fechar Negócio | Stub |
| Desistir | Stub |
| Anexar imagem | Stub (botão) |
| Anexar localização | Stub (botão) |

## Navegação

- Bottom nav / sidebar ocultos na sala (foco na conversa)
- Voltar → `/chats`

## Regras de produto

- Conversa tipicamente 1:1 buyer–seller ligada a um `adId`
- Não é chat em grupo
- Autorização: só participantes

## Gaps

- Ações de proposta/fechamento não persistem estado de negócio
- Attachments (imagem/local) não implementados
- Sync Firebase ↔ Laravel inexistente/incompleto
- Moderação / report / bloqueio ausentes
- Limite de tamanho no Firebase deve espelhar o max 5000 do Laravel
