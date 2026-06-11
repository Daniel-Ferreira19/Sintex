# PHP Backend para Login de Administrador

Este diretório contém endpoints PHP para autenticação de administrador com banco de dados.

## Arquivos

- `db.php`: conexão simples com MySQL usando mysqli.
- `login.php`: autentica o administrador e retorna o papel `admin`.
- `register.php`: cadastra um administrador no banco de dados.

## Banco de dados

Crie o banco `sintex` e a tabela `admins`:

```sql
CREATE DATABASE sintex CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sintex;

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  restaurant VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL
);
```

## Configuração

Ajuste as credenciais de conexão em `db.php` se necessário.

## Uso

O frontend chama:

- `POST /php/login.php` com `{ email, password }`
- `POST /php/register.php` com `{ email, password, restaurant }`

## Como iniciar

1. Abra o terminal no diretório do projeto.
2. Execute o servidor PHP com:

   ```bat
   start-php.bat
   ```

3. Em outro terminal, execute o React com:

   ```bat
   npm run dev
   ```

O Vite está configurado para encaminhar as chamadas que começam com `/php` para `http://127.0.0.1:8000`.
