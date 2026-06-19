# 🏗️ ARQUITETURA DO PROJETO SINTEX

## 📊 Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENTE (Navegador)                          │
├─────────────────────────────────────────────────────────────────┤
│  React App (SPA)                                                │
│  ├── Pages (Home, Admin, etc)                                   │
│  ├── Componentes (RestaurantCard, RatingForm, etc)              │
│  ├── Services (chamadas HTTP)                                   │
│  └── Hooks (useAuth, useFavoritos)                              │
└────────────────┬─────────────────────────────────────────────────┘
                 │
                 │ FETCH / HTTP
                 │
┌────────────────▼─────────────────────────────────────────────────┐
│                  SERVIDOR (XAMPP / PHP)                           │
├─────────────────────────────────────────────────────────────────┤
│  REST APIs                                                       │
│  ├── /api/auth.php (login, registro)                            │
│  ├── /api/restaurants.php (CRUD)                                │
│  ├── /api/ratings.php (avaliações)                              │
│  └── /api/menu.php (cardápio)                                   │
│                                                                  │
│  Models (Lógica de Dados)                                        │
│  ├── User.php                                                   │
│  ├── Restaurant.php                                             │
│  ├── Rating.php                                                 │
│  └── Menu.php                                                   │
└────────────────┬─────────────────────────────────────────────────┘
                 │
                 │ PDO (Prepared Statements)
                 │
┌────────────────▼─────────────────────────────────────────────────┐
│              BANCO DE DADOS (MySQL)                              │
├─────────────────────────────────────────────────────────────────┤
│  Tabelas:                                                        │
│  ├── users (admin)                                              │
│  ├── restaurants                                                │
│  ├── ratings (avaliações)                                       │
│  ├── menu_categories                                            │
│  ├── menu_items                                                 │
│  ├── menu_uploads                                               │
│  └── business_hours                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUXO DE DADOS - Exemplo: Listar Restaurantes

```
1. FRONTEND (React)
   ┌──────────────────────────────────┐
   │ Usuário clica em "Pesquisar"     │
   │ ou página Home carrega           │
   └───────────────┬──────────────────┘
                   │
2. SERVICE         │
   ┌───────────────▼──────────────────┐
   │ restaurantService.listar({        │
   │   cidade: 'São Paulo',            │
   │   categoria: 'Pizzaria'           │
   │ })                                 │
   └───────────────┬──────────────────┘
                   │
3. FETCH HTTP      │ GET /api/restaurants.php?cidade=São Paulo&categoria=Pizzaria
   ┌───────────────▼──────────────────┐
   │ fetch('http://localhost/         │
   │  sintex/backend/api/             │
   │  restaurants.php?...')           │
   └───────────────┬──────────────────┘
                   │
4. PHP API         │ /api/restaurants.php
   ┌───────────────▼──────────────────┐
   │ Restaurant::listar($filtros)     │
   │ - Validar parâmetros             │
   │ - Montar query SQL               │
   │ - Executar                       │
   └───────────────┬──────────────────┘
                   │
5. DATABASE        │ SELECT * FROM restaurants WHERE city='São Paulo'...
   ┌───────────────▼──────────────────┐
   │ MySQL retorna dados              │
   └───────────────┬──────────────────┘
                   │
6. PHP            │
   ┌───────────────▼──────────────────┐
   │ Converter para JSON              │
   │ {                                │
   │   "sucesso": true,              │
   │   "dados": {                    │
   │     "restaurantes": [...]       │
   │   }                             │
   │ }                                │
   └───────────────┬──────────────────┘
                   │
7. FRONTEND       │
   ┌───────────────▼──────────────────┐
   │ JSON parseado                    │
   │ setState(restaurantes)           │
   │ Renderizar <RestaurantCard />    │
   │ para cada item                   │
   └──────────────────────────────────┘
```

---

## 📦 ESTRUTURA DE PASTAS

### Backend

