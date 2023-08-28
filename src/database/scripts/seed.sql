-- Inserir dados na tabela "tipos_usuarios"
INSERT INTO tipos_usuarios (tipo)
VALUES ('adm'), ('comum');

INSERT INTO consoles (nome, abreviacao, fabricante, geracao, lancamento_jp, lancamento_na, lancamento_pal)
VALUES  ('Mega Drive', 'Genesis', 'Sega', 4, '1998-10-29', '1989-08-14', '1990-09-01'),
        ('Super Nintendo Entertainment System', 'SNES', 'Nintendo', 4, '1990-11-21', '1991-08-23', '1993-08-30');

INSERT INTO estados_conservacao (estado)
VALUES ('Lacrado'), ('Novo'), ('Quase Novo'), ('Ligeiramente Usado'), ('Usado'), ('Muito Usado'), ('Danificado');

INSERT INTO status_compra (status)
VALUES('Aguardando Pagamento'), ('Paga'), ('Rejeitada'), ('Cancelada'), ('Enviada'), ('Realizada');