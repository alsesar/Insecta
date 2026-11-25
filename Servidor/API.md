# API do Insecta

Base local: `http://127.0.0.1:5000`. JSON usa UTF-8. Rotas autenticadas recebem
`Authorization: Bearer <token>`. Erros são enviados como `{"error":"..."}`.

## Preparação do PostgreSQL

Os caminhos HTTP `/signup` e `/login` permanecem em inglês por integrarem o
contrato técnico usado pelo aplicativo; os rótulos e mensagens da interface
devem permanecer em português.

1. Configure `Servidor/.env` com base, usuário e senha PostgreSQL (use `.env.example`
   como modelo; nunca versione `.env`).
2. Em banco vazio, aplique `estrutura_banco.sql`.
3. Em banco que já contém as tabelas antigas, inspecione as colunas e aplique
   `migracoes/001_integracao_aplicativo.sql`. A migração não importa dados do SQLite.
4. Confirme tabelas e tipos no banco real antes de executar a migração.

```bash
psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -f estrutura_banco.sql
# ou, para a base existente:
psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" \
  -f migracoes/001_integracao_aplicativo.sql
```

Para desenvolvimento, `CORS_ORIGIN` pode ser `*` ou a origem do Expo Web. Em
produção, use uma origem explícita, HTTPS, `FLASK_DEBUG=0` e um servidor WSGI.

## Rotas

| Método | Rota | Autenticação | Corpo / resultado |
|---|---|---|---|
| `GET` | `/health` | Não | `200 {"status":"ok","database":"PostgreSQL"}` ou `503` |
| `POST` | `/signup` | Não | `{nome,email,senha}`; `201 {"message":...}` |
| `POST` | `/login` | Não | `{email,senha}`; `200 {token,expira_em,usuario}` |
| `POST` | `/logout` | Bearer | `204`; invalida a sessão atual |
| `GET` | `/me` | Bearer | `{usuario:{id_usuario,email,nome,apelido,nivel,foto_url},progresso}` |
| `PATCH` | `/me` | Bearer | `{apelido?}` e/ou `{nivel?}`; responde `{usuario}` |
| `PUT` | `/me/foto` | Bearer | multipart `foto`; responde `{foto_url}` |
| `GET` | `/fotos/<uuid>` | Não | Imagem armazenada no PostgreSQL |
| `GET` | `/progresso` | Bearer | Mapa `{ "1": 100, ... }` |
| `PUT` | `/progresso/<1..7>` | Bearer | `{percentual:0..100}`; responde `{progresso}` |
| `GET` | `/social/ranking` | Bearer | Lista do usuário e amigos |
| `POST` | `/social/amigos` | Bearer | `{apelido}`; `201` após amizade simétrica |
| `POST` | `/senha/esqueci` | Não | `{email}`; resposta neutra `200` |
| `POST` | `/senha/redefinir` | Não | `{email,codigo,nova_senha}`; invalida sessões existentes |
| `GET` | `/conteudo` | Não | Lista de títulos e níveis de conteúdo |
| `GET` | `/admin/estatisticas` | Bearer admin | Estatísticas administrativas |
| `GET` | `/admin/usuarios` | Bearer admin | Usuários cadastrados |

O cadastro normaliza o email e gera `id_usuario` no servidor. A senha precisa
ter pelo menos oito caracteres, letras maiúsculas e minúsculas, número e símbolo.
Os apelidos são normalizados em NFKC, limitados a 40 caracteres e únicos sem
diferenciar maiúsculas. O nível permitido é `iniciante`, `intermediario` ou
`avancado`.

O progresso é monotônico: uma atualização não reduz o percentual salvo; para
registrar uma atividade posterior, a atividade imediatamente anterior precisa
estar em 100%. As fotos aceitas são JPEG, PNG e WebP, limitadas a 5 MB e
validadas pela assinatura dos bytes.

Os códigos de recuperação expiram em cinco minutos e são de uso único. Configure
`EMAIL_USER`, `EMAIL_PASS` e, se necessário, `SMTP_HOST` para envio por SMTP.
Sem SMTP, o código aparece somente no log local do servidor.