```
backend/
├── config/
│   ├── db.php              # Conexão PDO
│   │   └── Função getDB()
│   └── database.sql        # Script SQL (7 tabelas + inserts)
│
├── models/                 # Classes de dados
│   ├── User.php
│   │   ├── criar(name, email, password)
│   │   ├── login(email, password)
│   │   ├── obter(id)
│   │   └── atualizar(id, dados)
│   │
│   ├── Restaurant.php
│   │   ├── listar(filtros)
│   │   ├── obter(id)
│   │   ├── criar(user_id, dados)
│   │   ├── atualizar(id, user_id, dados)
│   │   ├── deletar(id, user_id)
│   │   └── atualizarAvaliacao(id)
│   │
│   ├── Rating.php
│   │   ├── criar(restaurant_id, dados)
│   │   ├── listarPorRestaurante(id, tipo)
│   │   ├── verificarJaAvaliou(id, fingerprint)
│   │   ├── obterEstatisticas(id)
│   │   └── obterEstatisticasGerais(user_id)
│   │
│   └── Menu.php
│       ├── criarCategoria(restaurant_id, nome)
│       ├── criarProduto(category_id, dados)
│       ├── atualizarProduto(id, dados)
│       ├── deletarProduto(id)
│       ├── uploadCardapio(restaurant_id, file)
│       └── obterUploads(restaurant_id)
│
├── api/                    # Endpoints REST
│   ├── response.php
│   │   ├── responderJson(sucesso, msg, dados)
│   │   ├── responderErro(msg, dados)
│   │   └── responderSucesso(msg, dados)
│   │
│   ├── auth.php
│   │   ├── POST ?action=register
│   │   ├── POST ?action=login
│   │   ├── POST ?action=logout
│   │   └── GET  ?action=verificar
│   │
│   ├── restaurants.php
│   │   ├── GET    (listar)
│   │   ├── GET ?id= (obter)
│   │   ├── POST   (criar)
│   │   ├── PUT ?id= (atualizar)
│   │   └── DELETE ?id= (deletar)
│   │
│   ├── ratings.php
│   │   ├── POST   (criar)
│   │   ├── GET    (listar)
│   │   └── GET ?action=stats
│   │
│   └── menu.php
│       ├── POST ?action=criar_categoria
│       ├── POST ?action=criar_produto
│       ├── PUT  ?action=atualizar_produto
│       ├── DELETE ?action=deletar_produto
│       ├── POST ?action=upload_cardapio
│       └── GET  (obter)
│
├── uploads/
│   ├── restaurants/        # Logos, fotos
│   └── menu/              # PDFs, imagens cardápio
│
└── (sem framework, PHP puro)
```

### Frontend (React)

```
src/
├── services/              # Chamadas HTTP
│   ├── authService.js
│   │   ├── registro(name, email, password, phone)
│   │   ├── login(email, password)
│   │   ├── logout()
│   │   ├── verificarLogin()
│   │   └── obterUsuarioLocal()
│   │
│   ├── restaurantService.js
│   │   ├── listar(filtros, limite, pagina)
│   │   ├── obter(id)
│   │   ├── criar(dados)
│   │   ├── atualizar(id, dados)
│   │   └── deletar(id)
│   │
│   ├── ratingService.js
│   │   ├── criar(dados)
│   │   ├── listar(restaurant_id, tipo, limite)
│   │   ├── obterEstatisticas(restaurant_id)
│   │   ├── verificarJaAvaliou(restaurant_id)
│   │   ├── marcarAvaliado(restaurant_id)
│   │   └── gerarFingerprint()
│   │
│   └── menuService.js
│       ├── obter(restaurant_id)
│       ├── criarCategoria(dados)
│       ├── criarProduto(dados)
│       ├── atualizarProduto(id, dados)
│       ├── deletarProduto(id, restaurant_id)
│       └── uploadCardapio(restaurant_id, arquivo)
│
├── hooks/                 # Lógica reutilizável
│   ├── useAuth.js
│   │   ├── usuario
│   │   ├── carregando
│   │   ├── erro
│   │   ├── fazerLogin()
│   │   ├── fazerLogout()
│   │   ├── fazerRegistro()
│   │   └── estaLogado()
│   │
│   └── useFavoritos.js
│       ├── favoritos (array)
│       ├── adicionarFavorito()
│       ├── removerFavorito()
│       ├── verificarFavorito()
│       └── alternarFavorito()
│
├── Componentes/           # Componentes reutilizáveis
│   ├── RestaurantCard/
│   │   ├── RestaurantCard.jsx (50 linhas)
│   │   └── RestaurantCard.css
│   │
│   ├── SearchBar/
│   │   ├── SearchBar.jsx (60 linhas)
│   │   └── SearchBar.css
│   │
│   ├── RatingForm/
│   │   ├── RatingForm.jsx (150 linhas)
│   │   └── RatingForm.css
│   │
│   ├── RatingList/
│   │   ├── RatingList.jsx (140 linhas)
│   │   └── RatingList.css
│   │
│   ├── Menu/ (existente)
│   ├── Footer/ (existente)
│   └── ...
│
├── Pages/                 # Páginas/Views
│   ├── Home/
│   │   ├── Home_EXAMPLE.jsx
│   │   ├── Home_EXAMPLE.css
│   │   └── Home.jsx (editar)
│   │
│   ├── Admin/
│   │   ├── AdminDashboard_EXAMPLE.jsx
│   │   ├── AdminDashboard.css
│   │   └── Admin.jsx (editar)
│   │
│   ├── RestaurantDetails/
│   │   └── (CRIAR)
│   │
│   ├── Favoritos/
│   │   └── (CRIAR)
│   │
│   ├── Auth/
│   │   └── (CRIAR)
│   │
│   └── ...
│
├── App.jsx                # Componente raiz + rotas
├── main.jsx               # Entry point
├── index.css              # Estilos globais
└── (React 18 + Vite + React Router)
```

