# Criar anúncio (wizard multi-step)

## Objetivo

Permitir que um usuário autenticado publique um anúncio de **produto** ou **serviço**, com imagens, localização, preço (fixo ou negociável), respeitando o limite do plano ativo.

## Rota / tela

| Item | Valor |
|------|--------|
| Rota | `/create` |
| Página | `neggo-front/src/pages/CreateAd.tsx` |
| Auth | Protegida |
| APIs | `POST /api/upload` (por imagem), `POST /api/ads` |

## Passos do wizard

| Step | Conteúdo |
|------|----------|
| 1 | Tipo: `product` vs `service` |
| 2 | Categoria, título, descrição, preço, locais (cidade atual / múltiplas / nacional), país opcional |
| 3 | Imagens (≥ 1), condition (`new`/`used`) OU serviceType (`remote`/`in_person`) |
| 4 | Sucesso + CTA para boost / planos |

## Fluxo de publicação

1. Usuário completa os steps no cliente.
2. Para cada imagem: `POST /api/upload` (multipart) → recebe URL absoluta.
3. Monta payload e chama `POST /api/ads` com as URLs.
4. Se preço vazio/inválido → envia `'negotiable'`.
5. Backend:
   - Checa limite de anúncios ativos do plano.
   - Valida campos.
   - Cria `Ad` com `seller_id = auth user`, status default `active`.
6. UI mostra step de sucesso.

## Request de criação

```http
POST /api/ads
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "iPhone 13",
  "description": "128GB, ótimo estado",
  "price": 1200,
  "isNational": false,
  "locations": [{ "city": "Assunção" }],
  "type": "product",
  "category": "electronics",
  "images": ["https://api.../img/xxx.jpg"],
  "condition": "used"
}
```

Preço negociável:

```json
{ "price": "negotiable" }
```

→ Backend grava `price = null`, `is_negotiable = true`.

## Validações (backend)

| Campo | Regras |
|-------|--------|
| `title` | required, string, max:255 |
| `description` | required, string |
| `price` | nullable (número ou `"negotiable"`) |
| `isNational` | required, boolean |
| `locations` | nullable, array |
| `type` | required, `product` \| `service` |
| `category` | required, string, max:100 |
| `images` | nullable, array |
| `condition` | nullable, `new` \| `used` |
| `serviceType` | nullable, `remote` \| `in_person` |

## Limite por plano (pré-criação)

Antes de validar o body, conta ads ativos do seller:

| Plano (name, case-insensitive) | Limite ativos |
|--------------------------------|---------------|
| Free | 2 |
| Essencial | 5 |
| Profissional | 25 |
| Empresarial | ilimitado (`null`) |
| default / desconhecido | 2 |

Se estourar → **403** com mensagem em PT sobre upgrade.

## Modelo `ads` (campos principais)

| Coluna | Notas |
|--------|-------|
| `seller_id` | FK user |
| `title`, `description` | texto |
| `price` | decimal nullable |
| `is_negotiable` | bool |
| `is_national` | bool |
| `locations` | JSON |
| `images` | JSON (URLs) |
| `type` | product \| service |
| `category` | string |
| `condition` | new \| used \| null |
| `service_type` | remote \| in_person \| null |
| `is_boosted` | default false |
| `status` | active \| sold \| cancelled |

## UX / navegação

- Bottom nav / sidebar ocultos nesta rota
- Voltar cancela o wizard (cuidado com rascunho não salvo — tipicamente sem draft no servidor)
- Step 4 CTA: impulsionar ou ver planos

## Gaps

- `images` nullable no backend, mas UI exige ≥ 1
- Sem rascunho / autosave server-side
- Sem edição de anúncio após criar (só create + delete no conjunto atual)
- Alinhamento de nomes de planos seeder vs UI (ver planos/limites)
