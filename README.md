# 🍽️ Sintex - Plataforma Avaliadora & Gestão de Restaurantes

<p align="center">
  <b>Conectando apreciadores da boa gastronomia aos melhores estabelecimentos.</b>
</p>

---

### 🌐 Acesse a Aplicação Online
 
### **[Clique aqui para acessar o Sintex](https://sintex.infinityfree.me/?i=1)** 

[![Deploy Status](https://img.shields.io/badge/Deploy-Online-brightgreen?style=for-the-badge&logo=vercel)](https://SEU-LINK-AQUI.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/Repositório-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/Daniel-Ferreira19/Sintex)

---

## 📖 Sobre o Projeto

O **Sintex** é uma plataforma focada na avaliação e gerenciamento de restaurantes, desenvolvida como Projeto Integrador para o curso Técnico em Programador Web do **SENAC DF**. 

A plataforma conta com uma experiência centralizada onde clientes podem pesquisar restaurantes por culinária ou nome, explorar avaliações e conferir cardápios, enquanto proprietários e administradores gerenciam seus estabelecimentos com autenticação dedicada.

### ✨ Principais Recursos
* **Busca Global em Tempo Real:** Campo de busca integrado ao cabeçalho com redirecionamento de parâmetros (`/client?q=`).
* **Autenticação e Permissões:** Controle de acesso com telas separadas para Administrador e Cliente.
* **Identidade Visual Temática:** Interface dark mode focada em contrastes vibrantes (laranja, vermelho e branco).
* **Navegação SPA:** Roteamento dinâmico sem recarregamento de página via React Router DOM.

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Finalidade |
| :--- | :--- |
| **React (v19)** | Interface de usuário (SPA componentizada) |
| **Vite** | Bundler e ambiente de desenvolvimento ultrarrápido |
| **React Router DOM** | Roteamento dinâmico e controle de navegação |
| **CSS3 (Flexbox & Grid)** | Estilização responsiva e tema customizado |
| **PHP 8** | Endpoints de API REST e regras de negócio |
| **MySQL** | Banco de dados relacional para usuários, pratos e notas |
| **XAMPP** | Ambiente de servidor local (Apache/MySQL) |

---

## 📂 Estrutura de Pastas

```text
Sintex/
├── backend/
│   ├── api/             # Endpoints REST (auth, avaliações, cardápios)
│   ├── config/          # Conexão PDO (db.php) e schema SQL (database.sql)
│   └── models/          # Modelos de dados relacionais
├── sintex/
│   ├── public/          # Favicon e ícones estáticos SVG
│   ├── src/
│   │   ├── assets/      # Recursos visuais globais
│   │   ├── Componentes/ # Componentes reutilizáveis (Menu, Banner, MenuLink)
│   │   │   ├── Menu/    # Cabeçalho global com logo e barra de pesquisa
│   │   │   └── Banner/  # Vídeo promocional de apresentação
│   │   ├── Pages/       # Visões principais da aplicação
│   │   │   ├── Home/    # Página inicial com destaques
│   │   │   ├── About/   # Informações sobre a plataforma
│   │   │   ├── Client/  # Catálogo e busca de restaurantes
│   │   │   ├── Admin/   # Painel administrativo
│   │   │   └── Login/   # Formulário de login e autenticação
│   │   ├── data/        # Mock e fontes de dados iniciais
│   │   ├── App.jsx      # Definição e proteção das rotas
│   │   └── main.jsx     # Ponto de inicialização do React
│   ├── index.html       # Entrypoint HTML do Vite
│   ├── package.json     # Scripts e dependências instaladas
│   └── vite.config.js   # Proxy e configurações de build
└── README.md

```

---

## ⚙️ Como Executar Localmente

### 1. Inicie o Ambiente XAMPP

1. Abra o **XAMPP Control Panel**.
2. Dê `Start` nos serviços **Apache** e **MySQL**.

### 2. Configure o Banco de Dados

1. No navegador, entre em `http://localhost/phpmyadmin`.
2. Crie um banco com o nome **`sintex_db`** (Collation: `utf8mb4_unicode_ci`).
3. Vá na aba **SQL** e execute os scripts contidos em `backend/config/database.sql`.

### 3. Suba o Front-end

No terminal, entre na pasta do front-end e inicialize o servidor Vite:

```bash
cd sintex
npm install
npm run dev

```

Acesse o endereço exibido no terminal (geralmente `http://localhost:5173`).

---

## 🔑 Contas de Teste

| Perfil | E-mail | Senha |
| --- | --- | --- |
| **Administrador** | `joao@example.com` (ou `admin@sintex.com`) | `123456` |
| **Cliente** | `cliente@exemplo.com` | `123456` |

---

## 🛡️ Padrões de Segurança

* **Criptografia de Credenciais:** Hashes seguros via `password_hash()` e verificação por `password_verify()`.
* **Sanitização de Consultas:** Queries preparadas (*Prepared Statements*) prevenindo ataques de SQL Injection.
* **Segurança de Rotas:** Bloqueio de áreas protegidas no front-end contra acessos diretos não autenticados.

---

## 👥 Equipe Desenvolvedora

* [Daniel Ferreira](https://github.com/Daniel-Ferreira19)
* [Victor Barcelos](https://github.com/barcelos00)
* [Layanne Sousa](https://github.com/layannesousa2025)
