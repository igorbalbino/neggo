# Explore — Busca, categorias e filtros

## Objetivo

Tela de descoberta ampliada: buscar anúncios por texto, filtrar por categoria e tipo, com estado refletido na URL (`q`, `cat`, `type`).

## Rota / tela

| Item | Valor |
|------|--------|
| Rota | `/explore` |
| Página | `neggo-front/src/pages/Explore.tsx` |
| Auth | Protegida |
| API | `GET /api/ads` (mesma lista da Home) |

## Query params da URL

| Param | Uso |
|-------|-----|
| `q` | Texto de busca (título / descrição) |
| `cat` | Categoria |
| `type` | `product` \| `service` |

Exemplo: `/explore?q=notebook&cat=electronics&type=product`

## Categorias (hardcoded no frontend)

| Key | Domínio |
|-----|---------|
| `electronics` | Eletrônicos |
| `home` | Casa |
| `fashion` | Moda |
| `sports` | Esportes |
| `services` | Serviços |
| `health` | Saúde |
| `education` | Educação |
| `tech` | Tecnologia |

**Importante:** categorias não vêm de endpoint de taxonomia; criar anúncio e filtrar devem usar as mesmas strings.

## Lógica de filtro (client-side)

1. Fetch de todos os ads ativos.
2. Filtrar por:
   - `q`: match em título e/ou descrição (case-insensitive)
   - `cat`: igualdade com `category`
   - `type`: igualdade com `type`
3. Renderizar grid de `AdCard`.

## Diferenças em relação à Home

- Explore prioriza **busca + categorias**
- Home prioriza **feed + cidade + destaques**
- Ambos usam o mesmo endpoint sem search server-side

## SEO

Página autenticada; ainda assim pode usar `SEO.tsx` para title/description no SPA.

## Gaps / débitos

- Sem full-text search / índice no Laravel
- Sem paginação
- Categorias hardcoded (i18n só no label da UI)
- Deep links com `q/cat/type` funcionam no cliente, mas backend ignora esses params
