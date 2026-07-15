<?php

namespace App\Mcp;

class McpCatalog
{
    /**
     * @return list<array{id: string, label: string, description: string}>
     */
    public static function scopes(): array
    {
        return [
            [
                'id' => 'ads.read',
                'label' => 'Ler anúncios',
                'description' => 'Listar e ver detalhes de anúncios públicos.',
            ],
            [
                'id' => 'ads.write',
                'label' => 'Criar/excluir anúncios',
                'description' => 'Publicar e excluir anúncios do usuário autenticado.',
            ],
            [
                'id' => 'ads.boost',
                'label' => 'Impulsionar anúncios',
                'description' => 'Iniciar checkout de boost para anúncios próprios.',
            ],
            [
                'id' => 'my_ads.read',
                'label' => 'Meus anúncios',
                'description' => 'Listar anúncios do usuário autenticado.',
            ],
            [
                'id' => 'favorites.read',
                'label' => 'Ler favoritos',
                'description' => 'Listar anúncios favoritados.',
            ],
            [
                'id' => 'favorites.write',
                'label' => 'Gerenciar favoritos',
                'description' => 'Adicionar ou remover favoritos.',
            ],
            [
                'id' => 'profile.read',
                'label' => 'Ler perfil',
                'description' => 'Ler dados do perfil do usuário.',
            ],
            [
                'id' => 'profile.write',
                'label' => 'Editar perfil',
                'description' => 'Atualizar nome, telefone e foto.',
            ],
            [
                'id' => 'plans.read',
                'label' => 'Ler planos',
                'description' => 'Listar planos de assinatura disponíveis.',
            ],
            [
                'id' => 'chats.read',
                'label' => 'Ler chats',
                'description' => 'Listar conversas e mensagens (API Laravel).',
            ],
            [
                'id' => 'chats.write',
                'label' => 'Enviar mensagens',
                'description' => 'Enviar mensagens em chats existentes.',
            ],
        ];
    }

    /**
     * @return list<string>
     */
    public static function scopeIds(): array
    {
        return array_column(self::scopes(), 'id');
    }

