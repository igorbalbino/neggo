# SEO

## Objetivo

Melhorar compartilhamento e indexação das páginas da SPA via meta tags (title, description, Open Graph, Twitter, canonical, `lang`).

## Implementação

| Item | Valor |
|------|--------|
| Componente | `neggo-front/src/components/SEO.tsx` |
| Lib | `react-helmet-async` |

## Páginas que usam SEO (conforme mapa atual)

| Página | Rota |
|--------|------|
| Landing | `/` |
| Home | `/app` |
| Explore | `/explore` |
| Ad detail | `/ad/:id` |
| Plans | `/plans` |
| Profile | `/profile` |

Outras páginas podem omitir ou herdar defaults.

## Tags típicas

- `<title>`
- `<meta name="description">`
- Open Graph: `og:title`, `og:description`, `og:image`, `og:url`
- Twitter cards
- `link rel="canonical"`
- `<html lang="...">` alinhado ao LanguageContext

## Detalhe do anúncio (dinâmico)

SEO do `/ad/:id` deve usar título/descrição/imagem do anúncio carregado para share social decente.

## Limitações de SPA

- Crawlers que não executam JS veem shell vazio — sem SSR/prerender documentado
- Meta tags via Helmet ajudam shares (WhatsApp/Telegram) quando o crawler executa ou quando há prerender
- Rotas autenticadas (`/app`, `/profile`) têm valor SEO baixo (não indexar idealmente com `noindex` se desejado)

## Backend

Laravel serve Blade welcome em `/` da API host — **não** é a landing React. SEO do produto vive no host do frontend.

## Gaps

- Sem sitemap.xml / robots.txt de produto documentados no front
- Sem SSR (Laravel Inertia ou Vite SSR) para OG estático em redes que não rodam JS
- `og:image` de ads depende de URL absoluta pública das imagens em `/img`
- Páginas login/register podem precisar `noindex`
