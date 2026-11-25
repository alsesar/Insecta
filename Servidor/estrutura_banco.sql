-- Estrutura inicial das tabelas usadas pelo aplicativo e pela API.
CREATE TABLE usuario (
    email TEXT PRIMARY KEY,
    id_usuario TEXT NOT NULL UNIQUE,
    nome TEXT NOT NULL,
    senha TEXT NOT NULL,
    token TEXT,
    datacriacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    apelido TEXT,
    nivel TEXT CHECK (nivel IS NULL OR nivel IN ('iniciante', 'intermediario', 'avancado')),
    foto_id UUID
);

CREATE UNIQUE INDEX usuario_apelido_unico
    ON usuario (LOWER(apelido))
    WHERE apelido IS NOT NULL;

CREATE TABLE adm (
    email TEXT PRIMARY KEY REFERENCES usuario(email) ON DELETE CASCADE,
    nivel_acesso INTEGER NOT NULL DEFAULT 1 CHECK (nivel_acesso BETWEEN 1 AND 10),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE permicoes (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL REFERENCES usuario(email) ON DELETE CASCADE,
    permissao TEXT NOT NULL,
    UNIQUE (email, permissao)
);

CREATE TABLE conteudo (
    titulo TEXT PRIMARY KEY,
    conteudo TEXT NOT NULL,
    nivel TEXT NOT NULL UNIQUE,
    gabarito TEXT
);

CREATE TABLE assinatura (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL REFERENCES usuario(email) ON DELETE CASCADE,
    plano TEXT NOT NULL,
    inicio TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fim TIMESTAMPTZ,
    ativa BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE relacionamento (
    usuario TEXT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    amigo TEXT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    PRIMARY KEY (usuario, amigo),
    CHECK (usuario <> amigo)
);

CREATE TABLE fase (
    id TEXT PRIMARY KEY,
    titulo TEXT REFERENCES conteudo(titulo)
        ON UPDATE CASCADE ON DELETE SET NULL,
    nivel TEXT REFERENCES conteudo(nivel)
        ON UPDATE CASCADE ON DELETE SET NULL,
    email TEXT REFERENCES usuario(email)
        ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX fase_email_idx ON fase (email);
CREATE INDEX fase_titulo_idx ON fase (titulo);
CREATE INDEX relacionamento_amigo_idx ON relacionamento (amigo);
CREATE INDEX assinatura_ativa_idx ON assinatura (ativa);
CREATE INDEX assinatura_email_idx ON assinatura (email);
CREATE INDEX permicoes_email_idx ON permicoes (email);

CREATE TABLE sessao (
    token_hash TEXT PRIMARY KEY,
    email TEXT NOT NULL REFERENCES usuario(email) ON DELETE CASCADE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expira_em TIMESTAMPTZ NOT NULL
);

CREATE INDEX sessao_email_idx ON sessao (email);
CREATE INDEX sessao_expira_em_idx ON sessao (expira_em);

CREATE TABLE foto_perfil (
    foto_id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE REFERENCES usuario(email) ON DELETE CASCADE,
    mime TEXT NOT NULL CHECK (mime IN ('image/jpeg', 'image/png', 'image/webp')),
    dados BYTEA NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE progresso_atividade (
    email TEXT NOT NULL REFERENCES usuario(email) ON DELETE CASCADE,
    atividade INTEGER NOT NULL CHECK (atividade BETWEEN 1 AND 7),
    percentual INTEGER NOT NULL CHECK (percentual BETWEEN 0 AND 100),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (email, atividade)
);
