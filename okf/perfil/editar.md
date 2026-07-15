# Perfil — Editar

## Objetivo

Atualizar nome, telefone e foto do usuário autenticado.

## UI

| Item | Valor |
|------|--------|
| Modal | `EditProfileModal.tsx` |
| Página host | `Profile.tsx` |
| Upload | `POST /api/upload` → URL → salva em `photoUrl` |

## API

```http
PUT /api/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Novo Nome",
  "phone": "+595...",
  "photoUrl": "https://api.../img/abc.jpg"
}
```

Controller: `ProfileController`.

### Campos aceitos no backend

Somente: `name`, `phone`, `photoUrl`.

## Fluxo de troca de foto

1. Usuário escolhe arquivo no modal.
2. `POST /api/upload` (imagem ≤ 5MB).
3. Recebe URL absoluta.
4. `PUT /api/profile` com `photoUrl`.
5. Atualiza `AuthContext` / `localStorage` `neggo_user`.

## Campos enviados pelo frontend que o backend IGNORA

| Campo UI | Status backend |
|----------|----------------|
| `country` | Edit modal pode enviar — **não validado/armazenado** |
| `preferences` | Settings envia via updateProfile — **ignorado** |

Ver [preferencias.md](../configuracoes/preferencias.md).

## Validações esperadas

- Nome required / max length (seguir ProfileController)
- Phone opcional, max ~30
- photoUrl URL string (storage público)

## Gaps

- Country não persiste
- Sem crop/resize de avatar no servidor (só store as-is)
- Sem remoção explícita de foto (set null)
- E-mail **não** editável por este endpoint (correto por segurança; sem fluxo de change-email)
