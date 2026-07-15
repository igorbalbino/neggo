# Detalhe do anúncio

## Objetivo

Exibir o anúncio completo para o comprador/interessado: galeria, preço, descrição, vendedor, ações de chat, favorito, compartilhar, telefone (se permitado) e boost (se for dono).

## Rota / tela

| Item | Valor |
|------|--------|
| Rota | `/ad/:id` |
| Página | `neggo-front/src/pages/AdDetail.tsx` |
| Componentes | `ShareModal.tsx`, favorito, CTA chat |
| Auth | Protegida no frontend |
| API | `GET /api/ads/{ad}` (público no backend) |

## Conteúdo da tela

1. **Galeria** de imagens
2. **Título**, tipo, categoria, condition/serviceType
3. **Preço** ou label negociável
4. **Descrição**
5. **Localização** (lista de cidades ou “nacional”)
6. **Card do vendedor** — nome, foto, rating, badge Pro
7. **Ações:**
   - Iniciar chat (Firebase `startChat`)
   - Toggle favorito
   - Compartilhar link (`ShareModal`)
   - Ligar / WhatsApp se preferências do seller permitirem telefone
   - Boost (se usuário = owner e ainda não boosted)

## Fluxo de carga

1. Rota recebe `id`.
2. `GET /api/ads/{id}` → payload transformado com seller.
3. Render; se 404, empty/error state.

## Iniciar chat a partir do detalhe

Não usa `POST /ads/:id/chat` (documentação legada; **não existe** em `routes/api.php`).

Usa Firebase:

```
startChat(sellerId, adId, ...)
```

→ encontra ou cria documento em Firestore `chats` → navega para `/chat/room/:id`.

Detalhes: [iniciar-conversa.md](../chat/iniciar-conversa.md).

## Favorito

`POST /api/ads/{ad}/favorite` — toggle. Ver [favoritar.md](../favoritos/favoritar.md).

## Share

Modal com link da SPA `/ad/:id` (ou URL pública equivalente). Sem backend de share tracking.

## Telefone do seller

Depende de preferências no objeto seller (frontend Settings: chat vs chat+phone). Backend de profile **não persiste** `preferences` — comportamento pode ser inconsistente.

## Boost no detalhe

Se owner e `!isBoosted` → botão impulsionar → `POST /api/ads/{ad}/boost` → redirect Stripe Checkout.

## Gaps

- Perfil público do vendedor (navegação “ver perfil do seller”) incompleto
- Preferências de telefone pouco confiáveis (não validadas no backend)
- Status sold/cancelled: detalhe pode ainda exibir conforme policy de `show` (não filtra só active no show individual)
