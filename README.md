# Neggo Backend API

Backend da plataforma **Neggo**, um marketplace P2P para compra/venda de produtos e serviços com negociação via chat no frontend.

## Funcionalidades

- Cadastro e login com token de sessão (`Bearer`) + token custom para chat.
- CRUD principal de anúncios (`ads`) com suporte a produtos e serviços.
- Listagem de planos de assinatura e compra integrada com Stripe Checkout.
- Compra de boost para anúncio com Stripe Checkout.
- Perfil do usuário autenticado.
- Endpoints de chat (lista de conversas e mensagens) compatíveis com o contrato do frontend.
- Resposta padronizada em todos os endpoints:

```json
{
  "success": true,
  "error": false,
  "data": {}
}
```

## Stack

- Laravel 12
- Laravel Sanctum (auth token)
- Stripe PHP SDK
- SQLite (default local)

## Setup

1. Copie as variáveis de `.env` / `.env.example`.
2. Gere a chave da aplicação:
   - `php artisan key:generate`
3. Rode migrações + seed:
   - `php artisan migrate --seed`
4. Inicie a API:
   - `php artisan serve`

## Endpoints

### Auth

- `POST /api/auth/register`
  - payload: `{ name, email, password, phone? }`
  - retorno: `data: null`
- `POST /api/auth/login`
  - payload: `{ email, password }`
  - retorno `data`:
    - `id`
    - `token` (sessão JWT-like via Sanctum)
    - `firebaseToken` (token custom para chat)
    - `chatToken` (alias para compatibilidade)
    - `user`

### Ads

- `GET /api/ads`
- `GET /api/ads/{id}`
- `POST /api/ads` (auth)
  - suporta `price` numérico ou `'negotiable'`
- `POST /api/ads/{id}/boost` (auth)
  - cria sessão Stripe e marca boost no anúncio

### Chats

- `GET /api/chats` (auth)
- `GET /api/chats/{id}/messages` (auth)
- `POST /api/chats/{id}/messages` (auth)
  - payload: `{ text }`

### Plans

- `GET /api/plans`
- `POST /api/plans/{id}/buy` (auth)
  - cria sessão Stripe e ativa plano no usuário

### Profile

- `GET /api/profile` (auth)

## Variáveis de ambiente usadas

- `APP_NAME`, `APP_ENV`, `APP_KEY`, `APP_DEBUG`, `APP_URL`
- `DB_CONNECTION`, `DB_DATABASE`
- `SESSION_DRIVER`, `CACHE_STORE`, `QUEUE_CONNECTION`
- `FRONTEND_URL`
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLIC_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_CURRENCY`
- `PLAN_DURATION_DAYS`
- `AD_BOOST_PRICE_CENTS`, `AD_BOOST_DURATION_DAYS`
- `CHAT_TOKEN_SALT`
