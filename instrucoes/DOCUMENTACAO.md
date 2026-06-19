# 🍽️ SINTEX - Plataforma de Restaurantes

> Inspirada em Google Maps, Trivago e TripAdvisor - Uma plataforma completa para descobrir, avaliar e gerenciar restaurantes.

---

## 📖 VISÃO GERAL DO PROJETO

**SINTEX** é uma aplicação Full Stack que permite:

### Para Clientes
- ✅ Pesquisar restaurantes por nome, categoria ou cidade
- ✅ Visualizar detalhes completos do restaurante
- ✅ Ver cardápio com preços
- ✅ Visualizar avaliações e comentários
- ✅ Avaliar e comentar sobre restaurantes
- ✅ Adicionar restaurantes aos favoritos (localStorage)
- ✅ Ver localização no mapa

### Para Administradores
- ✅ Criar conta e fazer login
- ✅ Cadastrar múltiplos restaurantes
- ✅ Editar informações do restaurante
- ✅ Gerenciar cardápio (adicionar produtos)
- ✅ Upload de cardápio em PDF/JPG/PNG
- ✅ Ver estatísticas e avaliações
- ✅ Dashboard com métricas

---

## 🏗️ ARQUITETURA DO PROJETO

### Frontend (React)
```
SPA (Single Page Application) usando React 18
- Roteamento com React Router
- Chamadas HTTP com Fetch API
- Estado com Hooks (useState, useEffect, useContext)
- Armazenamento local com localStorage
```

### Backend (PHP)
```
REST APIs com PHP puro (sem frameworks)
- Controllers para cada recurso
- Models para lógica de banco de dados
- Autenticação com sessões PHP
- Validações de dados
- Resposta em JSON
```

### Database (MySQL)
```
Banco de dados relacional com 7 tabelas:
- users (administradores)
- restaurants (restaurantes)
- ratings (avaliações)
- menu_categories (categorias de cardápio)
- menu_items (produtos do cardápio)
- menu_uploads (PDFs e imagens do cardápio)
- business_hours (horários de funcionamento)
```

---

## 📂 ESTRUTURA DE ARQUIVOS

### Backend

```
backend/
├── config/
│   ├── db.php              # Conexão com MySQL (PDO)
│   └── database.sql        # Script SQL para criar tabelas
│
├── models/                 # Lógica de banco de dados
│   ├── User.php           # CRUD de usuários
│   ├── Restaurant.php     # CRUD de restaurantes
│   ├── Rating.php         # CRUD de avaliações
│   └── Menu.php           # CRUD de cardápio
│
├── api/                   # Endpoints HTTP
│   ├── response.php       # Funções auxiliares de resposta
│   ├── auth.php          # Autenticação (login/registro)
│   ├── restaurants.php   # Gerenciar restaurantes
│   ├── ratings.php       # Gerenciar avaliações
│   └── menu.php          # Gerenciar cardápio
│
└── uploads/              # Armazenamento de arquivos
    ├── restaurants/      # Logos e fotos
    └── menu/            # PDFs e imagens de cardápio
```

### Frontend

```
src/
├── services/             # Chamadas API
│   ├── authService.js
│   ├── restaurantService.js
│   ├── ratingService.js
│   └── menuService.js
│
├── hooks/                # Hooks customizados
│   ├── useAuth.js
│   └── useFavoritos.js
│
├── Componentes/          # Componentes React reutilizáveis
│   ├── RestaurantCard/
│   ├── SearchBar/
│   ├── RatingForm/
│   ├── RatingList/
│   ├── Menu/
│   ├── Footer/
│   ├── Banner/
│   └── ...
│
├── Pages/                # Páginas da aplicação
│   ├── Home/
│   ├── About/
│   ├── Admin/
│   └── ...
│
├── App.jsx               # Componente raiz
└── main.jsx              # Ponto de entrada
```

---

## 🔄 FLUXO DE DADOS

### Exemplo: Listar Restaurantes

```
1. Usuário acessa Home
   ↓
2. Component chama restaurantService.listar()
   ↓
3. Service faz fetch para: /backend/api/restaurants.php
   ↓
4. PHP Controller obtém dados com Restaurant.php
   ↓
5. Restaurant.php queries MySQL
   ↓
6. MySQL retorna dados
   ↓
7. PHP retorna JSON
   ↓
8. React renderiza <RestaurantCard /> para cada item
```

### Exemplo: Criar Avaliação

```
1. Usuário preenche RatingForm
   ↓
2. handleSubmit() chama ratingService.criar()
   ↓
3. Service envia POST para /backend/api/ratings.php
   ↓
4. PHP valida dados
   ↓
5. Rating.php insere no MySQL
   ↓
6. Restaurant.php atualiza média de avaliações
   ↓
7. localStorage marca como "avaliado"
   ↓
8. React exibe mensagem de sucesso
```

---

## 🔐 AUTENTICAÇÃO

### Sistema de Login

**Fluxo:**
```
1. Admin preenche email/senha
2. Service faz POST /api/auth.php?action=login
3. PHP verifica email no banco
4. Compara senha com password_verify()
5. Se correto, cria sessão PHP
6. Retorna dados do usuário
7. React armazena no localStorage
8. Componentes verificam localStorage para mostrar/esconder UI admin
```

### Proteção de Rotas

```javascript
// ProtectedRoute.jsx - Valida se está logado
{estaLogado ? <AdminPage /> : <Redirect to="/login" />}
```

### Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Validações no servidor (não confiar em client)
- ✅ Verificação de propriedade (só admin pode editar seus restaurantes)
- ✅ Sessions PHP com credentials: 'include'

---

## 📊 BANCO DE DADOS

### Tabelas Principais

#### Users
```sql
id → PK
name → string
email → unique
password → bcrypt
phone → opcional
created_at → timestamp
```

#### Restaurants
```sql
id → PK
user_id → FK users (pode ser NULL para restaurantes de API)
name, description, category
address, city, state, zip_code
latitude, longitude (para mapa)
rating, total_ratings (média de avaliações)
created_at, updated_at
```

#### Ratings
```sql
id → PK
restaurant_id → FK restaurants
customer_name, customer_email
rating (1-5)
positive_point, negative_point
comment
browser_fingerprint (para evitar duplicatas)
is_positive (auto calculado)
created_at
```

#### Menu_Categories
```sql
id → PK
restaurant_id → FK restaurants
name, description
order (sequência de exibição)
```

#### Menu_Items
```sql
id → PK
menu_category_id → FK menu_categories
restaurant_id → FK restaurants
name, description, price
image_url
is_available
created_at
```

---

## 🛠️ COMO USAR AS APIs

### 1. Autenticação

```bash
# Registrar novo admin
POST /backend/api/auth.php?action=register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "phone": "(11) 98765-4321"
}
```

```bash
# Fazer login
POST /backend/api/auth.php?action=login

{
  "email": "joao@example.com",
  "password": "senha123"
}
```

### 2. Restaurantes

```bash
# Listar com filtros
GET /backend/api/restaurants.php?cidade=São Paulo&categoria=Pizzaria&busca=Dom&limite=10&pagina=1

# Obter detalhes
GET /backend/api/restaurants.php?id=1

# Criar novo (requer autenticação)
POST /backend/api/restaurants.php
{
  "name": "Pizzaria do João",
  "address": "Rua X, 123",
  ...
}

# Atualizar
PUT /backend/api/restaurants.php?id=1
{
  "name": "Novo nome",
  ...
}

# Deletar
DELETE /backend/api/restaurants.php?id=1
```

### 3. Avaliações

```bash
# Criar avaliação
POST /backend/api/ratings.php
{
  "restaurant_id": 1,
  "customer_name": "Maria",
  "rating": 5,
  "positive_point": "Excelente comida",
  "negative_point": "Demora no atendimento",
  "comment": "Adorei!",
  "browser_fingerprint": "abc123"
}

# Listar avaliações
GET /backend/api/ratings.php?restaurant_id=1&tipo=todas&limite=10

# Estatísticas
GET /backend/api/ratings.php?action=stats&restaurant_id=1
```

### 4. Cardápio

```bash
# Obter cardápio
GET /backend/api/menu.php?restaurant_id=1

# Criar categoria
POST /backend/api/menu.php?action=criar_categoria
{
  "restaurant_id": 1,
  "name": "Pizzas",
  "description": "Nossas pizzas clássicas"
}

# Criar produto
POST /backend/api/menu.php?action=criar_produto
{
  "menu_category_id": 1,
  "restaurant_id": 1,
  "name": "Pizza Margherita",
  "description": "Tomate, mozzarela, manjericão",
  "price": 35.90
}

# Upload cardápio
POST /backend/api/menu.php?action=upload_cardapio
FormData: {
  "file": [arquivo.pdf],
  "restaurant_id": 1
}
```

---

## 💡 CONCEITOS IMPORTANTES

### localStorage (Favoritos)

O sistema de favoritos **não requer login**. Usa localStorage:

```javascript
// Adicionar favorito
localStorage.setItem('favoritos', JSON.stringify([1, 3, 5]))

// Verificar se é favorito
const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]')
if (favoritos.includes(restaurantId)) { /* é favorito */ }
```

**Importância:** Favoritos são perdidos ao limpar histórico do navegador

### Fingerprint do Navegador

Sistema para evitar múltiplas avaliações do mesmo usuário:

```javascript
// Hash do navegador baseado em:
// - User Agent
// - Linguagem
// - TimeZone
// - Resolução da tela

const fingerprint = gerarFingerprint() // "abc123xyz"
localStorage.setItem(`restaurant_${id}_rated`, 'true')
```

### Validações

- **Frontend:** Feedback rápido ao usuário
- **Backend:** Validações críticas (segurança)
- **Banco:** Constraints (NOT NULL, UNIQUE, FOREIGN KEY)

---

## 🚀 MELHORIAS FUTURAS

- [ ] Integração com Google Maps API
- [ ] Integração com Foursquare/OpenStreetMap
- [ ] Sistema de reservas
- [ ] Chat entre cliente e restaurante
- [ ] Pagamento integrado
- [ ] App mobile (React Native)
- [ ] Busca por localização (GPS)
- [ ] Modo escuro
- [ ] Notificações push
- [ ] Sistema de cupons/promoções

---

## 📝 LICENÇA

Este projeto é fornecido como exemplo educacional.

---

## ✨ CREDITS

Desenvolvido como plataforma acadêmica demonstrando:
- Arquitetura Full Stack
- Boas práticas em React e PHP
- Design Patterns (MVC, Services)
- Segurança web básica
- SQL e relacionamentos de dados

---

**Dúvidas? Verifique o arquivo [INSTALACAO.md](./INSTALACAO.md)**
