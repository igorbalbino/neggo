# Landing — Página inicial pública

## Objetivo

Apresentar o produto Neggo para visitantes, com CTAs para login/registro, seletor de idioma e SEO. Se o usuário já estiver autenticado, redirecionar para o app.

## Rota / tela

| Item | Valor |
|------|--------|
| Rota | `/` |
| Página | `neggo-front/src/pages/LandingPage.tsx` |
| Auth | Pública |
| SEO | Componente `SEO.tsx` |

## Sub-funcionalidades

### Hero / marca
- Nome do produto em destaque (brand-first)
- Headline + frase de apoio
- CTA principal → registro ou login
- CTA secundário → login

### Idioma
- Seletor de idioma na landing (pt-BR / en / es; Guaraní aparece de forma mais completa em Settings)
- Persistência via `LanguageContext`

### Redirect se autenticado
- Se `AuthContext` indicar sessão válida, redireciona para `/app` (evita marketing para quem já usa o produto)

### SEO
- Title, description, Open Graph / Twitter, canonical, `html lang`

## Conteúdo de negócio

Posicionamento: marketplace P2P onde a negociação acontece pelo chat; produtos e serviços; mercados locais/regionais (BR, PY, AR, UY).

## Navegação

| Ação | Destino |
|------|---------|
| Entrar | `/login` |
| Criar conta | `/register` |
| Já logado | `/app` |

## O que NÃO está na landing

- Feed de anúncios reais (isso é `/app` e `/explore`)
- Checkout / planos (área autenticada `/plans`)
- Chat

## Layout / navegação global

`Sidebar` e `BottomNav` ficam **ocultos** na landing (e também em login, create, ad detail, chat room).

## Gaps

- Versão no footer referencia Creatio Inc. / v1.0.4 — conteúdo marketing pode evoluir independente da API
- Backend Laravel em `/` ainda serve welcome Blade; a SPA React é o produto real no frontend hospedado à parte
