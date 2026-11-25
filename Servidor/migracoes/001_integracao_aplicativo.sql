-- Complementa a base existente sem importar ou apagar dados do SQLite.
ALTER TABLE usuario
    ADD COLUMN IF NOT EXISTS apelido TEXT,
    ADD COLUMN IF NOT EXISTS nivel TEXT,
    ADD COLUMN IF NOT EXISTS foto_id UUID;

CREATE UNIQUE INDEX IF NOT EXISTS usuario_email_unico ON usuario (LOWER(email));
CREATE UNIQUE INDEX IF NOT EXISTS usuario_id_usuario_unico ON usuario (id_usuario);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'usuario_nivel_valido'
          AND conrelid = 'usuario'::regclass
    ) THEN
        ALTER TABLE usuario ADD CONSTRAINT usuario_nivel_valido
            CHECK (nivel IS NULL OR nivel IN ('iniciante', 'intermediario', 'avancado'))
            NOT VALID;
    END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS usuario_apelido_unico
    ON usuario (LOWER(apelido))
    WHERE apelido IS NOT NULL;

CREATE TABLE IF NOT EXISTS progresso_atividade (
    email TEXT NOT NULL REFERENCES usuario(email) ON DELETE CASCADE,
    atividade INTEGER NOT NULL CHECK (atividade BETWEEN 1 AND 7),
    percentual INTEGER NOT NULL CHECK (percentual BETWEEN 0 AND 100),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (email, atividade)
);

CREATE TABLE IF NOT EXISTS sessao (
    token_hash TEXT PRIMARY KEY,
    email TEXT NOT NULL REFERENCES usuario(email) ON DELETE CASCADE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expira_em TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS sessao_email_idx ON sessao (email);
CREATE INDEX IF NOT EXISTS sessao_expira_em_idx ON sessao (expira_em);

CREATE TABLE IF NOT EXISTS foto_perfil (
    foto_id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE REFERENCES usuario(email) ON DELETE CASCADE,
    mime TEXT NOT NULL CHECK (mime IN ('image/jpeg', 'image/png', 'image/webp')),
    dados BYTEA NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS relacionamento (
    usuario TEXT NOT NULL,
    amigo TEXT NOT NULL,
    PRIMARY KEY (usuario, amigo),
    CHECK (usuario <> amigo)
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'relacionamento'::regclass
          AND contype = 'p'
    ) THEN
        ALTER TABLE relacionamento
            ADD CONSTRAINT relacionamento_usuario_amigo_pkey
            PRIMARY KEY (usuario, amigo);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'relacionamento'::regclass
          AND contype = 'c'
          AND pg_get_constraintdef(oid) LIKE '%usuario <> amigo%'
    ) THEN
        ALTER TABLE relacionamento
            ADD CONSTRAINT relacionamento_usuarios_diferentes
            CHECK (usuario <> amigo) NOT VALID;
    END IF;
END $$;
