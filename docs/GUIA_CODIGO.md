# Guia de explicação do código do Insecta

Este guia explica como as partes do projeto se conectam e qual é a função de
cada módulo de aplicação. Os comentários no código complementam este documento:
eles destacam responsabilidade, fluxo, regras de negócio, validações e limites
de segurança sem repetir instruções óbvias linha por linha.

## 1. Visão geral

O Insecta é composto por três partes:

1. **Aplicativo:** `Aplicativo/` usa Expo, React Native, TypeScript e Expo
   Router. As telas também podem ser executadas no navegador.
2. **API:** `Servidor/app.py` usa Flask para receber requisições HTTP, validar
   os dados e coordenar as operações.
3. **Banco:** PostgreSQL é a fonte oficial dos dados de conta, perfil, sessão,
   progresso, amizade e foto.

O caminho de uma operação de dados é:

```text
Tela React Native
    -> serviço HTTP do aplicativo (src/servicos/servico-api.ts)
    -> rota Flask (Servidor/app.py)
    -> autenticação e validações
    -> PostgreSQL (Servidor/conexao.py)
    -> resposta JSON
    -> atualização da tela
```

As telas não devem abrir uma conexão direta com PostgreSQL. Isso manteria
credenciais de banco no cliente e permitiria contornar as regras do servidor.
Por isso, as regras de autenticação, perfil, progresso e amizades ficam na API.
O tema é uma preferência local; as perguntas didáticas são dados distribuídos
junto com o aplicativo.

## 2. Como iniciar e configurar

### Servidor

`Servidor/requirements.txt` lista Flask, psycopg, Werkzeug, python-dotenv e
pytest. `Servidor/.env.example` documenta as variáveis esperadas; copie-o para
`.env` e preencha as credenciais localmente. Não versione nem compartilhe esse
arquivo.

`Servidor/estrutura_banco.sql` cria as tabelas para uma instalação nova. Em uma base que
já tinha tabelas, a migração `Servidor/migracoes/001_integracao_aplicativo.sql`
adiciona a estrutura necessária sem remover dados. Ela não importa os dados do
SQLite antigo.

Execute o servidor a partir de `Servidor/` com `python app.py`. A API fica na
porta 5000 por padrão. `GET /health` testa a conexão com PostgreSQL.

### Aplicativo

Em `Aplicativo/`, `npm ci` instala as dependências declaradas no manifesto e
fixadas por `package-lock.json`. `npx expo start --web` inicia o Expo Web.
`EXPO_PUBLIC_API_URL` substitui a URL padrão da API quando o servidor não está
no host padrão do ambiente. A configuração para navegador, simulador e
dispositivo físico está descrita também em `Aplicativo/README.md`.

O aplicativo e o servidor precisam estar ativos ao mesmo tempo. O servidor também
precisa aceitar, via CORS, a origem usada para abrir o aplicativo.

## 3. Servidor: responsabilidade por arquivo

### API e conexão

- [`Servidor/app.py`](../Servidor/app.py) é a camada HTTP. Declara as rotas,
  lê corpo e cabeçalhos, executa validações de fluxo, chama os módulos de banco
  e forma respostas JSON e códigos HTTP. Também trata erros comuns, CORS,
  upload de foto, recuperação de senha e rotas administrativas protegidas.
- [`Servidor/conexao.py`](../Servidor/conexao.py) centraliza a leitura da
  configuração e a abertura de conexões PostgreSQL. Usar um ponto central evita
  espalhar host, usuário e senha nas rotas.
- [`Servidor/requirements.txt`](../Servidor/requirements.txt) registra as
  bibliotecas Python necessárias para rodar e testar a API.
- [`Servidor/.env.example`](../Servidor/.env.example) é um modelo de
  configuração sem segredos reais.

### Conta e autenticação

- [`Servidor/cadastro.py`](../Servidor/cadastro.py) contém a operação de
  criação de conta no banco. As consultas usam parâmetros, em vez de montar SQL
  concatenando dados enviados pelo usuário.
- [`Servidor/autenticacao.py`](../Servidor/autenticacao.py) contém a lógica de
  autenticação; a rota HTTP coordena o acesso e a emissão da sessão.
- [`Servidor/criptografia.py`](../Servidor/criptografia.py) reúne operações
  criptográficas usadas pelo projeto, como tratamento seguro de senha.
- [`Servidor/seguranca.py`](../Servidor/seguranca.py) contém verificações e
  regras de segurança reutilizáveis.
