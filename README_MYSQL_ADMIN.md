# README MySQL - Login do Administrador

Este arquivo explica como criar o banco de dados MySQL para o projeto Sintex e como configurar a conexão PHP usando XAMPP.

## 1. Abrir o XAMPP e iniciar o MySQL
1. Abra o painel do XAMPP.
2. Inicie o serviço `Apache` e `MySQL`.
3. Verifique se o MySQL está rodando.

## 2. Criar o banco de dados no phpMyAdmin
1. Abra o navegador em `http://localhost/phpmyadmin`.
2. Clique em `Novo` no menu lateral.
3. No campo `Nome do banco de dados`, digite `sintex`.
4. Selecione `utf8mb4_unicode_ci` em `Collation`.
5. Clique em `Criar`.

## 3. Criar a tabela de administradores
No phpMyAdmin, selecione o banco de dados `sintex` e abra a aba `SQL`. Cole o código abaixo e execute:

```sql
CREATE TABLE IF NOT EXISTS administradores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
```

## 4. Criar o banco de dados usando o terminal MySQL (opcional)
Se preferir usar o terminal MySQL, siga estes passos:

1. Abra o terminal do Windows.
2. Execute:

```bash
mysql -u root -p
```

3. Quando pedir senha, apenas pressione `Enter` se o XAMPP estiver usando senha vazia.
4. Dentro do MySQL, execute:

```sql
CREATE DATABASE IF NOT EXISTS sintex CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sintex;
CREATE TABLE IF NOT EXISTS administradores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
```

5. Saia com:

```sql
EXIT;
```

## 5. Configurar a conexão PHP
No arquivo `php/db.php`, ajuste as credenciais para o seu ambiente local:

```php
$host = "localhost";
$user = "root";
$password = "";
$database = "sintex";

$conn = new mysqli($host, $user, $password, $database);
```

- `localhost`: servidor local do MySQL.
- `root`: usuário padrão em XAMPP.
- `password`: senha do MySQL (geralmente em branco no XAMPP).

## 6. Como funciona o cadastro de administrador
O arquivo `php/register.php` recebe um JSON com:

- `email`
- `password`
- `restaurant`

Ele faz hash da senha usando `password_hash()` antes de salvar no banco.

### Exemplo de JSON de cadastro
```json
{
  "email": "admin@exemplo.com",
  "password": "senhaSegura123",
  "restaurant": "Nome do Restaurante"
}
```

## 7. Login do administrador
O arquivo `php/login.php` recebe um JSON com:

- `email`
- `password`

Ele busca o administrador por e-mail e compara a senha com `password_verify()`.

### Exemplo de JSON de login
```json
{
  "email": "admin@exemplo.com",
  "password": "senhaSegura123"
}
```

## 8. Inserção manual de administrador (opcional)
Se quiser criar um administrador diretamente no banco, gere o hash da senha no PHP:

```bash
php -r "echo password_hash('senhaSegura123', PASSWORD_DEFAULT);"
```

Em seguida, no MySQL:

```sql
INSERT INTO administradores (nome, email, senha) VALUES (
  'Administrador',
  'admin@exemplo.com',
  '$2y$10$...'
);
```

## 9. Observações de segurança
- Nunca armazene senhas em texto simples.
- Use `password_hash()` e `password_verify()` para proteger as senhas.
- Em produção, use credenciais MySQL seguras em vez de `root` com senha vazia.
