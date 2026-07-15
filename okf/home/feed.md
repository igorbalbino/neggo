# Home — Feed de anúncios

## Objetivo

Tela principal autenticada do app: listar anúncios ativos, com percepção de “dashboard” do marketplace (descoberta rápida, header, navegação).

## Rota / tela

| Item | Valor |
|------|--------|
| Rota | `/app` |
| Página | `neggo-front/src/pages/Home.tsx` |
| Componentes | `Header.tsx`, `AdCard.tsx` |
| Auth | Protegida |

## Fonte de dados

```http
GET /api/ads
```

- Público no backend, mas a Home exige login no frontend.
- Retorna anúncios com `status = active`.
- Ordenação server-side: `is_boosted` DESC, depois mais recentes.

## O que a Home exibe

1. **Header** — branding, acesso a notificações (modal), navegação.
2. **Seção de destaques** — carousel/lista de anúncios boosted (ver [destaques.md](./destaques.md)).
3. **Grid de anúncios recentes** — cards com imagem, título, preço, local, tipo.
4. **Filtros client-side** — cidade e tipo (ver [filtros.md](./filtros.md)).

## Card do anúncio (`AdCard`)

Dados típicos renderizados a partir do transform do backend (`transformAd`):

- Imagem(ns)
- Título
- Preço ou “negociável”
- Tipo: produto / serviço
- Localização ou nacional
- Badge de boost / Pro do seller (quando aplicável)

Clique no card → `/ad/:id`.

## Navegação relacionada

| Destino | Via |
|---------|-----|
| Explore | `/explore` (sidebar / bottom nav) |
| Criar anúncio | `/create` |
| Chats | `/chats` |
| Perfil | `/profile` |

## Diferença Home vs Explore

| | Home (`/app`) | Explore (`/explore`) |
|--|---------------|----------------------|
| Foco | Feed + destaques + filtros leves | Busca textual + categorias + query params |
| Params URL | Não necessariamente | `q`, `cat`, `type` |
| Dados | Mesmo `GET /api/ads` | Mesmo `GET /api/ads` |

Ambos filtram no **cliente** após baixar a lista completa.

## Estados de UI

- Loading enquanto carrega ads
- Empty state se nenhum anúncio (ou nenhum após filtro)
- Erro de rede / API

## Gaps

- Sem paginação server-side — escala limitada se muitos ads
- Sem refresh automático / polling
- Stats do “dashboard” do perfil (vendidos, reviews) **não** estão nesta tela e não vêm da API no perfil
