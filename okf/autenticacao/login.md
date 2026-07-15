# Login

## Objetivo

Autenticar um usuário existente com e-mail e senha, emitir token Sanctum para a API Laravel e token Firebase (custom) para o chat em tempo real.

## Rota / tela

| Item | Valor |
|------|--------|
| Rota frontend | `/login` |
| Página | `neggo-front/src/pages/Login.tsx` |
| Contexto | `neggo-front/src/contexts/AuthContext.tsx` |
| Serviço API | `neggo-front/src/services/api.ts` |
| Firebase | `neggo-front/src/services/firebase.ts` |
| Controller | `app/Http/Controllers/Api/AuthController.php` → `login` |

## Fluxo completo

1. Usuário acessa `/login` (público).
2. Preenche **e-mail** e **senha**.
3. Frontend chama `POST /api/auth/login`.
4. Backend valida credenciais com `Auth::attempt`.
5. Em sucesso:
   - Cria token Sanctum (`createToken('neggo-session')`).
   - Gera Firebase custom token (UID = id do usuário Laravel) via Admin SDK.
   - Resolve nome do plano ativo (ou `"Free"`).
   - Retorna `token`, `firebaseToken` / `chatToken` e objeto `user`.
6. Frontend persiste em `localStorage`:
   - `neggo_token` — Bearer Sanctum
   - `neggo_chat_token` — Firebase custom token
   - `neggo_user` — payload do usuário
7. Frontend autentica no Firebase com `signInWithCustomToken`.
8. Redireciona para a área autenticada (home `/app`).

## Request

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "senha12345"
}
```

### Validações (backend)

| Campo | Regras |
|-------|--------|
| `email` | required, email |
| `password` | required, string |

## Response de sucesso

```json
{
  "success": true,
  "error": null,
  "data": {
    "id": "1",
    "token": "1|xxxxxxxx",
    "firebaseToken": "eyJ...",
    "chatToken": "eyJ...",
    "user": {
      "id": "1",
      "name": "Nome",
      "photoUrl": null,
      "rating": 0,
      "isPro": false,
      "phone": null,
      "plan": "Free"
    }
  }
}
```

## Response de erro

| Caso | Status | Mensagem |
|------|--------|----------|
| Credenciais inválidas | 401 | `Invalid credentials.` |
| Validação falhou | 422 | Erros de validação no padrão da API |

## Resolução do plano no login

O backend busca o `UserPlan` ativo do usuário (`status = active`, `expires_at` nulo ou futuro), com relacionamento `plan`, e retorna o `name` do plano. Se não houver, retorna `"Free"`.

## Dependências

- Laravel Sanctum (`personal_access_tokens`)
- Credencial Firebase Admin em `storage/app/private/neggo-cca92-firebase-adminsdk-fbsvc-08a57c1b0c.json`
- Pacote Kreait Firebase

## Estados de UI esperados

- Loading no botão durante a requisição
- Mensagem de erro amigável em falha de credenciais
- Link para `/register`
- Botão/link “Esqueci a senha” (hoje UI-only — ver [lembrar-senha.md](./lembrar-senha.md))

## Segurança

- Senha nunca retornada na response
- Token Sanctum é de sessão única (`neggo-session`)
- Firebase UID amarrado ao id numérico do usuário Laravel (string)

## Gaps / débitos técnicos

- Sem rate limiting explícito documentado na feature de login
- Sem 2FA / e-mail verification
- Lembrar senha não implementado no backend
