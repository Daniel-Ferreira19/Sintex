# 📋 GUIA COMPLETO DE INSTALAÇÃO - SINTEX

## ✅ PRÉ-REQUISITOS

Certifique-se de que possui instalado:

1. **XAMPP** (Apache + MySQL + PHP)
   - Download: https://www.apachefriends.org/
   - Versão recomendada: 8.0+

2. **Node.js** (para React)
   - Download: https://nodejs.org/
   - Versão recomendada: 18+

3. **Git** (opcional, mas recomendado)
   - Download: https://git-scm.com/

---

## 🚀 PASSO 1: CONFIGURAR BANCO DE DADOS

### 1.1 Iniciar XAMPP

```bash
# Windows: Execute xampp-control.exe
# Clique em "Start" para Apache e MySQL
```

### 1.2 Acessar phpMyAdmin

```
URL: http://localhost/phpmyadmin
Usuário: root
Senha: (deixe em branco)
```

### 1.3 Criar Banco de Dados

1. Clique em "Nova" (criar novo banco)
2. Nome: `sintex_db`
3. Codificação: `utf8mb4_unicode_ci`
4. Clique em "Criar"

### 1.4 Importar Script SQL

1. Selecione o banco `sintex_db`
2. Vá para a aba **SQL**
3. Copie o conteúdo de `backend/config/database.sql`
4. Cole no editor SQL
5. Clique em **Executar**

**✓ Banco de dados criado com sucesso!**

---

## 📁 PASSO 2: ESTRUTURA DE PASTAS

A estrutura do projeto é:

```
sintex/
├── backend/                    # APIs PHP
│   ├── config/
│   │   ├── db.php             # Conexão com MySQL
│   │   └── database.sql       # Script do banco
│   ├── models/
│   │   ├── User.php
│   │   ├── Restaurant.php
│   │   ├── Rating.php
│   │   └── Menu.php
│   ├── api/
│   │   ├── response.php
│   │   ├── auth.php
│   │   ├── restaurants.php
│   │   ├── ratings.php
│   │   └── menu.php
│   └── uploads/               # Pasta para imagens e PDFs
│       ├── restaurants/
│       └── menu/
│
├── src/                        # React Frontend
│   ├── services/              # Comunicação com API
│   │   ├── authService.js
│   │   ├── restaurantService.js
│   │   ├── ratingService.js
│   │   └── menuService.js
│   ├── hooks/                 # Hooks customizados
│   │   ├── useAuth.js
│   │   └── useFavoritos.js
│   ├── Componentes/           # Componentes React
│   │   ├── RestaurantCard/
│   │   ├── SearchBar/
│   │   ├── RatingForm/
│   │   ├── RatingList/
│   │   └── ...
│   ├── Pages/                 # Páginas
│   ├── App.jsx
│   └── main.jsx
│
└── public/
```

---

## 💻 PASSO 3: INSTALAR DEPENDÊNCIAS FRONTEND

### 3.1 Abrir Terminal

```bash
# Windows: abra o terminal em: c:\xampp\htdocs\sintex
# Pressione Shift + Click direito > Abrir PowerShell aqui
```

### 3.2 Instalar pacotes Node

```bash
npm install
```

Este comando instala:
- React
- React Router (navegação)
- Vite (build tool)
- E mais...

**⏳ Aguarde a instalação completar (pode levar alguns minutos)**

---

## ✨ PASSO 4: CONFIGURAR URLS DA API

### 4.1 Editar arquivo `vite.config.js`

Se você estiver em uma estrutura diferente, atualize a URL da API.

**Padrão (já configurado):**
```
http://localhost/sintex/backend/api
```

### 4.2 Se você mudou o caminho

Edite `src/services/*Service.js`:

```javascript
// Mudar esta linha:
const API_URL = 'http://localhost/seu-caminho/backend/api';
```

---

## 🎯 PASSO 5: INICIAR O PROJETO

### 5.1 Terminal 1 - Iniciar React

```bash
npm run dev
```

Você verá:
```
VITE v4.0.0  ready in 123 ms

➜  Local:   http://localhost:5173/
```

**Abra no navegador:** http://localhost:5173/

### 5.2 Verificar PHP

Abra outra aba:
```
http://localhost/sintex/backend/api/auth.php?action=verificar
```

