# Planos — Listar

## Objetivo

Exibir os planos de assinatura disponíveis para o usuário (Free e tiers pagos), marcar o plano atual e direcionar para compra.

## Rota / tela

| Item | Valor |
|------|--------|
| Rota | `/plans` |
| Página | `neggo-front/src/pages/Plans.tsx` |
| API | `GET /api/plans` |
| Auth UI | Protegida; endpoint é público |

## API

```http
GET /api/plans
Authorization: Bearer {token}  # opcional, mas útil
```

Se autenticado, a response marca `isCurrent` no plano ativo do usuário.

## Tiers no frontend (hardcoded para display)

| Id / nome UI | Papel |
|--------------|-------|
| Free | Gratuito |
| Essencial | Pago |
| Profissional | Pago |
| Empresarial | Pago |

Preços exibidos variam por **idioma** (i18n), não necessariamente batendo 1:1 com Stripe price IDs.

## Seeder backend (`DatabaseSeeder`)

Pode usar nomes **Starter / Pro / Business** — **divergentes** dos nomes usados em:

- UI (Essencial / Profissional / Empresarial)
- Limites do `AdController` (free, essencial, profissional, empresarial)

Isso é um **gap crítico** de alinhamento.

## UX

- Cards/comparativo de benefícios (quantidade de anúncios, etc.)
- Destaque do plano atual
- CTA “Assinar” / “Fazer upgrade” → fluxo de compra
- SEO via `SEO.tsx`

## Dados relacionados

- `plans` table
- `user_plans` (assinatura do usuário: status, expires_at)
- `users.is_pro` (flag visual)

## Gaps

- Mismatch de nomes seeder ↔ UI ↔ limites
- `buy` usa `plan` id/name para resolver `STRIPE_PRICE_ID_{PLAN_NAME}` — nomes errados quebram checkout
- Free pode ser só ausência de UserPlan, não uma row em `plans`
