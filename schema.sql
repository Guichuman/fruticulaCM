-- =============================================================
--  Frutícola CM — Script de criação do schema
--  Banco: PostgreSQL
--  Gerado manualmente a partir das entidades NestJS/TypeORM
-- =============================================================

-- -------------------------------------------------------------
-- 1. USUÁRIOS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id          SERIAL          PRIMARY KEY,
    username    VARCHAR(100)    NOT NULL UNIQUE,
    senha       VARCHAR(255)    NOT NULL,
    nome        VARCHAR(150)    NOT NULL,
    status      CHAR(1)         NOT NULL DEFAULT 'A',
    perfil      CHAR(1)         NOT NULL DEFAULT 'F',
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT usuarios_status_chk CHECK (status IN ('A', 'I')),
    CONSTRAINT usuarios_perfil_chk CHECK (perfil IN ('A', 'F'))
);

-- -------------------------------------------------------------
-- 2. MOTORISTAS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS motoristas (
    id              SERIAL          PRIMARY KEY,
    nome            VARCHAR(255)    NOT NULL,
    telefone        VARCHAR(20)     NOT NULL,
    cpf             VARCHAR(14)     NOT NULL,
    status          CHAR(1)         NOT NULL DEFAULT 'A',
    criado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT motoristas_status_chk CHECK (status IN ('A', 'I'))
);

-- -------------------------------------------------------------
-- 3. CAMINHÕES
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS caminhoes (
    id              SERIAL          PRIMARY KEY,
    placa           VARCHAR(10)     NOT NULL UNIQUE,
    modelo          VARCHAR(32)     NOT NULL,
    qtd_blocos      INTEGER         NOT NULL,
    status          CHAR(1)         NOT NULL DEFAULT 'A',
    pallet_baixo    CHAR(1)         NOT NULL DEFAULT 'N',
    criado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    id_motorista    INTEGER,

    CONSTRAINT caminhoes_status_chk       CHECK (status IN ('A', 'I')),
    CONSTRAINT caminhoes_pallet_baixo_chk CHECK (pallet_baixo IN ('S', 'N')),

    CONSTRAINT caminhoes_motorista_fk
        FOREIGN KEY (id_motorista)
        REFERENCES motoristas (id)
        ON DELETE SET NULL
);

