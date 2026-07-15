# Home — Filtros (cidade e tipo)

## Objetivo

Permitir ao usuário restringir o feed da Home por localização e por tipo de anúncio (produto vs serviço), sem nova chamada à API (filtro client-side).

## Onde vive

| Item | Valor |
|------|--------|
| Página | `neggo-front/src/pages/Home.tsx` |
| Escopo | Apenas UI da Home (Explore tem filtros próprios) |

## Dimensões de filtro

### 1. Cidade / localização

Lógica tipicamente aplicada:

- Compara cidade selecionada com `locations[].city` do anúncio **ou**
- Inclui anúncios `isNational === true` (visíveis em qualquer cidade)

Anúncios com múltiplas cidades (`locations` array JSON) entram se **qualquer** cidade bater com o filtro.

### 2. Tipo

| Valor | Significado |
|-------|-------------|
| `product` | Produto físico |
| `service` | Serviço |
| (todos) | Sem filtro de tipo |

UI costuma usar toggles ou chips para produto/serviço.

## Fluxo

1. Home carrega todos os ads ativos via `GET /api/ads`.
2. Usuário altera cidade e/ou tipo.
3. Lista exibida = `ads.filter(...)` no cliente.
4. Destaques (boosted) também podem ser derivados do mesmo dataset filtrado ou do subset `is_boosted` — ver implementação em `Home.tsx`.

## Dados no anúncio (relevantes)

```json
{
  "isNational": false,
  "locations": [{ "city": "Assunção", "country": "PY" }],
  "type": "product"
}
```

## Limitações

- Filtro **não** é enviado ao backend (não há query params em `GET /api/ads`).
- Lista completa precisa estar em memória.
- Busca por texto **não** é responsabilidade deste filtro (está no Explore).

## Melhorias futuras sugeridas

- Query params na URL da Home para compartilhar filtros
- Endpoint com `?city=&type=` e paginação
- Geolocalização / “cidade atual” automática
