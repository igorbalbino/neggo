# Impulsionar anúncio (Boost)

## Objetivo

Permitir que o dono do anúncio pague um valor avulso (Stripe Checkout one-time) para marcar o anúncio como `is_boosted`, aumentando visibilidade (ordem no feed e seção de destaques).

## Onde se inicia

- Detalhe do anúncio (`/ad/:id`) — botão boost se owner e não boosted
- CTA pós-criação no wizard (`/create` step 4)
- Eventualmente CTA em planos / my-ads (conforme UI)

## API

```http
POST /api/ads/{ad}/boost
Authorization: Bearer {token}
```

### Regras de autorização

- Somente dono do anúncio
- Senão → 403 `Only the ad owner can boost this ad.`

### Fluxo backend (`AdController@boost`)

1. Valida ownership.
2. Configura Stripe com `STRIPE_SECRET_KEY`.
3. Cria Session Checkout `mode = payment` (pagamento único).
4. Line item dinâmico (`price_data`) com nome “Neggo ad boost”.
5. Valor: `AD_BOOST_PRICE_CENTS` (default **990**).
6. Moeda: `STRIPE_CURRENCY` (default `usd`).
7. Cria registro `AdBoost`.
8. Seta **`is_boosted = true` imediatamente** no anúncio.
9. Retorna URL da sessão Stripe para redirect.

## Duração

Env `AD_BOOST_DURATION_DAYS` (default **7**).  
A duração deve ser usada para expirar o boost; a automação de “desboost” pode estar incompleta (sem webhook/job claro).

## Modelo `ad_boosts`

Registra a compra/relação usuário–anúncio–pagamento (valores exatos nas migrations).

## Impacto no produto

| Superfície | Efeito |
|------------|--------|
| `GET /api/ads` | Ordena boosted primeiro |
| Home destaques | Filtra `isBoosted` |
| Card / detalhe | Badge visual de destaque |

## Diferença vs plano assinatura

| | Boost | Plano |
|--|-------|-------|
| Tipo Stripe | `payment` (one-shot) | `subscription` |
| Efeito | `ad.is_boosted` | `user.is_pro` + limite de ads |
| Escopo | Um anúncio | Conta / quotas |

## Gaps críticos

1. **Ativação antes da confirmação de pagamento** — boost liga ao criar a session, não no webhook `checkout.session.completed`.
2. **Webhook Stripe** — secret pode existir no `.env`, mas handler não está implementado.
3. **Expiração** — duração env sem garantia de job diário desligando `is_boosted`.
4. **Re-boost** — comportamento se já boostado / pagamento abandonado pouco definido.
5. Moeda default `usd` pode não casar com mercado PY/BR/AR/UY sem config.

## Critérios de “done” recomendados

- [ ] Ativar boost só após pagamento confirmado
- [ ] Webhook + idempotência
- [ ] Job/expiração automática
- [ ] UX de “boost ativo até data X”
- [ ] Impedir boost duplicado concurrent