-- -------------------------------------------------------------
-- 4. FRUTAS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS frutas (
    id              SERIAL          PRIMARY KEY,
    nome            VARCHAR(255)    NOT NULL UNIQUE,
    criado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 5. EMBALAGENS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS embalagens (
    id              SERIAL          PRIMARY KEY,
    nome            VARCHAR(255)    NOT NULL UNIQUE,
    criado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 6. FRUTAS_EMBALAGENS  (tabela legada — mantida por compatibilidade)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS frutas_embalagens (
    id              SERIAL          PRIMARY KEY,
    peso            FLOAT           NOT NULL,
    sku             INTEGER         NOT NULL,
    tipo            VARCHAR(55)     NOT NULL,
    criado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    id_fruta        INTEGER         NOT NULL,
    id_embalagem    INTEGER         NOT NULL,

    CONSTRAINT frutas_embalagens_fruta_fk
        FOREIGN KEY (id_fruta)
        REFERENCES frutas (id)
        ON DELETE NO ACTION,

    CONSTRAINT frutas_embalagens_embalagem_fk
        FOREIGN KEY (id_embalagem)
        REFERENCES embalagens (id)
        ON DELETE NO ACTION
);

-- -------------------------------------------------------------
-- 7. TIPOS_FRUTA
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tipos_fruta (
    id              SERIAL          PRIMARY KEY,
    nome            VARCHAR(100)    NOT NULL,
    criado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    id_fruta        INTEGER         NOT NULL,

    CONSTRAINT tipos_fruta_fruta_fk
        FOREIGN KEY (id_fruta)
        REFERENCES frutas (id)
        ON DELETE CASCADE
);

-- -------------------------------------------------------------
-- 8. TIPO_FRUTA_EMBALAGENS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tipo_fruta_embalagens (
    id              SERIAL          PRIMARY KEY,
    nome            VARCHAR(32)     NOT NULL,
    sku             INTEGER         NOT NULL,
    criado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    id_tipo_fruta   INTEGER         NOT NULL,

    CONSTRAINT tipo_fruta_embalagens_tipo_fruta_fk
        FOREIGN KEY (id_tipo_fruta)
        REFERENCES tipos_fruta (id)
        ON DELETE CASCADE
);

-- -------------------------------------------------------------
-- 9. CARGAS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cargas (
    id              SERIAL          PRIMARY KEY,
    total_blocos    INTEGER         NOT NULL,
    max_caixas      INTEGER         NOT NULL,
    status          CHAR(1)         NOT NULL DEFAULT 'C',
    criado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    id_caminhao     INTEGER         NOT NULL,
    id_motorista    INTEGER         NOT NULL,

    CONSTRAINT cargas_status_chk CHECK (status IN ('F', 'C', 'V')),

    CONSTRAINT cargas_caminhao_fk
        FOREIGN KEY (id_caminhao)
        REFERENCES caminhoes (id)
        ON DELETE RESTRICT,

    CONSTRAINT cargas_motorista_fk
        FOREIGN KEY (id_motorista)
        REFERENCES motoristas (id)
        ON DELETE RESTRICT
);

-- -------------------------------------------------------------
-- 10. PALLETS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pallets (
    id              SERIAL          PRIMARY KEY,
    lado            CHAR(2)         NOT NULL,
    bloco           INTEGER         NOT NULL,
    criado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    id_carga        INTEGER         NOT NULL,

    CONSTRAINT pallets_lado_chk CHECK (lado IN ('MA', 'MB', 'AA', 'AB')),

    CONSTRAINT pallets_carga_fk
        FOREIGN KEY (id_carga)
        REFERENCES cargas (id)
        ON DELETE CASCADE
);

-- -------------------------------------------------------------
-- 11. PALLET_FRUTAS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pallet_frutas (
    id                          SERIAL      PRIMARY KEY,
    quantidade_caixa            INTEGER     NOT NULL,
    criado_em                   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    id_pallet                   INTEGER     NOT NULL,
    id_tipo_fruta_embalagem     INTEGER     NOT NULL,

    CONSTRAINT pallet_frutas_pallet_fk
        FOREIGN KEY (id_pallet)
        REFERENCES pallets (id)
        ON DELETE CASCADE,

    CONSTRAINT pallet_frutas_tipo_fruta_embalagem_fk
        FOREIGN KEY (id_tipo_fruta_embalagem)
        REFERENCES tipo_fruta_embalagens (id)
        ON DELETE RESTRICT
);

-- =============================================================
-- ÍNDICES NAS COLUNAS DE FK (performance em JOINs)
-- =============================================================
CREATE INDEX IF NOT EXISTS idx_caminhoes_motorista       ON caminhoes (id_motorista);
CREATE INDEX IF NOT EXISTS idx_frutas_embalagens_fruta   ON frutas_embalagens (id_fruta);
CREATE INDEX IF NOT EXISTS idx_frutas_embalagens_embal   ON frutas_embalagens (id_embalagem);
CREATE INDEX IF NOT EXISTS idx_tipos_fruta_fruta         ON tipos_fruta (id_fruta);
CREATE INDEX IF NOT EXISTS idx_tipo_fruta_emb_tipo       ON tipo_fruta_embalagens (id_tipo_fruta);
CREATE INDEX IF NOT EXISTS idx_cargas_caminhao           ON cargas (id_caminhao);
CREATE INDEX IF NOT EXISTS idx_cargas_motorista          ON cargas (id_motorista);
CREATE INDEX IF NOT EXISTS idx_pallets_carga             ON pallets (id_carga);
CREATE INDEX IF NOT EXISTS idx_pallet_frutas_pallet      ON pallet_frutas (id_pallet);
CREATE INDEX IF NOT EXISTS idx_pallet_frutas_embalagem   ON pallet_frutas (id_tipo_fruta_embalagem);
