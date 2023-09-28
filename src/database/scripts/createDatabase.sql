CREATE TABLE "tipos_usuarios" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "tipo" varchar(50),
  "criado_em" timestamp DEFAULT (now()),
  "atualizado_em" timestamp DEFAULT (now())
);

CREATE TABLE "usuarios" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "foto" varchar(255),
  "foto_hash_delete" varchar(50),
  "email" varchar(50) UNIQUE NOT NULL,
  "nome" varchar(50) NOT NULL,
  "apelido" varchar(50) UNIQUE NOT NULL,
  "senha" varchar(255) NOT NULL,
  "data_nascimento" date NOT NULL,
  "bio" varchar(50),
  "avaliacao" float DEFAULT 0,
  "ativo" boolean DEFAULT true,
  "email_confirmado" boolean DEFAULT false,
  "criado_em" timestamp DEFAULT (now()),
  "atualizado_em" timestamp DEFAULT (now()),
  "tipo_usuario_id" integer
);

CREATE TABLE "tipos_documentos" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "tipo" varchar(50),
  "criado_em" timestamp DEFAULT (now()),
  "atualizado_em" timestamp DEFAULT (now())
);

CREATE TABLE "documentos" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "valor" varchar(50),
  "usuario_id" integer,
  "tipo_documento_id" integer,
  "criado_em" timestamp DEFAULT (now()),
  "atualizado_em" timestamp DEFAULT (now())
);

CREATE TABLE "enderecos" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "pais" varchar(50),
  "estado" varchar(50),
  "cidade" varchar(50),
  "bairro" varchar(50),
  "rua" varchar(255),
  "numero" integer,
  "cep" varchar(10),
  "nome" varchar(50),
  "ponto_referencia" varchar(255),
  "usuario_id" integer,
  "criado_em" timestamp DEFAULT (now()),
  "atualizado_em" timestamp DEFAULT (now())
);

CREATE TABLE "consoles" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "nome" varchar(100) NOT NULL,
  "abreviacao" varchar(100),
  "fabricante" varchar(255),
  "geracao" integer,
  "lancamento_jp" date,
  "lancamento_na" date,
  "lancamento_pal" date,
  "criado_em" timestamp DEFAULT (now()),
  "atualizado_em" timestamp DEFAULT (now())
);

CREATE TABLE "jogos" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "nome" varchar(255) NOT NULL,
  "desenvolvedora" varchar(255),
  "publicadora" varchar(255),
  "lancamento_jp" date,
  "lancamento_na" date,
  "lancamento_pal" date,
  "console_id" integer,
  "criado_em" timestamp DEFAULT (now()),
  "atualizado_em" timestamp DEFAULT (now())
);

CREATE TABLE "estados_conservacao" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "estado" varchar(50),
  "criado_em" timestamp DEFAULT (now()),
  "atualizado_em" timestamp DEFAULT (now())
);

CREATE TABLE "anuncios" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "caixa" boolean,
  "manual" boolean,
  "preco" float,
  "publico" boolean,
  "descricao" varchar(1000),
  "estado_conservacao_id" integer,
  "jogo_id" integer,
  "console_id" integer,
  "usuario_id" integer,
  "criado_em" timestamp DEFAULT (now()),
  "atualizado_em" timestamp DEFAULT (now())
);

CREATE TABLE "perguntas" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "pergunta" varchar(50),
  "resposta" varchar(50),
  "anuncio_id" integer,
  "usuario_perguntou_id" integer,
  "criado_em" timestamp DEFAULT (now()),
  "atualizado_em" timestamp DEFAULT (now())
);

CREATE TABLE "fotos_anuncio" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "foto" varchar(255),
  "foto_hash_delete" varchar(50),
  "criado_em" timestamp DEFAULT (now()),
  "atualizado_em" timestamp DEFAULT (now()),
  "anuncio_id" integer
);

CREATE TABLE "avaliacoes" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "nota" integer,
  "comentario" varchar(50),
  "criado_em" timestamp DEFAULT (now()),
  "atualizado_em" timestamp DEFAULT (now()),
  "compra_avaliada_id" integer
);

CREATE TABLE "status_compra" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "status" varchar(50),
  "criado_em" timestamp DEFAULT (now()),
  "atualizado_em" timestamp DEFAULT (now())
);

CREATE TABLE "compras" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "comprovante_pagamento" varchar(255),
  "comprovante_pagamento_hash_delete" varchar(255),
  "codigo_rastreio" varchar(50),
  "status_compra_id" integer,
  "criado_em" timestamp DEFAULT (now()),
  "atualizado_em" timestamp DEFAULT (now()),
  "usuario_comprador_id" integer,
  "endereco_compra_id" integer,
  "anuncio_id" integer
);

CREATE TABLE "endereco_compra" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "pais" varchar(50),
  "estado" varchar(50),
  "cidade" varchar(50),
  "bairro" varchar(50),
  "rua" varchar(255),
  "numero" integer,
  "cep" integer,
  "nome" varchar(50),
  "ponto_referencia" varchar(50),
  "criado_em" timestamp DEFAULT (now()),
  "atualizado_em" timestamp DEFAULT (now())
);

ALTER TABLE "usuarios" ADD FOREIGN KEY ("tipo_usuario_id") REFERENCES "tipos_usuarios" ("id");

ALTER TABLE "documentos" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id");

ALTER TABLE "documentos" ADD FOREIGN KEY ("tipo_documento_id") REFERENCES "tipos_documentos" ("id");

ALTER TABLE "enderecos" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id");

ALTER TABLE "jogos" ADD FOREIGN KEY ("console_id") REFERENCES "consoles" ("id");

ALTER TABLE "anuncios" ADD FOREIGN KEY ("estado_conservacao_id") REFERENCES "estados_conservacao" ("id");

ALTER TABLE "anuncios" ADD FOREIGN KEY ("jogo_id") REFERENCES "jogos" ("id");

ALTER TABLE "anuncios" ADD FOREIGN KEY ("console_id") REFERENCES "consoles" ("id");

ALTER TABLE "anuncios" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id");

ALTER TABLE "perguntas" ADD FOREIGN KEY ("anuncio_id") REFERENCES "anuncios" ("id");

ALTER TABLE "perguntas" ADD FOREIGN KEY ("usuario_perguntou_id") REFERENCES "usuarios" ("id");

ALTER TABLE "fotos_anuncio" ADD FOREIGN KEY ("anuncio_id") REFERENCES "anuncios" ("id");

ALTER TABLE "avaliacoes" ADD FOREIGN KEY ("compra_avaliada_id") REFERENCES "compras" ("id");

ALTER TABLE "compras" ADD FOREIGN KEY ("status_compra_id") REFERENCES "status_compra" ("id");

ALTER TABLE "compras" ADD FOREIGN KEY ("usuario_comprador_id") REFERENCES "usuarios" ("id");

ALTER TABLE "compras" ADD FOREIGN KEY ("endereco_compra_id") REFERENCES "endereco_compra" ("id");

ALTER TABLE "compras" ADD FOREIGN KEY ("anuncio_id") REFERENCES "anuncios" ("id");