- [`Servidor/sessao.py`](../Servidor/sessao.py) cria e valida sessões Bearer e
  invalida sessões encerradas. O cliente apresenta o token; a API decide se ele
  ainda é válido.
- [`Servidor/token_insecta.py`](../Servidor/token_insecta.py) contém funções
  relacionadas a token mantidas no código do projeto; consulte os comentários
  do módulo para distinguir esse fluxo das sessões HTTP usadas pela API.
- [`Servidor/verificacao.py`](../Servidor/verificacao.py) concentra
  verificações de entrada e regras de validação compartilhadas por operações
  do servidor.

### Dados e páginas administrativas

- [`Servidor/conteudo.py`](../Servidor/conteudo.py) consulta o conteúdo
  didático oferecido pelo servidor.
- [`Servidor/pagina_usuario.py`](../Servidor/pagina_usuario.py) reúne
  operações de consulta de informações do usuário no código de domínio.
- [`Servidor/administrador.py`](../Servidor/administrador.py) representa operações e verificações
  relacionadas a administradores.
- [`Servidor/permissoes.py`](../Servidor/permissoes.py) contém regras de
  permissões administrativas.
- [`Servidor/pagina_administracao.py`](../Servidor/pagina_administracao.py) prepara consultas e
  dados apresentados nas funcionalidades administrativas.

### Banco, migração e testes

- [`Servidor/estrutura_banco.sql`](../Servidor/estrutura_banco.sql) define as tabelas,
  relacionamentos, chaves e índices de uma instalação nova.
- [`Servidor/migracoes/001_integracao_aplicativo.sql`](../Servidor/migracoes/001_integracao_aplicativo.sql)
  complementa um banco existente para suportar os fluxos do aplicativo. A
  migração é aditiva; revise a estrutura real antes de aplicá-la em outro banco.
- [`Servidor/testes/conftest.py`](../Servidor/testes/conftest.py) prepara os
  recursos compartilhados pelos testes pytest.
- [`Servidor/testes/testes_api.py`](../Servidor/testes/testes_api.py) verifica
  contratos importantes da API, incluindo autenticação, validação e CORS.
- [`Servidor/teste.py`](../Servidor/teste.py) e
  [`Servidor/teste_completo.py`](../Servidor/teste_completo.py) são roteiros de
  teste auxiliares separados da suíte pytest principal.

## 4. Aplicativo: navegação e telas

O Expo Router transforma arquivos em `src/app/` em rotas. Parênteses em
`(tabs)` agrupam telas de navegação sem fazer parte do endereço da URL.

### Inicialização e navegação

- [`Aplicativo/src/app/_layout.tsx`](../Aplicativo/src/app/_layout.tsx)
  define a estrutura raiz da navegação e os provedores compartilhados.
- [`Aplicativo/src/app/index.tsx`](../Aplicativo/src/app/index.tsx) é a
  rota inicial que direciona o usuário para o fluxo apropriado.
- [`Aplicativo/src/app/(tabs)/_layout.tsx`](../Aplicativo/src/app/%28tabs%29/_layout.tsx)
  configura a navegação por abas.
- [`Aplicativo/src/app/(tabs)/index.tsx`](../Aplicativo/src/app/%28tabs%29/index.tsx)
  apresenta a área principal do usuário e resume informações carregadas pela API.
- [`Aplicativo/src/app/(tabs)/social.tsx`](../Aplicativo/src/app/%28tabs%29/social.tsx)
  exibe a área social, ranking e ações de amizade.
- [`Aplicativo/src/app/(tabs)/perfil.tsx`](../Aplicativo/src/app/%28tabs%29/perfil.tsx)
  apresenta perfil e ações relacionadas aos dados pessoais, incluindo foto.

### Cadastro, sessão e recuperação de acesso

- [`Aplicativo/src/app/cadastro.tsx`](../Aplicativo/src/app/cadastro.tsx)
  coleta dados para criar conta e envia o pedido à API.
- [`Aplicativo/src/app/entrar.tsx`](../Aplicativo/src/app/entrar.tsx)
  envia credenciais, recebe uma sessão e inicia a navegação autenticada.
- [`Aplicativo/src/app/recuperar-email.tsx`](../Aplicativo/src/app/recuperar-email.tsx)
  inicia o pedido de código de recuperação por email.
- [`Aplicativo/src/app/redefinir-senha.tsx`](../Aplicativo/src/app/redefinir-senha.tsx)
  envia o código e a nova senha para finalizar a recuperação.
- [`Aplicativo/src/app/apelido.tsx`](../Aplicativo/src/app/apelido.tsx)
  configura o apelido do perfil via API.
