
-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS sintex_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sintex_db;

-- Tabela de Administradores (para login, conforme register.php e login.php)
CREATE TABLE IF NOT EXISTS administradores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL UNIQUE, -- Campo 'nome' para o nome do restaurante, conforme register.php
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL, -- Armazenar o hash da senha, conforme register.php
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabela de Restaurantes
CREATE TABLE IF NOT EXISTS restaurantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE,
  endereco VARCHAR(255),
  telefone VARCHAR(20),
  email VARCHAR(255) UNIQUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabela de relacionamento entre Administradores e Restaurantes
-- Um administrador pode gerenciar múltiplos restaurantes, e um restaurante pode ter múltiplos administradores.
CREATE TABLE IF NOT EXISTS administrador_restaurante (
  administrador_id INT NOT NULL,
  restaurante_id INT NOT NULL,
  permissao VARCHAR(50) DEFAULT 'editor', -- Ex: 'proprietario', 'gerente', 'editor', 'visualizador'
  PRIMARY KEY (administrador_id, restaurante_id),
  FOREIGN KEY (administrador_id) REFERENCES administradores(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabela de Cardápios
CREATE TABLE IF NOT EXISTS cardapios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurante_id INT NOT NULL,
  nome_item VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  categoria VARCHAR(100), -- Ex: 'Entrada', 'Prato Principal', 'Bebida', 'Sobremesa'
  disponivel BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Exemplo de inserção de dados (opcional)
-- Para testar, você pode inserir um administrador e um restaurante.
-- Lembre-se de gerar o hash da senha para o administrador usando PHP:
-- php -r "echo password_hash('sua_senha_aqui', PASSWORD_DEFAULT);"

-- INSERT INTO administradores (nome, email, senha) VALUES ('Admin Principal', 'admin@sintex.com', '$2y$10$HASH_DA_SUA_SENHA_AQUI');
-- INSERT INTO restaurantes (nome, endereco, telefone, email) VALUES ('Restaurante Central', 'Rua Principal, 123', '11987654321', 'contato@restaurante.com');
-- INSERT INTO administrador_restaurante (administrador_id, restaurante_id, permissao) VALUES (1, 1, 'proprietario');
-- INSERT INTO cardapios (rest)


CREATE TABLE feedbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurante_id INT(11) NOT NULL,
    nome_cliente VARCHAR(150) DEFAULT 'Cliente Anônimo',
    comentario TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id) ON DELETE CASCADE
);


-- TABELA DE RESTAURANTES 
ALTER TABLE restaurantes ADD COLUMN foto_url VARCHAR(500) DEFAULT NULL;


ALTER TABLE restaurantes 
ADD COLUMN descricao TEXT DEFAULT NULL,
ADD COLUMN categoria VARCHAR(100) DEFAULT NULL;








-- ==========================================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS SINTEX
-- ==========================================================

-- 1. Cria a tabela de Administradores (Donos dos restaurantes)
CREATE TABLE IF NOT EXISTS administradores (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Cria a tabela de Restaurantes
CREATE TABLE IF NOT EXISTS restaurantes (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    endereco VARCHAR(255),
    telefone VARCHAR(20),
    email VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foto_url VARCHAR(500)
);

-- 3. Cria a tabela Intermediária (Liga o Administrador ao Restaurante)
CREATE TABLE IF NOT EXISTS administrador_restaurante (
    administrador_id INT(11) NOT NULL,
    restaurante_id INT(11) NOT NULL,
    permissao VARCHAR(50) DEFAULT 'dono',
    PRIMARY KEY (administrador_id, restaurante_id),
    FOREIGN KEY (administrador_id) REFERENCES administradores(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id) ON DELETE CASCADE
);

-- 4. Cria a tabela de Cardápios (Pratos dos restaurantes)
CREATE TABLE IF NOT EXISTS cardapios (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    restaurante_id INT(11) NOT NULL,
    nome_item VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(100),
    disponivel TINYINT(1) DEFAULT 1,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id) ON DELETE CASCADE
);

-- 5. Cria a tabela de Feedbacks (Avaliações dos clientes)
CREATE TABLE IF NOT EXISTS feedbacks (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    restaurante_id INT(11) NOT NULL,
    nome_cliente VARCHAR(150) DEFAULT 'Cliente Anônimo',
    comentario TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id) ON DELETE CASCADE
);