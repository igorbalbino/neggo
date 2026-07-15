# Lembrar / recuperar senha

## Objetivo (produto)

Permitir que o usuário solicite redefinição de senha por e-mail quando esquecer as credenciais.

## Status atual

**Não implementado no backend.** Existe apenas indício de UI no fluxo de login (“Esqueci a senha” / forgot password), sem endpoint Laravel, sem fluxo de token por e-mail e sem tela de reset completa amarrada à API.

Configuração de mail existe em `config/mail.php`, mas **não há fluxo de produto** usando-a para reset.

## Rota / tela esperada (desejável)

| Item | Sugestão |
|------|----------|
| Link na tela de login | “Esqueci minha senha” |
| Tela solicitar reset | `/forgot-password` (e-mail) |
| Tela definir nova senha | `/reset-password?token=...` |
| APIs típicas Laravel | `POST /api/auth/forgot-password`, `POST /api/auth/reset-password` |

## Fluxo desejado (especificação)

1. Usuário informa e-mail na tela de “lembrar senha”.
2. Backend valida e-mail; se existir usuário, gera token de reset e envia e-mail com link.
3. Response sempre genérica (não revelar se e-mail existe) — boas práticas.
4. Usuário abre link, define nova senha (mín. 8, confirmação).
5. Backend valida token, atualiza password, invalida tokens Sanctum antigos (recomendado).
6. Redireciona para `/login`.

## O que existe hoje

| Parte | Estado |
|-------|--------|
| Botão/link no Login | UI-only / stub |
| Controller de reset | Ausente |
| Rotas em `routes/api.php` | Ausentes |
| Migration/tabela `password_reset_tokens` | Pode existir no Laravel default; não usada pela feature Neggo |
| Templates de e-mail | Não produtos |

## Impacto

- Usuários que esquecem a senha não têm self-service.
- Suporte manual ou recriação de conta seriam os únicos caminhos operacionais atuais.

## Critérios de “done” para esta funcionalidade

- [ ] Endpoint forgot-password com e-mail
- [ ] Endpoint reset-password com validação
- [ ] Telas frontend + i18n
- [ ] Invalidação de sessões Sanctum após reset
- [ ] Rate limiting anti-abuso
- [ ] Testes de fluxo feliz e token inválido/expirado
