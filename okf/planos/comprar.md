# Planos — Comprar (Stripe Subscription)

## Objetivo

Assinar um plano pago via Stripe Checkout em modo **subscription**, marcar o usuário como Pro e criar/atualizar `UserPlan`.

## API

```http
POST /api/plans/{plan}/buy
Authorization: Bearer {token}
```

Controller: `PlanController` (buy).

## Fluxo

1. Usuário escolhe tier na tela `/plans`.
2. Frontend chama buy com o id do plano.
3. Backend:
   - Resolve price id: `env('STRIPE_PRICE_ID_' . strtoupper(plan_name))`  
     Ex.: Essencial → `STRIPE_PRICE_ID_ESSENCIAL`
   - Cria Stripe Checkout Session `mode = subscription`
   - Cria `UserPlan` com **status active imediatamente** (comentário no código reconhece que webhook seria melhor)
   - Seta `user.is_pro = true`
   - Retorna URL do Checkout
4. Frontend redireciona para Stripe.
5. Após pagamento, retorno para URL de success/cancel configuradas na session.

## Env relevante

| Variável | Uso |
|----------|-----|
| `STRIPE_SECRET_KEY` | API Stripe |
| `STRIPE_PRICE_ID_ESSENCIAL` | Price subscription |
| `STRIPE_PRICE_ID_PROFISSIONAL` | Price subscription |
| `STRIPE_PRICE_ID_EMPRESARIAL` | Price subscription |
| `PLAN_DURATION_DAYS` | Duração esperada |
| `STRIPE_WEBHOOK_SECRET` | Presente, mas **sem handler** |

## Efeitos colaterais

| Campo | Efeito |
|-------|--------|
| `users.is_pro` | `true` |
| `user_plans.status` | `active` (imediato) |
| Limite de ads | Passa a usar o `name` do plano no match do AdController |

## Badge Pro

UI mostra `ShieldCheck` / indicação Pro quando `isPro` — **não** é um gate de permissões avançadas.

## Gaps críticos

1. Ativação **antes** da confirmação de pagamento
2. Sem webhook `customer.subscription.*` / `checkout.session.completed`
3. Sem cancelamento de assinatura no produto
4. Sem portal do cliente Stripe
5. Upgrade/downgrade / prorata não modelados
6. Nome do plano precisa bater exatamente com env e com match de limites

## Critérios de “done”

- [ ] Ativar plano só após payment/subscription active
- [ ] Webhook idempotente
- [ ] Sync de cancelamento / past_due
- [ ] UI de “gerenciar assinatura”
- [ ] Alinhar IDs/nomes seeder–frontend–Stripe
