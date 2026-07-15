# Meus anúncios

## Objetivo

Listar todos os anúncios do usuário logado (vendedor) e permitir exclusão.

## Rota / tela

| Item | Valor |
|------|--------|
| Rota | `/my-ads` |
| Página | `neggo-front/src/pages/MyAds.tsx` |
| Auth | Protegida |
| Acesso também via | Menu do perfil |

## API

```http
GET /api/my-ads
Authorization: Bearer {token}
```

Retorna ads onde `seller_id = auth id`, ordenados do mais recente, **independente de status** (ao contrário do index público que só traz `active`).

## Excluir anúncio

```http
DELETE /api/ads/{ad}
Authorization: Bearer {token}
```

### Regras

- Somente o dono (`seller_id === user.id`)
- Caso contrário → **403** `Only the ad owner can delete this ad.`
- Soft delete? Implementação atual faz `$ad->delete()` (depende se model usa SoftDeletes; por padrão hard delete Eloquent)

### UX

- Confirmação antes de deletar
- Atualiza lista após sucesso

## Ações típicas na lista

| Ação | Disponível? |
|------|-------------|
| Ver detalhe | Sim → `/ad/:id` |
| Excluir | Sim |
| Editar | **Não** (gap) |
| Marcar vendido | **Não** via UI dedicada (status existe no schema) |
| Boost | Via detalhe / CTA |

## Relação com limite de plano

Limite conta apenas anúncios com `status = active`. Deletar libera slot. Marcar como sold/cancelled (se implementado no futuro) também deveria liberar.

## Gaps

- Sem edição
- Sem mudança de status (sold/cancelled) na UI
- Sem métricas por anúncio (views, chats iniciados)
