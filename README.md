# Insecta

Aplicativo educacional Expo/React Native com API Flask e PostgreSQL. O
PostgreSQL é a fonte de verdade de contas, sessões, perfil, fotos, progresso e
amizades. A preferência de tema permanece no dispositivo. Perguntas e conteúdo
didático continuam distribuídos com o app.

## PostgreSQL e servidor

Requisitos: Python 3.10+, PostgreSQL e `psql`.

```bash
cd Servidor
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
```

Edite `Servidor/.env` com os dados do PostgreSQL. Para banco vazio, aplique
`estrutura_banco.sql`; para o banco existente, primeiro confira os tipos e restrições e
aplique `migracoes/001_integracao_aplicativo.sql`. **A migração não copia dados do
SQLite** — a importação dos dados locais fica a cargo do responsável pelo banco.
Consulte [Servidor/API.md](./Servidor/API.md).

```bash
psql -h 127.0.0.1 -U SEU_USUARIO -d SUA_BASE -f estrutura_banco.sql
python app.py
```

Para verificar conectividade e estrutura:

```bash
curl http://127.0.0.1:5000/health
```

O exemplo usa `FLASK_HOST=127.0.0.1`. Para acesso de um celular na rede local,
configure `FLASK_HOST=0.0.0.0` e ajuste `EXPO_PUBLIC_API_URL` no app para o IP
do computador. Em produção, use HTTPS, origem CORS restrita e um servidor WSGI;
não use o servidor de desenvolvimento do Flask.

## Aplicativo Expo

Requisitos: Node.js e npm.

```bash
cd Aplicativo
npm ci
npx expo start --web
```

No Firefox, abra o endereço local mostrado pelo Expo (normalmente
`http://localhost:8081`). O app web e o servidor precisam estar ativos ao mesmo
tempo. A URL padrão da API é `http://127.0.0.1:5000`; defina
`EXPO_PUBLIC_API_URL` antes de iniciar o Expo para usar outro host.

## Fluxos disponíveis

Cadastro e acesso, sessão autenticada, perfil, apelido, nível, progresso das sete
atividades, amizades/ranking, foto de perfil e redefinição de senha por código.
Verificações de progresso e relações de amizade são feitas no servidor.

Para entender a organização e o papel de cada parte do projeto, consulte o
[guia de explicação do código](./docs/GUIA_CODIGO.md). Os arquivos-fonte também
contêm comentários explicativos em português nos módulos e trechos relevantes.
