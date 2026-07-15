# Perfil — Visualizar

## Objetivo

Mostrar identidade do usuário logado, avatar, rating, plano, atalhos para áreas da conta e logout.

## Rota / tela

| Item | Valor |
|------|--------|
| Rota | `/profile` |
| Página | `neggo-front/src/pages/Profile.tsx` |
| Auth | Protegida |
| API | `GET /api/profile` |

## Dados da API

```http
GET /api/profile
Authorization: Bearer {token}
```

| Campo | Significado |
|-------|-------------|
| `id` | ID string |
| `name` | Nome |
| `photoUrl` | Avatar |
| `rating` | Avaliação |
| `isPro` | Flag Pro |
| `phone` | Telefone |
| `plan` | Nome do plano atual (ou Free) |

## Conteúdo de UI

1. Avatar (upload / ui-avatars fallback)
2. Nome + badge Pro (`ShieldCheck`)
3. Rating
4. Nome do plano
5. **Stats UI** — anúncios ativos / vendidos / reviews  
   → **não populados pela API atual** (placeholder / zeros)
6. Menu:
   - Meus anúncios → `/my-ads`
   - Favoritos → `/favorites`
   - Planos → `/plans`
   - Configurações → `/settings`
7. Logout
8. Abrir modal de edição (`EditProfileModal`)

## SEO

`SEO.tsx` pode setar title de perfil.

## Perfil público de terceiros

Navegação “ver perfil do vendedor” a partir do anúncio está **incompleta** — esta tela é do **próprio** usuário autenticado.

## Gaps

- Stats sem backend
- Sem listagem pública `/user/:id`
- Rating: de onde é calculado/atualizado? Pouco claro no fluxo atual (campo existe; engine de reviews não mapeada como feature completa)