Se retornar JSON com erro de autenticação, está tudo certo! ✓

---

## 🔐 PASSO 6: TESTAR AUTENTICAÇÃO

### 6.1 Registrar novo admin

1. Acesse a página de registro
2. Preencha:
   - Nome: João Silva
   - Email: joao@example.com
   - Senha: senha123

### 6.2 Fazer login

1. Use o email e senha criado
2. Você será redirecionado para o dashboard admin

**✓ Autenticação funcionando!**

---

## 🏪 PASSO 7: CADASTRAR RESTAURANTE

### 7.1 No painel admin

1. Clique em "Novo Restaurante"
2. Preencha os dados:
   - Nome
   - Descrição
   - Categoria
   - Endereço
   - Cidade
   - Estado
   - Etc.

3. Clique em "Salvar"

### 7.2 Upload de imagens

1. Imagem de capa (logo)
2. Logo do restaurante

**✓ Restaurante criado!**

---

## 📱 PASSO 8: ADICIONAR AO CARDÁPIO

### 8.1 Criar categoria

1. No restaurante, clique em "Cardápio"
2. Clique em "Nova Categoria"
3. Nome: "Pizzas", "Bebidas", etc.

### 8.2 Adicionar produtos

1. Na categoria, clique em "Novo Produto"
2. Preencha:
   - Nome
   - Descrição
   - Preço
   - Foto (opcional)

3. Clique em "Salvar"

---

## 🌐 PASSO 9: VERIFICAR FUNCIONAMENTO

### 9.1 Home (Cliente)

1. http://localhost:5173/
2. Deve exibir restaurantes cadastrados
3. Teste os filtros
4. Teste o favorito (coração)

### 9.2 Detalhes do restaurante

1. Clique em um restaurante
2. Veja:
   - Foto de capa
   - Informações completas
   - Cardápio
   - Avaliações

### 9.3 Avaliar restaurante

1. Na página de detalhes
2. Preencha o formulário de avaliação
3. Clique em "Enviar"

**✓ Avaliação registrada!**

---

## ⚙️ CONFIGURAÇÕES IMPORTANTES

### Variáveis de Ambiente

Crie arquivo `.env` na raiz do projeto:

```
VITE_API_URL=http://localhost/sintex/backend/api
VITE_APP_NAME=Sintex Restaurantes
```

### Permissões de pastas

Certifique-se que as pasta

s `backend/uploads/*` têm permissão de escrita:

```bash
# Windows (geralmente automático)
# Clique direito > Propriedades > Segurança
```

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### Erro: "Falha ao conectar ao banco"

**Solução:**
1. Verifique se MySQL está rodando
2. Verifique credenciais em `backend/config/db.php`
3. Certifique-se que o banco `sintex_db` existe

### Erro: "CORS - Cross-Origin"

**Solução:**
1. Verifique a URL da API
2. Se usar localhost, pode precisar configurar CORS no PHP

### Imagens não aparecem

**Solução:**
1. Verifique se a pasta `backend/uploads/` existe
2. Verifique permissões da pasta
3. Certifique-se que os caminhos estão corretos

### React não inicia

**Solução:**
```bash
# Remova node_modules
rm -r node_modules

# Reinstale
npm install

# Inicie novamente
npm run dev
```

---

## 📚 PRÓXIMOS PASSOS

1. **Integrar API de restaurantes**
   - OpenStreetMap ou Foursquare
   - Buscar restaurantes próximos por GPS

2. **Implementar mapa**
   - Leaflet ou Mapbox
   - Exibir restaurantes no mapa

3. **Melhorar UI/UX**
   - Adicionar animações
   - Modo escuro
   - Temas customizáveis

4. **Produção**
   - Deploy no servidor
   - Configurar domínio
   - SSL/TLS (HTTPS)

---

## 📞 SUPORTE

Se encontrar problemas:

1. **Verificar logs**
   - Abra console do navegador (F12)
   - Abra PHPMyAdmin e verifique erros

2. **Documentação útil**
   - React: https://react.dev
   - PHP PDO: https://www.php.net/manual/pdo.php
   - MySQL: https://dev.mysql.com/doc/

---

**Parabéns! 🎉 Seu projeto está pronto para usar!**
