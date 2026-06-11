# README MySQL - Login do Administrador

Este arquivo descreve como configurar o banco de dados MySQL para o login do administrador do projeto Sintex.

## 1. Criar o banco de dados
Use o terminal MySQL, phpMyAdmin ou MySQL Workbench para criar o banco de dados:

```sql
CREATE DATABASE IF NOT EXISTS sintex CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sintex;
```

## 2. Criar a tabela de administradores
Crie a tabela `administradores` com os campos necessários para cadastro e login:

```sql
CREATE TABLE IF NOT EXISTS administradores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
```

## 3. Configurar a conexão PHP
No arquivo `php/db.php`, ajuste as credenciais para o seu ambiente local:

```php
$host = "localhost";
$user = "root";
$password = "";
$database = "sintex";

$conn = new mysqli($host, $user, $password, $database);
```

- `localhost`: servidor local do MySQL
- `root`: usuário padrão em XAMPP/WAMP
- `password`: senha do MySQL (pode ficar em branco em ambiente local)

## 4. Cadastro de administrador pelo backend
O arquivo `php/register.php` espera receber um JSON com os campos:

- `email`
- `password`
- `restaurant`

Ele já faz hash da senha usando `password_hash()` antes de salvar no banco.

### Exemplo de JSON de cadastro
```json
{
  "email": "admin@exemplo.com",
  "password": "senhaSegura123",
  "restaurant": "Nome do Restaurante"
}
```

## 5. Login do administrador
O arquivo `php/login.php` recebe um JSON com:

- `email`
- `password`

Ele busca o administrador com o e-mail informado e compara a senha usando `password_verify()`.

### Exemplo de JSON de login
```json
{
  "email": "admin@exemplo.com",
  "password": "senhaSegura123"
}
```

## 6. Inserção manual de administrador (opcional)
Se preferir criar um administrador manualmente no banco, gere o hash da senha no PHP:

```bash
php -r "echo password_hash('senhaSegura123', PASSWORD_DEFAULT);"
```

Em seguida, insira o usuário com o hash gerado:

```sql
INSERT INTO administradores (nome, email, senha) VALUES (
  'Administrador',
  'admin@exemplo.com',
  '$2y$10$...'
);
```

## 7. Observações de segurança
- Nunca armazene senhas em texto simples.
- Use `password_hash()` e `password_verify()` para proteger as senhas.
- Em produção, ajuste o usuário e senha do MySQL para valores seguros.
