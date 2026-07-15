# Registro (Register)

## Objetivo

Criar uma nova conta de usuário no Neggo com nome, e-mail e senha (telefone opcional). Após o registro bem-sucedido, o usuário **não** é logado automaticamente — é redirecionado para o login.

## Rota / tela

| Item | Valor |
|------|--------|
| Rota frontend | `/register` |
| Página | `neggo-front/src/pages/Register.tsx` |
| Controller | `app/Http/Controllers/Api/AuthController.php` → `register` |
| Modelo | `app/Models/User.php` |

## Fluxo completo

1. Usuário acessa `/register`.
2. Preenche formulário: nome, e-mail, senha, telefone (opcional).
3. Frontend chama `POST /api/auth/register`.
4. Backend valida e cria o `User` (password hashed pelo cast do Eloquent).
5. Response `ok(null)` — sem token.
6. Frontend redireciona para `/login` para autenticação explícita.

## Request

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha12345",
  "phone": "+595981000000"
}
```

### Validações (backend)

| Campo | Regras |
|-------|--------|
| `name` | required, string, max:255 |
| `email` | required, email, max:255, unique:users,email |
| `password` | required, Password::min(8) |
| `phone` | nullable, string, max:30 |

## Response de sucesso

```json
{
  "success": true,
  "error": null,
  "data": null
}
```

## Response de erro

| Caso | Status | Exemplo |
|------|--------|---------|
| E-mail já cadastrado | 422 | `email` unique |
| Senha curta | 422 | mínimo 8 caracteres |
| Campos obrigatórios ausentes | 422 | validação Laravel |

## Dados criados no banco (`users`)

| Coluna | Origem |
|--------|--------|
| `name` | request |
| `email` | request |
| `password` | request (hash) |
| `phone` | request (opcional) |
| `photo_url` | null (default) |
| `rating` | default do schema |
| `is_pro` | false (default) |

## Estados de UI esperados

- Validação client-side básica (campos vazios / senha mínima)
- Loading durante submit
- Erro se e-mail duplicado
- Link para `/login` (“já tem conta?”)

## O que NÃO acontece no registro

- Não emite Sanctum token
- Não emite Firebase token
- Não envia e-mail de verificação
- Não cria plano pago (usuário fica no limiar Free)
- Não cria preferências persistidas no backend

## Gaps / débitos técnicos

- Sem confirmação de senha obrigatória no contrato da API (pode existir só no UI)
- Sem verificação de e-mail
- Telefone sem formatação/máscara internacional padronizada no backend