- [`Aplicativo/src/app/nivel.tsx`](../Aplicativo/src/app/nivel.tsx),
  [`Aplicativo/src/app/nivel-intro.tsx`](../Aplicativo/src/app/nivel-intro.tsx),
  [`Aplicativo/src/app/nivel-transicao.tsx`](../Aplicativo/src/app/nivel-transicao.tsx)
  e [`Aplicativo/src/app/nivel-confirmar.tsx`](../Aplicativo/src/app/nivel-confirmar.tsx)
  formam as telas do fluxo de escolha e confirmação de nível.

### Conteúdo e atividades

- [`Aplicativo/src/app/intro.tsx`](../Aplicativo/src/app/intro.tsx)
  apresenta a introdução do aplicativo.
- [`Aplicativo/src/app/atividade.tsx`](../Aplicativo/src/app/atividade.tsx)
  lista/organiza atividades disponíveis.
- [`Aplicativo/src/app/atividade/[id].tsx`](../Aplicativo/src/app/atividade/[id].tsx)
  representa a rota de atividade identificada por parâmetro.
- [`Aplicativo/src/app/atividade-final.tsx`](../Aplicativo/src/app/atividade-final.tsx)
  mantém outra tela do fluxo de atividades existente no projeto.
- [`Aplicativo/src/app/questionario/[id].tsx`](../Aplicativo/src/app/questionario/[id].tsx)
  apresenta o questionário da atividade selecionada e envia o progresso concluído ao
  servidor.
- [`Aplicativo/src/componentes/atividades/[id].tsx`](../Aplicativo/src/componentes/atividades/[id].tsx)
  implementa o conteúdo de atividade por identificador.
- [`Aplicativo/src/dados/perguntas.ts`](../Aplicativo/src/dados/perguntas.ts)
  fornece os dados estáticos das perguntas distribuídos com o aplicativo; não
  é o armazenamento de progresso do usuário.

### Telas auxiliares

- [`Aplicativo/src/app/ajuda.tsx`](../Aplicativo/src/app/ajuda.tsx)
  exibe informações de ajuda.
- [`Aplicativo/src/app/opiniao.tsx`](../Aplicativo/src/app/opiniao.tsx)
  contém a interface de opinião.
- [`Aplicativo/src/app/notificacoes.tsx`](../Aplicativo/src/app/notificacoes.tsx)
  contém a tela de notificações.
- [`Aplicativo/src/app/sobre.tsx`](../Aplicativo/src/app/sobre.tsx)
  apresenta informações sobre o aplicativo.

## 5. Aplicativo: componentes e serviços

### Componentes reutilizáveis

- [`Aplicativo/src/componentes/botao.tsx`](../Aplicativo/src/componentes/botao.tsx)
  padroniza botões reutilizados pelas telas.
- [`Aplicativo/src/componentes/campo-entrada.tsx`](../Aplicativo/src/componentes/campo-entrada.tsx)
  padroniza entradas de texto.
- [`Aplicativo/src/componentes/janela-modal.tsx`](../Aplicativo/src/componentes/janela-modal.tsx)
  encapsula a apresentação de diálogos modais.
- [`Aplicativo/src/componentes/atividades/aviso-simples.tsx`](../Aplicativo/src/componentes/atividades/aviso-simples.tsx)
  apresenta avisos simples no contexto das atividades.
- [`Aplicativo/src/componentes/cabecalho-progresso.tsx`](../Aplicativo/src/componentes/cabecalho-progresso.tsx)
  apresenta informações de cabeçalho relacionadas ao progresso.
- [`Aplicativo/src/componentes/circulo-progresso.tsx`](../Aplicativo/src/componentes/circulo-progresso.tsx)
  desenha um indicador visual circular de progresso.
- [`Aplicativo/src/componentes/multipla-escolha.tsx`](../Aplicativo/src/componentes/multipla-escolha.tsx)
  organiza interação e seleção de respostas de múltipla escolha.

### Estado, serviços e regras locais

- [`Aplicativo/src/contextos/tema.tsx`](../Aplicativo/src/contextos/tema.tsx)
  fornece o tema da interface às telas e componentes.
- [`Aplicativo/src/servicos/servico-api.ts`](../Aplicativo/src/servicos/servico-api.ts)
  centraliza as chamadas HTTP. Define a URL da API, envia JSON ou arquivos,
  acrescenta o token Bearer quando necessário, interpreta erros e expõe funções
  tipadas para as rotas do servidor.
