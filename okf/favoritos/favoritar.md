# Favoritos — Favoritar e listar

## Objetivo

Permitir que o usuário marque anúncios de interesse e os reencontre em uma lista dedicada.

## Rotas / telas

| Item | Valor |
|------|--------|
| Lista | `/favorites` → `Favorites.tsx` |
| Toggle | Botão no `AdDetail.tsx` |
| Controller | `FavoriteController.php` |
| Modelo | `Favorite` |

## APIs

### Listar favoritos

```http
GET /api/favorites
Authorization: Bearer {token}
```

Retorna anúncios favoritados do usuário autenticado.

### Toggle favorito

```http
POST /api/ads/{ad}/favorite
Authorization: Bearer {token}
```

Comportamento **toggle**:

- Se ainda não favoritou → cria vínculo
- Se já favoritou → remove

## Schema

Tabela `favorites`:

| Coluna | Notas |
|--------|-------|
| `user_id` | FK |
| `ad_id` | FK |
| unique | (`user_id`, `ad_id`) |

## UX

### No detalhe
- Ícone coração (ou similar) on/off
- Feedback imediato pós-toggle
- Estado inicial deve refletir se já é favorito (idealmente via flag no payload do ad ou call auxiliar)

### Na lista `/favorites`
- Grid de cards
- Clique → `/ad/:id`
- Empty state
- Acesso pelo menu do perfil e navegação

## Autorização

- Qualquer usuário autenticado pode favoritar ads públicos
- Não precisa ser buyer prévio
- Dono pode favoritar próprio ad? Backend tipicamente permite (produto pode querer bloquear)

## Gaps

- Sem pastas / tags de favoritos
- Sem notificação se preço mudou / ad foi removido
- Favorito de ad deletado: comportamento de FK (cascade vs orphan) depende da migration
- Sync otimista vs rollback em erro de rede na UI
