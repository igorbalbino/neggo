# Configurações — Idioma

## Objetivo

Permitir que o usuário troque o idioma da interface (i18n client-side).

## Onde

| Item | Valor |
|------|--------|
| Tela Settings | `/settings` → `Settings.tsx` |
| Também na Landing | Language dropdown |
| Contexto | `LanguageContext.tsx` |

## Idiomas suportados

| Code | Idioma |
|------|--------|
| `pt-BR` | Português (Brasil) |
| `es` | Espanhol |
| `en` | Inglês |
| `py` | Guaraní (mais completo em Settings) |

## Comportamento

1. Usuário seleciona idioma.
2. `LanguageContext` troca o dicionário ativo (`translations` map).
3. Persistência no cliente (localStorage / estado do contexto).
4. Componente `SEO` / `html lang` acompanha quando aplicável.

## O que é traduzido

- Strings de UI (botões, labels, empty states, marketing)
- Labels de categorias (display)
- Textos de planos (preços formatados por idioma podem mudar)

## O que NÃO é traduzido automaticamente

- Conteúdo gerado pelo usuário (títulos/descrições de anúncios)
- Mensagens de chat
- Algumas mensagens de erro do backend (ex.: limite de anúncios em PT fixo)

## Relação com preferências

Troca de idioma em Settings pode chamar `updateProfile({ preferences })` junto com outras prefs — mas o **backend ignora preferences**. O idioma efetivo é 100% client-side via contexto.

## Gaps

- Idioma não sincroniza entre dispositivos
- Backend errors monolíngues
- Guaraní coverage depende da completude do mapa `translations`
