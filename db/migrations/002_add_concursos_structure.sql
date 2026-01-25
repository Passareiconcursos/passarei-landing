-- Migration: Add concursos structure for expanded exam types
-- Date: 2026-01-24

-- =============================================
-- 1. Add new values to exam_type enum
-- =============================================

-- Add new exam types (if not exists)
DO $$ BEGIN
    ALTER TYPE exam_type ADD VALUE IF NOT EXISTS 'PF_FERROVIARIA';
    ALTER TYPE exam_type ADD VALUE IF NOT EXISTS 'PJ_CNJ';
    ALTER TYPE exam_type ADD VALUE IF NOT EXISTS 'ABIN';
    ALTER TYPE exam_type ADD VALUE IF NOT EXISTS 'EXERCITO';
    ALTER TYPE exam_type ADD VALUE IF NOT EXISTS 'MARINHA';
    ALTER TYPE exam_type ADD VALUE IF NOT EXISTS 'FAB';
    ALTER TYPE exam_type ADD VALUE IF NOT EXISTS 'MIN_DEFESA';
    ALTER TYPE exam_type ADD VALUE IF NOT EXISTS 'ANAC';
    ALTER TYPE exam_type ADD VALUE IF NOT EXISTS 'CPNU';
    ALTER TYPE exam_type ADD VALUE IF NOT EXISTS 'PC_CIENTIFICA';
    ALTER TYPE exam_type ADD VALUE IF NOT EXISTS 'GP';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- 2. Add new values to position enum
-- =============================================

DO $$ BEGIN
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'PAPILOSCOPISTA';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'CFO';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'AGENTE_PF';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'ESCRIVAO_PF';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'DELEGADO_PF';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'PAPILOSCOPISTA_PF';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'POLICIAL_RODOVIARIO';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'AGENTE_PENITENCIARIO';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'TECNICO_PENITENCIARIO';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'POLICIAL_PENAL';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'POLICIAL_LEGISLATIVO';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'POLICIAL_JUDICIAL';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'ESPCEX';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'IME';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'ESA';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'FUZILEIRO_NAVAL';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'ESCOLA_NAVAL';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'COLEGIO_NAVAL';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'ITA';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'EPCAR';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'EAGS';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'GUARDA_MUNICIPAL';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'GUARDA_PORTUARIO';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'OFICIAL_INTELIGENCIA';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'TECNICO';
    ALTER TYPE position ADD VALUE IF NOT EXISTS 'ANALISTA';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- 3. Create concurso_sphere enum
-- =============================================

