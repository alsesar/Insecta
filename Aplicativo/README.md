# Aplicativo Insecta

Aplicativo educacional feito com Expo, React Native e TypeScript. As telas usam
Expo Router e podem ser executadas na web, em emuladores e em dispositivos
compatíveis.

## Executar com PostgreSQL

Na raiz do repositório, instale os requisitos do servidor:

```bash
python3 -m pip install -r Servidor/requirements.txt
cp Servidor/.env.example Servidor/.env
```

Configure a conexão PostgreSQL em `Servidor/.env`. Para uma base nova, aplique
`Servidor/estrutura_banco.sql`. Para uma base existente, confira a estrutura e
aplique `Servidor/migracoes/001_integracao_aplicativo.sql`. A migração não
transfere os dados do antigo SQLite.

Inicie o servidor dentro de `Servidor/`:

```bash
python app.py
```

A API escuta na porta `5000`; o caminho `/health` verifica a conexão com o
PostgreSQL.

Em outro terminal, dentro de `Aplicativo/`, instale as dependências fixadas
pelo npm e inicie a versão web:

```bash
npm ci
npx expo start --web
```

A URL padrão da API para navegador e simulador iOS é
`http://127.0.0.1:5000`; para o emulador Android é `http://10.0.2.2:5000`.
Para um dispositivo físico ou outro host, defina `EXPO_PUBLIC_API_URL` antes de
iniciar o Expo, por exemplo:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.20:5000 npx expo start
```

O dispositivo e o servidor precisam estar na mesma rede. Ao expor o serviço fora
da rede local, use HTTPS.

## Armazenamento

Contas, perfil, progresso, fotos e amizades são armazenados no PostgreSQL pelo
servidor. Os dados não são sincronizados automaticamente do SQLite antigo.
O tema e o token de sessão ficam no dispositivo; perguntas e conteúdo estático
são distribuídos com o aplicativo.

## Organização do código

As telas estão em `src/app/`; componentes reutilizáveis ficam em
`src/componentes/`; chamadas HTTP e sessão ficam em `src/servicos/`; regras
auxiliares ficam em `src/utilitarios/`. O diretório `src/app/` e arquivos como
`_layout.tsx` são convenções exigidas pelo Expo Router.

Consulte o [guia técnico](../docs/GUIA_CODIGO.md) para a descrição dos módulos
do projeto e dos fluxos entre telas, API e banco.

## Reiniciar a estrutura do projeto

O roteiro opcional `npm run reiniciar-projeto` recria a estrutura inicial e pode
remover as pastas atuais `src/` e `roteiros/`. **Faça uma cópia de segurança e
leia as confirmações antes de executá-lo.** Ele não é necessário para executar
o aplicativo.