---

## 🗄️ BANCO DE DADOS - Relacionamentos

```
users (1)
   │
   └─────────────────┬─────────────────┐
                     │                 │
            (1:N) restaurants     (ProtectedRoute)
                     │
         ┌───────────┼───────────┐
         │           │           │
    ratings    menu_categories  business_hours
    (1:N)         (1:N)
         │           │
         │       menu_items
         │        (1:N)
         │           │
         │       menu_uploads
         │        (1:N)
         │
         └─────────────────────────────┘

Legenda:
1:N = Um para Muitos (um restaurante pode ter vários itens)
FK = Foreign Key (chave estrangeira)
```

---

## 🔒 SEGURANÇA - Fluxo de Autenticação

```
1. REGISTRO
   ┌─────────────────────────┐
   │ Frontend: Formulário    │
   │ name, email, password   │
   └────────────┬────────────┘
                │
   ┌────────────▼────────────┐
   │ Backend: Validar        │
   │ - Email já existe?      │
   │ - Senha 6+ chars?       │
   └────────────┬────────────┘
                │
   ┌────────────▼────────────┐
   │ Criptografar com bcrypt │
   │ password_hash()         │
   └────────────┬────────────┘
                │
   ┌────────────▼────────────┐
   │ Inserir no BD           │
   │ users table             │
   └────────────┬────────────┘
                │
   ┌────────────▼────────────┐
   │ Retornar sucesso        │
   └─────────────────────────┘

2. LOGIN
   ┌─────────────────────────┐
   │ Frontend: email, password│
   └────────────┬────────────┘
                │
   ┌────────────▼────────────┐
   │ Backend: Buscar email   │
   │ SELECT * FROM users ... │
   └────────────┬────────────┘
                │
   ┌────────────▼────────────┐
   │ Validar senha           │
   │ password_verify()       │
   │ (comparar hashes)       │
   └────────────┬────────────┘
                │
            Correto?
            / \
           /   \
        Sim     Não
         │       │
         │     ┌─▼──────┐
         │     │ Erro   │
         │     └────────┘
         │
   ┌─────▼──────────────┐
   │ Criar SESSION PHP  │
   │ $_SESSION['user'] = │
   └────────┬───────────┘
            │
   ┌────────▼──────────────┐
   │ Retornar dados user   │
   │ localStorage          │
   └─────────────────────────┘

3. VERIFICAÇÃO
   ┌──────────────────────┐
   │ Frontend: proteger   │
   │ rotas privadas       │
   └──────────┬───────────┘
              │
   ┌──────────▼──────────┐
   │ localStorage existe?│
   └──────────┬──────────┘
              │
          Sim / Não
           │    │
        Sim│    │Não
           │    └──▶ Redirecionar /login
           │
   ┌───────▼──────────┐
   │ Permitir acesso  │
   └──────────────────┘
```

---

## 🔄 AVALIAÇÃO - Fluxo Completo

