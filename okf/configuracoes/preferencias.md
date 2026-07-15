# Configurações — Preferências de contato e privacidade

## Objetivo

Permitir ao usuário escolher como quer ser contatado em anúncios e se mostra a foto, além de logout.

## Rota / tela

| Item | Valor |
|------|--------|
| Rota | `/settings` |
| Página | `Settings.tsx` |
| Auth | Protegida |

## Preferências da UI

| Preferência | Opções típicas | Uso pretendido |
|-------------|----------------|----------------|
| Modo de contato | Chat only vs Chat + telefone | CTA de telefone no `AdDetail` |
| Mostrar foto | on/off | Exibição de avatar |
| Idioma | ver [idioma.md](./idioma.md) | UI strings |

Também: **Logout**.

## Persistência atual

Settings chama algo como `updateProfile({ preferences: { ... } })`.

### Backend

`PUT /api/profile` aceita apenas `name`, `phone`, `photoUrl`.

**Não há coluna/validação de `preferences`.**  
Consequência: preferências sobem no request e são **ignoradas**; UI pode manter estado local até refresh/logout.

## Impacto no AdDetail

O CTA de telefone/WhatsApp depende de prefs no objeto seller. Como a API de ads carrega o seller a partir do model User **sem preferences**, o comportamento “mostrar telefone” é pouco confiável / raramente true a partir do servidor.

## Logout

Ver fluxo em [sessao.md](../autenticacao/sessao.md): limpa tokens e redireciona.

## Spec desejada (para fechar a feature)

1. Migration: `users.preferences` JSON (ou colunas `contact_mode`, `show_photo`).
2. Validar no `ProfileController@update`.
3. Incluir preferences em `GET /profile` e no `transformAd` seller payload.
4. AdDetail lê `seller.preferences.contactMode`.
5. i18n das labels de settings.

## Checklist done

- [ ] Persistência real no backend
- [ ] Seller payload expõe prefs necessárias
- [ ] Defaults sensatos (chat-only)
- [ ] Sync multi-device
- [ ] Testes de CTA telefone on/off
