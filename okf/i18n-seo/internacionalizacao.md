# Internacionalização (i18n)

## Objetivo

Suportar múltiplos idiomas na SPA, alinhado aos mercados-alvo (PT, ES, EN, Guaraní).

## Implementação

| Item | Valor |
|------|--------|
| Contexto | `neggo-front/src/contexts/LanguageContext.tsx` |
| Estratégia | Dicionário grande in-memory (`translations`) |
| Persistência | Cliente (contexto / localStorage) |
| Backend | Sem i18n de API |

## Idiomas

- `pt-BR` — Português Brasil
- `es` — Español
- `en` — English  
- `py` — Guaraní

## Superfícies traduzidas

- Landing, Login, Register
- Home, Explore, Create, Detail
- Chat (labels de UI, não conteúdo das mensagens)
- Plans (inclusive formatação de preço por idioma)
- Profile, Settings
- Empty states, botões, erros de UI

## Como adicionar uma string

1. Incluir key em todos os mapas de idioma.
2. Consumir via hook/contexto (`t('key')` ou equivalente).
3. Evitar hardcoded PT/ES no JSX.

## Integração com SEO

`html lang` e meta description devem acompanhar o idioma ativo (ver [seo.md](./seo.md)).

## Limitações

| Área | Limite |
|------|--------|
| Anúncios UGC | Sem tradução automática |
| Chat | Mensagens no idioma do usuário |
| Erros Laravel | Muitos em inglês ou PT fixo |
| Categorias | Keys fixas; labels traduzidos na UI |
| E-mails | Sem templates i18n (e fluxos de e-mail ainda não produto) |

## Mercados-alvo de produto

Brasil, Paraguai, Argentina, Uruguai — justifica PT/ES + Guaraní; EN como língua adicional.

## Gaps

- Cobertura incompleta possível em `py`
- Sem pluralização/ICU MessageFormat avançado (depende do que o mapa faz)
- Sem detecção automática por `Accept-Language` no primeiro visit (pode haver default)
- Preços de planos hardcoded por idioma ≠ fonte Stripe