```
1. CLIENTE ACESSA RESTAURANTE
   │
2. VERIFICAR JÁ AVALIOU
   │ (localStorage)
   ├─ Já avaliou? ─→ "Você já avaliou este restaurante"
   │
3. EXIBIR FORMULÁRIO
   │ ├─ Nome
   │ ├─ Estrelas (1-5)
   │ ├─ Ponto positivo
   │ ├─ Ponto negativo
   │ └─ Comentário
   │
4. ENVIAR AVALIAÇÃO
   │ ├─ Validar dados
   │ ├─ Gerar fingerprint (navegador)
   │ └─ POST /api/ratings.php
   │
5. BACKEND RECEBE
   │ ├─ Verificar se já avaliou (fingerprint)
   │ ├─ Calcular is_positive (rating >= 4)
   │ ├─ Inserir no BD
   │ └─ Atualizar média (atualizarAvaliacao)
   │
6. ATUALIZAR FRONTEND
   │ ├─ Marcar localStorage como avaliado
   │ ├─ Recarregar lista de avaliações
   │ └─ Exibir mensagem "Avaliação enviada!"
   │
7. RESULTADO NO BD
   │ ├─ ratings table: novo registro
   │ ├─ restaurants: rating, total_ratings atualizados
   │ └─ Pronto para ver em outras sessões
```

---

## 💾 PERSISTÊNCIA DE DADOS - localStorage

```
Favoritos
├─ Chave: "favoritos"
├─ Valor: [1, 3, 5, 7]
└─ Uso: useFavoritos hook

Usuário
├─ Chave: "usuario"
├─ Valor: {id, name, email}
└─ Uso: useAuth hook

Avaliação (marca como avaliado)
├─ Chave: "restaurant_10_rated"
├─ Valor: "true"
└─ Uso: ratingService.verificarJaAvaliou()
```

---

## 🌐 ROTAS API - Resumo

| Endpoint | Método | Autenticação | Descrição |
|----------|--------|--------------|-----------|
| `/auth.php?action=register` | POST | ❌ | Criar conta |
| `/auth.php?action=login` | POST | ❌ | Fazer login |
| `/auth.php?action=logout` | POST | ✓ | Fazer logout |
| `/restaurants.php` | GET | ❌ | Listar com filtros |
| `/restaurants.php?id=1` | GET | ❌ | Obter detalhes |
| `/restaurants.php` | POST | ✓ | Criar novo |
| `/restaurants.php?id=1` | PUT | ✓ | Atualizar |
| `/restaurants.php?id=1` | DELETE | ✓ | Deletar |
| `/ratings.php` | POST | ❌ | Criar avaliação |
| `/ratings.php?restaurant_id=1` | GET | ❌ | Listar avaliações |
| `/menu.php?restaurant_id=1` | GET | ❌ | Obter cardápio |

---

## 📱 Responsividade

```
Desktop (1200px+)
├── Grid: 4 colunas
├── Fonte: 16px
└── Espaçamento: 20px

Tablet (768px - 1199px)
├── Grid: 2-3 colunas
├── Fonte: 14px
└── Espaçamento: 15px

Mobile (< 768px)
├── Grid: 1 coluna
├── Fonte: 12-14px
└── Espaçamento: 10px
```

---

## 🎨 Design System

```
Cores
├── Primária: #3498db (azul)
├── Sucesso: #27ae60 (verde)
├── Erro: #e74c3c (vermelho)
└── Neutro: #95a5a6 (cinza)

Tipografia
├── Heading: 24-36px, bold
├── Body: 14-16px, regular
└── Caption: 12px, light

Espaçamento
├── xs: 5px
├── sm: 10px
├── md: 15px
├── lg: 20px
└── xl: 30px

Sombras
├── Pequena: 0 2px 8px
├── Média: 0 4px 16px
└── Grande: 0 8px 24px
```

---

## 🔗 Fluxo de Integração

```
1. INSTALAÇÃO
   └─ npm install

2. CONFIGURAÇÃO
   └─ database.sql importado
   └─ API URL configurada em services

3. INTEGRAÇÃO
   └─ Copiar components
   └─ Copiar services
   └─ Copiar hooks

4. PÁGINAS
   └─ Criar Home.jsx
   └─ Criar AdminDashboard.jsx
   └─ Criar RestaurantDetails.jsx
   └─ Criar Favoritos.jsx
   └─ Criar Auth.jsx

5. ROTAS (App.jsx)
   └─ Configurar React Router
   └─ Adicionar todas as rotas
   └─ Adicionar ProtectedRoute

6. TESTES
   └─ Testar cada funcionalidade
   └─ Verificar responsividade
   └─ Corrigir bugs

7. DEPLOY (Futuro)
   └─ Build de produção
   └─ Configurar servidor
   └─ Configurar domínio
```

---

**FIM DA DOCUMENTAÇÃO DE ARQUITETURA**

Veja mais em:
- [DOCUMENTACAO.md](./DOCUMENTACAO.md)
- [PROXIMOS_PASSOS.md](./PROXIMOS_PASSOS.md)
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