DO $$ BEGIN
    CREATE TYPE concurso_sphere AS ENUM ('FEDERAL', 'ESTADUAL', 'MUNICIPAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- 4. Create concursos table
-- =============================================

CREATE TABLE IF NOT EXISTS concursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    sigla VARCHAR(20) NOT NULL UNIQUE,
    descricao TEXT,
    esfera concurso_sphere NOT NULL,
    exam_type exam_type NOT NULL,
    edital_url TEXT,
    site_oficial TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =============================================
-- 5. Create cargos table
-- =============================================

CREATE TABLE IF NOT EXISTS cargos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concurso_id UUID NOT NULL REFERENCES concursos(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    descricao TEXT,
    escolaridade VARCHAR(50),
    requisitos TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =============================================
-- 6. Create cargo_materias table
-- =============================================

CREATE TABLE IF NOT EXISTS cargo_materias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cargo_id UUID NOT NULL REFERENCES cargos(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    descricao TEXT,
    peso REAL DEFAULT 1,
    quantidade_questoes INTEGER DEFAULT 10,
    topicos JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =============================================
-- 7. Create conteudo_cargos junction table
-- =============================================

CREATE TABLE IF NOT EXISTS conteudo_cargos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id VARCHAR(255) NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    cargo_id UUID NOT NULL REFERENCES cargos(id) ON DELETE CASCADE,
    cargo_materia_id UUID REFERENCES cargo_materias(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =============================================
-- 8. Create indexes
-- =============================================

CREATE INDEX IF NOT EXISTS idx_concursos_esfera ON concursos(esfera);
CREATE INDEX IF NOT EXISTS idx_concursos_exam_type ON concursos(exam_type);
CREATE INDEX IF NOT EXISTS idx_concursos_is_active ON concursos(is_active);

CREATE INDEX IF NOT EXISTS idx_cargos_concurso_id ON cargos(concurso_id);
CREATE INDEX IF NOT EXISTS idx_cargos_is_active ON cargos(is_active);

CREATE INDEX IF NOT EXISTS idx_cargo_materias_cargo_id ON cargo_materias(cargo_id);
CREATE INDEX IF NOT EXISTS idx_cargo_materias_is_active ON cargo_materias(is_active);

CREATE INDEX IF NOT EXISTS idx_conteudo_cargos_content_id ON conteudo_cargos(content_id);
CREATE INDEX IF NOT EXISTS idx_conteudo_cargos_cargo_id ON conteudo_cargos(cargo_id);

-- =============================================
-- 9. Insert initial concursos data
-- =============================================

-- FEDERAIS - Segurança
INSERT INTO concursos (nome, sigla, esfera, exam_type, ordem) VALUES
('Polícia Federal', 'PF', 'FEDERAL', 'PF', 1),
('Polícia Rodoviária Federal', 'PRF', 'FEDERAL', 'PRF', 2),
('Polícia Penal Federal', 'PPF', 'FEDERAL', 'PP_FEDERAL', 3),
('Polícia Legislativa Federal', 'PLF', 'FEDERAL', 'PL_FEDERAL', 4),
('Polícia Ferroviária Federal', 'PFF', 'FEDERAL', 'PF_FERROVIARIA', 5),
('Polícia Judicial CNJ', 'PJ_CNJ', 'FEDERAL', 'PJ_CNJ', 6),
('Agência Brasileira de Inteligência', 'ABIN', 'FEDERAL', 'ABIN', 7)
ON CONFLICT (sigla) DO NOTHING;

-- FEDERAIS - Militares
INSERT INTO concursos (nome, sigla, esfera, exam_type, ordem) VALUES
('Exército Brasileiro', 'EB', 'FEDERAL', 'EXERCITO', 10),
('Marinha do Brasil', 'MB', 'FEDERAL', 'MARINHA', 11),
('Força Aérea Brasileira', 'FAB', 'FEDERAL', 'FAB', 12),
('Ministério da Defesa', 'MD', 'FEDERAL', 'MIN_DEFESA', 13)
ON CONFLICT (sigla) DO NOTHING;

-- FEDERAIS - Outros
INSERT INTO concursos (nome, sigla, esfera, exam_type, ordem) VALUES
('Agência Nacional de Aviação Civil', 'ANAC', 'FEDERAL', 'ANAC', 20),
('Concurso Público Nacional Unificado', 'CPNU', 'FEDERAL', 'CPNU', 21)
ON CONFLICT (sigla) DO NOTHING;

-- ESTADUAIS
INSERT INTO concursos (nome, sigla, esfera, exam_type, ordem) VALUES
('Polícia Militar', 'PM', 'ESTADUAL', 'PM', 30),
('Polícia Civil', 'PC', 'ESTADUAL', 'PC', 31),
('Corpo de Bombeiros Militar', 'CBM', 'ESTADUAL', 'CBM', 32),
('Polícia Penal Estadual', 'PPE', 'ESTADUAL', 'PP_ESTADUAL', 33),
('Polícia Legislativa Estadual', 'PLE', 'ESTADUAL', 'PL_ESTADUAL', 34),
('Polícia Científica', 'PCIENT', 'ESTADUAL', 'PC_CIENTIFICA', 35)
ON CONFLICT (sigla) DO NOTHING;

-- MUNICIPAIS
INSERT INTO concursos (nome, sigla, esfera, exam_type, ordem) VALUES
('Guarda Municipal', 'GM', 'MUNICIPAL', 'GM', 40),
('Guarda Portuária', 'GP', 'MUNICIPAL', 'GP', 41)
ON CONFLICT (sigla) DO NOTHING;

COMMENT ON TABLE concursos IS 'Catálogo de concursos públicos disponíveis';
COMMENT ON TABLE cargos IS 'Cargos disponíveis em cada concurso';
COMMENT ON TABLE cargo_materias IS 'Matérias cobradas em cada cargo';
COMMENT ON TABLE conteudo_cargos IS 'Associação entre conteúdos e cargos específicos';
