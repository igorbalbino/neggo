# Home — Destaques (boosted)

## Objetivo

Dar visibilidade premium a anúncios com `is_boosted = true`, tipicamente em um carousel/strip de “destaques” no topo da Home.

## Origem do flag

Um anúncio fica boosted quando o dono paga o **boost** via Stripe (`POST /api/ads/{ad}/boost`). Ver [impulsionar.md](../anuncios/impulsionar.md).

## Ordenação na API

`GET /api/ads` já ordena:

1. `is_boosted` DESC
2. `latest()` (mais recentes)

Assim, boosted aparecem primeiro mesmo na lista geral; a Home ainda pode filtrar `ads.filter(a => a.isBoosted)` para a seção de highlights.

## UI

- Carousel / horizontal scroll de cards destacados
- Visual diferenciado (badge “destaque” / boost)
- Clique → `/ad/:id`

## Regras de negócio (produto)

| Item | Detalhe |
|------|---------|
| Duração esperada | Env `AD_BOOST_DURATION_DAYS` (default 7) |
| Preço | Env `AD_BOOST_PRICE_CENTS` (default 990) |
| Ativação | Backend marca `is_boosted = true` **imediatamente** ao criar checkout (antes do webhook/confirmação) |

## Gaps

- Sem job/scheduler documentado para **desligar** `is_boosted` após a duração
- Sem webhook Stripe → risco de boost ativo sem pagamento confirmado
- Tabela `ad_boosts` registra a compra; consumo do “fim do boost” pode estar incompleto

## Relação com planos

Boost é compra avulsa (one-shot), independente da assinatura mensal — mas planos limitam **quantidade de anúncios ativos**, não a capacidade de boost por se (boost exige ownership do ad).
