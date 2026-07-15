# Upload de imagens

## Objetivo

Receber imagens autenticadas (avatar e fotos de anúncio), armazená-las e devolver URL pública absoluta.

## API

```http
POST /api/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: <binary>
```

Controller: `UploadController.php`.

## Regras

| Regra | Valor |
|-------|-------|
| Auth | Sanctum obrigatório |
| Campo | `file` |
| Tipo | imagem |
| Tamanho máx. | **5MB** |
| Storage path | `public/img/{uniqid}.{ext}` |
| Response | URL absoluta da imagem |

## Consumidores

| Fluxo | Uso |
|-------|-----|
| Criar anúncio | Upload N imagens → array `images[]` no `POST /api/ads` |
| Editar perfil | Upload 1 avatar → `photoUrl` no `PUT /api/profile` |

## Response típica

```json
{
  "success": true,
  "error": null,
  "data": {
    "url": "https://api-neggo.creatioinc.com/img/xxxx.jpg"
  }
}
```

(Formato exato do `data` conforme implementação do controller.)

## Segurança / ops

- Apenas usuários autenticados
- Sem scan antivirus documentado
- Sem CDN — serve do storage/public do Laravel
- Sem resize/compress no servidor (peso total dos ads = soma dos uploads)
- Extensões devem ser restritas a image mime (jpg/png/webp/gif conforme validation)

## Fluxo no CreateAd

1. Step 3 exige ≥ 1 imagem (regra de UI).
2. Upload sequencial ou paralelo de cada arquivo.
3. Só então cria o anúncio com URLs.
4. Se upload falhar no meio, anúncio não é criado (bom); imagens órfãs podem ficar no disco (gap).

## Gaps

- Sem garbage collection de imagens órfãs
- Sem substituição/remoção seletiva de imagens de um anúncio (não há edit)
- Limite 5MB por arquivo; sem limite documentado de quantidade no backend (`images` array nullable)
- Path `public/img` exige `php artisan storage:link` / servir estáticos corretamente em produção
