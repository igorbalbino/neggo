# Sessão e restauração

## Objetivo

Manter o usuário autenticado entre recarregamentos da SPA, restaurar perfil via API, e proteger rotas privadas. Também gerenciar logout e limpeza de tokens.

## Componentes envolvidos

| Item | Local |
|------|--------|
| Contexto | `neggo-front/src/contexts/AuthContext.tsx` |
| Guard de rotas | `ProtectedRoute` em `neggo-front/src/App.tsx` |
| Storage | `localStorage` |
| Endpoint de restore | `GET /api/profile` |

## Chaves no `localStorage`

| Chave | Conteúdo |
|-------|----------|
| `neggo_token` | Bearer Sanctum |
| `neggo_chat_token` | Firebase custom token |
| `neggo_user` | JSON do usuário (cache local) |

## Fluxo de restauração (boot do app)

1. App sobe; `AuthContext` lê `neggo_token` do `localStorage`.
2. Se **não** houver token → estado `unauthenticated`; rotas protegidas redirecionam para `/login`.
3. Se houver token:
   - Chama `GET /api/profile` com `Authorization: Bearer {token}`.
   - Sucesso → atualiza estado do usuário; tenta reautenticar Firebase com `neggo_chat_token` (se presente).
   - Falha (401/erro) → **logout** (limpa storage + estado).

## Rotas protegidas

Qualquer rota dentro do `ProtectedRoute` exige sessão válida. Exemplos: `/app`, `/explore`, `/create`, `/chats`, `/profile`, `/my-ads`, `/favorites`, `/plans`, `/settings`, `/ad/:id`, `/chat/room/:id`.

Visitante autenticado que acessa `/` (landing) pode ser redirecionado automaticamente para o app (ver landing).

## Logout

1. Usuário aciona logout (perfil ou configurações).
2. Frontend:
   - Limpa `neggo_token`, `neggo_chat_token`, `neggo_user`
   - Limpa estado do `AuthContext`
   - Faz sign-out do Firebase (se aplicável)
   - Redireciona para `/login` ou `/`

**Nota:** não há endpoint dedicado de logout no backend listado — a invalidação prática é descartar o token no cliente. Tokens Sanctum antigos podem permanecer válidos no servidor até expiração/revogação.

## Headers nas chamadas autenticadas

```http
Authorization: Bearer {neggo_token}
Accept: application/json
```

## Endpoint usado na restauração

```http
GET /api/profile
Authorization: Bearer {token}
```

Retorna: `id`, `name`, `photoUrl`, `rating`, `isPro`, `phone`, `plan`.

## Casos de borda

| Cenário | Comportamento esperado |
|---------|------------------------|
| Token expirado/revogado | Profile falha → logout automático |
| Token presente, Firebase token ausente | API ok; chat pode falhar até novo login |
| Usuário editou perfil em outra aba | Cache `neggo_user` pode estar stale até novo `GET /profile` |
| Rede indisponível no boot | Depende da implementação: manter cache ou forçar logout |

## Relação com Firebase

O chat depende de sessão Firebase separada. O custom token é emitido **apenas no login**. Restaurar SPA com Sanctum válido não regenera automaticamente um novo Firebase token no backend — depende do `neggo_chat_token` antigo ainda ser aceito pelo Firebase.

## Gaps / débitos técnicos

- Sem refresh token / rotação Sanctum
- Sem invalidação server-side no logout
- Firebase token não é reemitido no restore via `GET /profile`
- Preferências e alguns campos de UI vivem só no cliente
