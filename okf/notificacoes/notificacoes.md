# Notificações

## Objetivo (produto)

Avisar o usuário sobre eventos relevantes: nova mensagem, interesse no anúncio, status de pagamento, boost expirando, etc.

## Status atual

**Incompleto / stub.**

| Camada | Estado |
|--------|--------|
| UI Header | Sino → `NotificationModal` |
| Frontend API calls | `GET /api/notifications`, `POST /api/notifications/read` |
| Backend routes | **Ausentes** |
| Controllers | **Ausentes** |
| Models / migrations | **Não mapeados como feature pronta** |

Resultado: chamadas falham; modal tende a empty state ou erro silencioso.

## UX existente

1. Ícone de sino no `Header`.
2. Abre modal de notificações.
3. Tenta buscar lista e marcar como lidas.
4. Sem dados reais.

## Spec desejada

### Tipos de notificação

| Tipo | Trigger |
|------|---------|
| `chat.message` | Nova mensagem Firestore / Laravel |
| `ad.favorite` | (opcional) alguém favoritou |
| `plan.activated` | Assinatura confirmada |
| `plan.expiring` | Perto do `expires_at` |
| `boost.activated` / `boost.expiring` | Ciclo de boost |
| `ad.limit` | Atingiu limite ao tentar criar |

### APIs sugeridas

```http
GET  /api/notifications
POST /api/notifications/read          # marcar todas ou ids
POST /api/notifications/{id}/read
```

### Canais

1. **In-app** (modal / badge no header) — prioridade
2. Push (FCM via Firebase) — futuro natural dado o stack
3. E-mail — futuro

### Schema sugerido

`notifications`: `user_id`, `type`, `title`, `body`, `data` JSON, `read_at`, timestamps.

## Dependências técnicas

- Integração com eventos Firebase (mensagens) ou cloud function → API
- Webhooks Stripe → criar notificação de pagamento
- Jobs para expiração de plano/boost

## Checklist done

- [ ] Migration + model + policy (só dono lê as próprias)
- [ ] Rotas Sanctum
- [ ] Popular a partir de eventos reais
- [ ] Badge de unread no Header
- [ ] Mark as read funcional
- [ ] i18n das strings
- [ ] (Opcional) FCM push

## Relação com outros gaps

Notificações dependem de webhooks Stripe e de uma fonte confiável de “nova mensagem”. Enquanto o chat for só Firestore, ou se implementa listener FCM/cloud function, ou o in-app só cobre eventos Laravel (planos, ads).