    /**
     * Full capability catalog for agents.
     *
     * @return list<array<string, mixed>>
     */
    public static function capabilities(): array
    {
        return [
            [
                'id' => 'list_ads',
                'scope' => 'ads.read',
                'method' => 'GET',
                'path' => '/mcp/ads',
                'summary' => 'Lista anúncios ativos (boosted primeiro).',
                'params' => [],
                'responses' => [
                    '200' => 'Lista de anúncios em data.',
                    '401' => 'PAT inválido ou expirado.',
                    '403' => 'Scope ads.read ausente.',
                ],
            ],
            [
                'id' => 'get_ad',
                'scope' => 'ads.read',
                'method' => 'GET',
                'path' => '/mcp/ads/{id}',
                'summary' => 'Detalhe de um anúncio pelo id.',
                'params' => [
                    ['name' => 'id', 'in' => 'path', 'type' => 'string', 'required' => true, 'description' => 'ID do anúncio'],
                ],
                'responses' => [
                    '200' => 'Anúncio em data.',
                    '404' => 'Anúncio não encontrado ou inativo.',
                    '401' => 'PAT inválido ou expirado.',
                    '403' => 'Scope ads.read ausente.',
                ],
            ],
            [
                'id' => 'create_ad',
                'scope' => 'ads.write',
                'method' => 'POST',
                'path' => '/mcp/ads',
                'summary' => 'Cria um anúncio (respeita limite do plano).',
                'params' => [
                    ['name' => 'title', 'in' => 'body', 'type' => 'string', 'required' => true],
                    ['name' => 'description', 'in' => 'body', 'type' => 'string', 'required' => true],
                    ['name' => 'price', 'in' => 'body', 'type' => 'number|string', 'required' => false, 'description' => 'Número ou "negotiable"'],
                    ['name' => 'isNational', 'in' => 'body', 'type' => 'boolean', 'required' => true],
                    ['name' => 'locations', 'in' => 'body', 'type' => 'array', 'required' => false],
                    ['name' => 'type', 'in' => 'body', 'type' => 'string', 'required' => true, 'description' => 'product|service'],
                    ['name' => 'category', 'in' => 'body', 'type' => 'string', 'required' => true],
                    ['name' => 'images', 'in' => 'body', 'type' => 'array', 'required' => false, 'description' => 'URLs de /storage/img'],
                    ['name' => 'condition', 'in' => 'body', 'type' => 'string', 'required' => false, 'description' => 'new|used'],
                    ['name' => 'serviceType', 'in' => 'body', 'type' => 'string', 'required' => false, 'description' => 'remote|in_person'],
                ],
                'responses' => [
                    '200' => 'Anúncio criado em data.',
                    '403' => 'Limite de plano ou scope ausente.',
                    '422' => 'Validação falhou.',
                ],
            ],
            [
                'id' => 'delete_ad',
                'scope' => 'ads.write',
                'method' => 'DELETE',
                'path' => '/mcp/ads/{id}',
                'summary' => 'Exclui um anúncio próprio.',
                'params' => [
                    ['name' => 'id', 'in' => 'path', 'type' => 'string', 'required' => true],
                ],
                'responses' => [
                    '200' => 'Excluído.',
                    '403' => 'Não é o dono ou scope ausente.',
                ],
            ],
            [
                'id' => 'boost_ad',
                'scope' => 'ads.boost',
                'method' => 'POST',
                'path' => '/mcp/ads/{id}/boost',
                'summary' => 'Cria sessão Stripe de boost; não ativa antes do pagamento.',
                'params' => [
                    ['name' => 'id', 'in' => 'path', 'type' => 'string', 'required' => true],
                ],
                'responses' => [
                    '200' => '{ checkoutUrl } em data.',
                    '403' => 'Não é o dono ou scope ausente.',
                ],
            ],
            [
                'id' => 'list_my_ads',
                'scope' => 'my_ads.read',
                'method' => 'GET',
                'path' => '/mcp/my-ads',
                'summary' => 'Lista anúncios do usuário autenticado pelo PAT.',
                'params' => [],
                'responses' => [
                    '200' => 'Lista em data.',
                    '403' => 'Scope my_ads.read ausente.',
                ],
            ],
            [
                'id' => 'list_favorites',
                'scope' => 'favorites.read',
                'method' => 'GET',
                'path' => '/mcp/favorites',
                'summary' => 'Lista anúncios favoritados.',
                'params' => [],
                'responses' => [
                    '200' => 'Lista em data.',
                    '403' => 'Scope favorites.read ausente.',
                ],
            ],
            [
                'id' => 'toggle_favorite',
                'scope' => 'favorites.write',
                'method' => 'POST',
                'path' => '/mcp/ads/{id}/favorite',
                'summary' => 'Alterna favorito no anúncio.',
                'params' => [
                    ['name' => 'id', 'in' => 'path', 'type' => 'string', 'required' => true],
                ],
                'responses' => [
                    '200' => 'Toggle ok.',
                    '403' => 'Scope favorites.write ausente.',
                ],
            ],
            [
                'id' => 'get_profile',
                'scope' => 'profile.read',
                'method' => 'GET',
                'path' => '/mcp/profile',
                'summary' => 'Perfil do usuário dono do PAT.',
                'params' => [],
                'responses' => [
                    '200' => 'Perfil em data.',
                    '403' => 'Scope profile.read ausente.',
                ],
            ],
            [
                'id' => 'update_profile',
                'scope' => 'profile.write',
                'method' => 'PUT',
                'path' => '/mcp/profile',
                'summary' => 'Atualiza nome, telefone e/ou photoUrl.',
                'params' => [
                    ['name' => 'name', 'in' => 'body', 'type' => 'string', 'required' => false],
                    ['name' => 'phone', 'in' => 'body', 'type' => 'string', 'required' => false],
                    ['name' => 'photoUrl', 'in' => 'body', 'type' => 'string', 'required' => false],
                ],
                'responses' => [
                    '200' => 'Perfil atualizado.',
                    '422' => 'URL de foto inválida ou validação.',
                    '403' => 'Scope profile.write ausente.',
                ],
            ],
            [
                'id' => 'list_plans',
                'scope' => 'plans.read',
                'method' => 'GET',
                'path' => '/mcp/plans',
                'summary' => 'Lista planos ativos e marca o atual.',
                'params' => [],
                'responses' => [
                    '200' => 'Lista de planos.',
                    '403' => 'Scope plans.read ausente.',
                ],
            ],
            [
                'id' => 'list_chats',
                'scope' => 'chats.read',
                'method' => 'GET',
                'path' => '/mcp/chats',
                'summary' => 'Lista chats do usuário (API Laravel).',
                'params' => [],
                'responses' => [
                    '200' => 'Lista de chats.',
                    '403' => 'Scope chats.read ausente.',
                ],
            ],
            [
                'id' => 'list_messages',
                'scope' => 'chats.read',
                'method' => 'GET',
                'path' => '/mcp/chats/{id}/messages',
                'summary' => 'Lista mensagens de um chat.',
                'params' => [
                    ['name' => 'id', 'in' => 'path', 'type' => 'string', 'required' => true],
                ],
                'responses' => [
                    '200' => 'Mensagens em data.',
                    '403' => 'Não é participante ou scope ausente.',
                ],
            ],
            [
                'id' => 'send_message',
                'scope' => 'chats.write',
                'method' => 'POST',
                'path' => '/mcp/chats/{id}/messages',
                'summary' => 'Envia mensagem de texto em um chat.',
                'params' => [
                    ['name' => 'id', 'in' => 'path', 'type' => 'string', 'required' => true],
                    ['name' => 'text', 'in' => 'body', 'type' => 'string', 'required' => true, 'description' => 'Máx. 5000 caracteres'],
                ],
                'responses' => [
                    '200' => 'Mensagem criada.',
                    '403' => 'Não é participante ou scope ausente.',
                    '422' => 'Validação.',
                ],
            ],
        ];
    }

    /**
     * @param  list<string>  $scopes
     * @return list<array<string, mixed>>
     */
    public static function capabilitiesForScopes(array $scopes): array
    {
        return array_values(array_filter(
            self::capabilities(),
            static fn (array $cap): bool => in_array($cap['scope'], $scopes, true)
        ));
    }
}
