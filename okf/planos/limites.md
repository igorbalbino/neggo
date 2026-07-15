# Planos — Limites de anúncios

## Objetivo

Restringir quantos anúncios **ativos** um vendedor pode ter, de acordo com o plano.

## Onde é enforced

`AdController@store` → `resolveAdLimitForUser($userId)` **antes** de criar o anúncio.

## Como resolve o plano

1. Busca `UserPlan` ativo do user (`status = active`, `expires_at` nulo ou ≥ now).
2. Pega `plan.name` (eager load).
3. Se não houver → trata como `"Free"`.
4. Normaliza: `mb_strtolower(trim($planName))`.
5. Match:

| Key | Limite | Retorno da função |
|-----|--------|-------------------|
| `free` | 2 | `2` |
| `essencial` | 5 | `5` |
| `profissional` | 25 | `25` |
| `empresarial` | ilimitado | `null` |
| default | 2 | `2` |

Se limite não for `null` e `count(active ads) >= limit` → **403** com mensagem:

> Você atingiu o limite de anúncios do seu plano ({limit}). Faça upgrade para publicar mais.

## O que conta no limite

Somente anúncios com `status = 'active'` do `seller_id`.

**Não** contam (para liberar slot): sold, cancelled, deletados — desde que o status seja atualizado ou o registro removido.

## O que o limite NÃO controla

- Favoritos
- Chats
- Boost (custo à parte)
- Upload de imagens (só auth)
- Número de locais por anúncio

## Inconsistências conhecidas

| Fonte | Nomes |
|-------|-------|
| AdController limits | free, essencial, profissional, empresarial |
| Frontend Plans UI | Free, Essencial, Profissional, Empresarial |
| DatabaseSeeder | Starter / Pro / Business (possível mismatch!) |

Se o seeder gravar `"Pro"`, o match cai em **default → 2**, mesmo usuário “pago”.

## UX ao atingir limite

- Erro 403 no create
- Ideal: impedir no step 1 do wizard com mensagem + link `/plans` (pode estar só no tratamento de erro pós-submit)

## Melhorias

- Single source of truth (config/table `max_active_ads` no model Plan)
- Contar e exibir “2/5 anúncios usados” no perfil / create
- Testes unitários do match case-insensitive e plans desconhecidos
