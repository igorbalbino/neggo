# OKF — Mapa de Funcionalidades do Neggo

Documentação detalhada das funcionalidades do **Neggo**, marketplace P2P chat-first para compra/venda de produtos e contratação de serviços (foco em mercados locais: Brasil, Paraguai, Argentina, Uruguai).

## O que é o Neggo

Negociação acontece pelo chat in-app. Anúncios suportam preço fixo ou negociável, cobertura multi-cidade ou nacional, e impulsos pagos de visibilidade.

| Camada | Stack |
|--------|--------|
| Backend | Laravel 12 (PHP 8.2), Sanctum, Stripe, Firebase Admin |
| Frontend | React 19, TypeScript, Vite 6, Tailwind 4, React Router 7 |
| Chat em tempo real | Firebase Auth (custom tokens) + Firestore |
| Pagamentos | Stripe Checkout (assinaturas + boosts) |
| Contrato da API | `{ success, error, data }` |

**API de produção (frontend):** `https://api-neggo.creatioinc.com/api`

## Estrutura desta pasta

Cada pasta = um domínio de funcionalidade. Cada arquivo `.md` = uma funcionalidade específica, com fluxo, telas, API, validações, modelos e gaps conhecidos.

```
okf/
├── autenticacao/     Login, registro, sessão, lembrar senha
├── landing/          Página pública de marketing
├── home/             Feed autenticado (dashboard do app)
├── explore/          Busca e descoberta
├── anuncios/         Criar, detalhe, meus anúncios, impulsionar
├── chat/             Lista, sala, iniciar conversa
├── favoritos/        Favoritar e listar
├── planos/           Listar, comprar, limites por plano
├── perfil/           Visualizar e editar
├── configuracoes/    Idioma e preferências
├── uploads/          Upload de imagens
├── i18n-seo/         Internacionalização e SEO
└── notificacoes/     Notificações (parcial / stub)
```

## Índice por domínio

### Autenticação
- [Login](./autenticacao/login.md)
- [Registro](./autenticacao/register.md)
- [Sessão e restauração](./autenticacao/sessao.md)
- [Lembrar / recuperar senha](./autenticacao/lembrar-senha.md)

### Landing
- [Página inicial pública](./landing/pagina-inicial.md)

### Home (Dashboard do app)
- [Feed de anúncios](./home/feed.md)
- [Filtros (cidade e tipo)](./home/filtros.md)
- [Destaques / boosted](./home/destaques.md)

### Explore
- [Busca, categorias e filtros](./explore/busca-e-filtros.md)

### Anúncios
- [Criar anúncio (wizard)](./anuncios/criar.md)
- [Detalhe do anúncio](./anuncios/detalhe.md)
- [Meus anúncios](./anuncios/meus-anuncios.md)
- [Impulsionar (boost)](./anuncios/impulsionar.md)

### Chat
- [Lista de conversas](./chat/lista.md)
- [Sala de chat](./chat/sala.md)
- [Iniciar conversa](./chat/iniciar-conversa.md)

### Favoritos
- [Favoritar e listar](./favoritos/favoritar.md)

### Planos
- [Listar planos](./planos/listar.md)
- [Comprar plano (Stripe)](./planos/comprar.md)
- [Limites por plano](./planos/limites.md)

### Perfil
- [Visualizar perfil](./perfil/visualizar.md)
- [Editar perfil](./perfil/editar.md)

### Configurações
- [Idioma](./configuracoes/idioma.md)
- [Preferências de contato](./configuracoes/preferencias.md)

### Uploads
- [Upload de imagens](./uploads/upload-imagens.md)

### i18n & SEO
- [Internacionalização](./i18n-seo/internacionalizacao.md)
- [SEO](./i18n-seo/seo.md)

### Notificações
- [Notificações](./notificacoes/notificacoes.md)

## Modelo de dados (resumo)

```
users ──┬── ads (seller)
        ├── user_plans ── plans
        ├── ad_boosts
        ├── favorites ── ads
        ├── chats (buyer/seller) ── messages
        └── personal_access_tokens (Sanctum)

Firestore (paralelo): chats + chats/{id}/messages
```

## Papéis e permissões

Não há RBAC/admin. Apenas:

| Papel | Acesso |
|-------|--------|
| Visitante | Ads públicos, planos, login/registro |
| Autenticado (Sanctum) | Criar/deletar próprios ads, boost, perfil, upload, favoritos, comprar plano |
| Dono do anúncio | Delete e boost apenas se `seller_id === user.id` |
| Participante do chat | Acesso Laravel chat se buyer ou seller |
| `is_pro` | Flag de UI (badge); não é gate de permissão |

## Rotas do frontend

| Path | Página | Auth |
|------|--------|------|
| `/` | Landing | Pública |
| `/login` | Login | Pública |
| `/register` | Register | Pública |
| `/app` | Home | Protegida |
| `/explore` | Explore | Protegida |
| `/ad/:id` | AdDetail | Protegida |
| `/create` | CreateAd | Protegida |
| `/chats` | ChatList | Protegida |
| `/chat/room/:id` | ChatRoom | Protegida |
| `/profile` | Profile | Protegida |
| `/my-ads` | MyAds | Protegida |
| `/favorites` | Favorites | Protegida |
| `/plans` | Plans | Protegida |
| `/settings` | Settings | Protegida |