- [`Aplicativo/src/servicos/sessao.ts`](../Aplicativo/src/servicos/sessao.ts)
  guarda e recupera a sessão no armazenamento local do dispositivo. O token
  permite autenticar as chamadas, mas os dados de conta continuam no servidor.
- [`Aplicativo/src/utilitarios/aviso.ts`](../Aplicativo/src/utilitarios/aviso.ts)
  reúne uma forma comum de apresentar mensagens/avisos na interface.
- [`Aplicativo/src/utilitarios/progresso.ts`](../Aplicativo/src/utilitarios/progresso.ts)
  contém cálculos puros de progresso que podem ser reutilizados sem acoplar a
  lógica à apresentação de uma tela.
- [`Aplicativo/src/utilitarios/senha.ts`](../Aplicativo/src/utilitarios/senha.ts)
  reúne regras locais de apoio à validação de senha; a API também valida a
  senha, pois a validação do cliente não é uma barreira de segurança.

### Roteiro e configurações

- [`Aplicativo/roteiros/reiniciar-projeto.js`](../Aplicativo/roteiros/reiniciar-projeto.js)
  é um roteiro auxiliar para reorganizar a estrutura inicial do Expo. Não faz parte
  do fluxo normal de cadastro ou execução do app.
- `Aplicativo/package.json` declara comandos e dependências JavaScript.
  `package-lock.json` fixa versões resolvidas; é um arquivo gerado pelo npm e
  não recebe comentários de código.
- `Aplicativo/app.json` guarda configuração do Expo; `tsconfig.json` define
  opções do TypeScript. Arquivos JSON não aceitam comentários, portanto suas
  opções são explicadas neste guia.

## 6. Fluxos principais de ponta a ponta

### Cadastro e acesso

1. A tela de cadastro ou acesso coleta os campos.
2. A tela chama a função correspondente exportada por `servicos/servico-api.ts`.
3. O cliente faz as requisições `POST /signup` ou `POST /login`. Esses caminhos
   são o contrato da API e permanecem em inglês por compatibilidade.
4. `app.py` valida a entrada e chama a lógica de conta e banco.
5. Em acesso válido, o servidor cria uma sessão. O app guarda o token por meio de
   `servicos/sessao.ts`.
6. Chamadas posteriores enviam `Authorization: Bearer <token>`. O servidor
   valida a sessão antes de retornar ou modificar dados protegidos.

### Perfil e progresso

1. A tela pede perfil ou progresso ao cliente de API.
2. O servidor valida o token e consulta PostgreSQL.
3. Para progresso, o servidor valida a faixa permitida e a ordem de conclusão
   das atividades antes de gravar.
4. O app atualiza a tela com os dados retornados. A API é a fonte oficial, não
   o estado em memória do componente.

### Foto, amizade e recuperação de senha

- Fotos são enviadas como `multipart/form-data`; o servidor valida tamanho e
  formato, grava os bytes no PostgreSQL e devolve uma URL.
- Amizades são criadas pelo endpoint social e mantidas no banco; o ranking
  apresentado é produzido pelo servidor.
- Recuperação de senha usa código temporário e resposta neutra para não
  confirmar se um email está cadastrado. Em desenvolvimento sem SMTP, o código
  pode aparecer no log local do servidor; não exponha esses logs.

## 7. Dados e limites importantes

- **Persistidos no PostgreSQL:** contas, senha em formato de hash, sessões,
  apelido, nível, progresso, amizades e fotos.
- **Mantido localmente:** token de sessão e preferência de tema.
- **Distribuído com o app:** perguntas e conteúdo estático.
- **Não incluído:** migração automática dos dados SQLite antigos. A transferência
  desses dados deve ser feita separadamente pelo responsável pelo banco.
- **Senhas:** nunca devem ser gravadas ou consultadas em texto puro.
- **Consultas:** entradas do usuário devem continuar sendo passadas como
  parâmetros SQL.
- **Desenvolvimento:** o servidor Flask integrado é para uso local; produção
  exige servidor WSGI, HTTPS, segredo protegido e CORS restrito.

## 8. Comentários no código

Os comentários foram escritos para explicar decisões e contexto técnico:

- o que um módulo ou função faz no fluxo;
- por que uma validação ou limite existe;
- como dados atravessam aplicativo, API e banco;
- quais dados são confiáveis e quais vêm do usuário;
- o que é mantido localmente e o que pertence ao servidor.

Eles não substituem tipos, nomes claros, testes ou validações. Quando o
comportamento mudar, atualize os comentários e este guia junto com a
implementação.
