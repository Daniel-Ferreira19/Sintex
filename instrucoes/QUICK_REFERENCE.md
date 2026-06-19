# ⚡ QUICK REFERENCE - REFERÊNCIA RÁPIDA

## 🎯 INÍCIO RÁPIDO (5 MINUTOS)

```bash
# 1. Criar banco
# Abra: http://localhost/phpmyadmin
# Crie: sintex_db
# Cole: backend/config/database.sql

# 2. Instalar Node
npm install

# 3. Iniciar
npm run dev

# 4. Acessar
http://localhost:5173
```

---

## 📚 ARQUIVOS MAIS IMPORTANTES

### Para Leitura
1. `INSTALACAO.md` - Como instalar ⭐⭐⭐
2. `PROXIMOS_PASSOS.md` - O que fazer agora ⭐⭐⭐
3. `DOCUMENTACAO.md` - Técnico

### Para Cópia
```
src/Componentes/RestaurantCard/  ← Copie para seu projeto
src/Componentes/SearchBar/       ← Copie para seu projeto
src/Componentes/RatingForm/      ← Copie para seu projeto
src/Componentes/RatingList/      ← Copie para seu projeto
src/services/*                   ← Copie para seu projeto
src/hooks/*                      ← Copie para seu projeto
```

---

## 🔗 ENDPOINTS API

### Auth
```
POST   /api/auth.php?action=register
POST   /api/auth.php?action=login
POST   /api/auth.php?action=logout
GET    /api/auth.php?action=verificar
```

### Restaurants
```
GET    /api/restaurants.php                      (listar com filtros)
GET    /api/restaurants.php?id=1                 (obter um)
POST   /api/restaurants.php                      (criar)
PUT    /api/restaurants.php?id=1                 (atualizar)
DELETE /api/restaurants.php?id=1                 (deletar)
```

### Ratings
```
POST   /api/ratings.php                          (criar avaliação)
GET    /api/ratings.php?restaurant_id=1          (listar avaliações)
GET    /api/ratings.php?action=stats&restaurant_id=1  (estatísticas)
```

### Menu
```
GET    /api/menu.php?restaurant_id=1             (obter cardápio)
POST   /api/menu.php?action=criar_categoria      (nova categoria)
POST   /api/menu.php?action=criar_produto        (novo produto)
PUT    /api/menu.php?action=atualizar_produto&id=1
DELETE /api/menu.php?action=deletar_produto&id=1
POST   /api/menu.php?action=upload_cardapio      (upload arquivo)
```

---

## 💻 COMANDOS ÚTEIS

### Terminal
```bash
npm install              # Instalar pacotes
npm run dev              # Iniciar desenvolvimento
npm run build            # Build para produção
npm run preview          # Preview de produção
```

### Git (opcional)
```bash
git status               # Ver status
git add .                # Adicionar arquivos
git commit -m "msg"      # Fazer commit
git push                 # Enviar
```

### PHP/MySQL
```bash
# Abrir phpMyAdmin
http://localhost/phpmyadmin

# Terminal MySQL
mysql -u root -p

# Importar SQL
mysql -u root sintex_db < backend/config/database.sql
```

---

## 📱 COMPONENTES E USO

### RestaurantCard
```jsx
import { RestaurantCard } from './Componentes/RestaurantCard/RestaurantCard';

<RestaurantCard restaurante={{
  id: 1,
  name: 'Pizzaria X',
  category: 'Pizzaria',
  city: 'São Paulo',
  rating: 4.5,
  total_ratings: 120,
  cover_image_url: 'url-imagem'
}} />
```

### SearchBar
```jsx
import { SearchBar } from './Componentes/SearchBar/SearchBar';

<SearchBar onFiltros={(filtros) => {
  // filtros = { busca, categoria, cidade }
  console.log(filtros);
}} />
```

### RatingForm
```jsx
import { RatingForm } from './Componentes/RatingForm/RatingForm';

<RatingForm 
  restauranteId={1}
  onSucesso={() => {
    // Atualizar lista de avaliações
  }}
/>
```

### RatingList
```jsx
import { RatingList } from './Componentes/RatingList/RatingList';

<RatingList restauranteId={1} />
```

---

## 🎣 HOOKS E SERVIÇOS

### useAuth
```jsx
import { useAuth } from './hooks/useAuth';

const { usuario, fazerLogin, fazerLogout, estaLogado } = useAuth();
```

### useFavoritos
```jsx
import { useFavoritos } from './hooks/useFavoritos';

const { 
  favoritos,           // array de IDs
  adicionarFavorito,
  removerFavorito,
  verificarFavorito,
  alternarFavorito
} = useFavoritos();
```

### restaurantService
```jsx
import * as restaurantService from './services/restaurantService';

// Listar
const res = await restaurantService.listar({ 
  cidade: 'São Paulo',
  categoria: 'Pizzaria'
});

// Obter
const res = await restaurantService.obter(1);

// Criar
const res = await restaurantService.criar({
  name: 'Novo Restaurante',
  address: '...'
});
```

### ratingService
```jsx
import * as ratingService from './services/ratingService';

// Criar avaliação
const res = await ratingService.criar({
  restaurant_id: 1,
  customer_name: 'João',
  rating: 5,
  positive_point: 'Muito bom',
  negative_point: 'Demora',
  comment: 'Adorei'
});

// Verificar já avaliou
const jaAvaliou = ratingService.verificarJaAvaliou(1);
```

---

## 🗄️ TABELAS DO BANCO

### users
- id (PK)
- name, email (unique), password
- phone, created_at

### restaurants
- id (PK), user_id (FK)
- name, description, category
- address, city, state, zip_code
- latitude, longitude
- rating, total_ratings
- created_at, updated_at

### ratings
- id (PK), restaurant_id (FK)
- customer_name, customer_email
- rating (1-5), positive_point, negative_point
- comment, browser_fingerprint
- is_positive, created_at

### menu_categories
- id (PK), restaurant_id (FK)
- name, description, order

### menu_items
- id (PK), menu_category_id (FK), restaurant_id (FK)
- name, description, price
- image_url, is_available, created_at

### menu_uploads
- id (PK), restaurant_id (FK)
- file_type, file_url, file_name, uploaded_at

### business_hours
- id (PK), restaurant_id (FK)
- day_of_week, opening_time, closing_time, is_closed

---

## 🐛 ERROS COMUNS

| Erro | Solução |
|------|---------|
| `Cannot find module 'react'` | `npm install` |
| `404 on /api/restaurants.php` | Verificar URL em services |
| `Access denied for user 'root'` | Verificar credenciais db.php |
| `CORS error` | Adicionar headers CORS no PHP |
| `Imagem não aparece` | Verificar URL e pasta uploads/ |
| `TypeError: Cannot read property` | Verificar se dados existem |
| `Cannot read database` | MySQL não está rodando |

---

## 🔐 SEGURANÇA CHECKLIST

- ✓ Senhas com bcrypt
- ✓ Validações no servidor
- ✓ Verificação de propriedade
- ✓ Proteção contra avaliação 2x
- ✓ Validação de arquivo
- ✓ SQL Injection: Usar PDO prepared statements
- ✓ XSS: Não confiar em input do cliente

---

## 📊 ESTRUTURA MVC

```
Model (Dados)
├── User.php
├── Restaurant.php
├── Rating.php
└── Menu.php

View (Frontend)
├── Pages/ (páginas)
├── Componentes/ (reutilizáveis)
└── App.jsx

Controller (Lógica)
├── auth.php
├── restaurants.php
├── ratings.php
└── menu.php
```

---

## 🎯 CHECKLIST DE FUNCIONALIDADES

### Cliente
- [ ] Listar restaurantes
- [ ] Filtrar e buscar
- [ ] Ver detalhes
- [ ] Adicionar favorito
- [ ] Ver favoritos
- [ ] Avaliar restaurante
- [ ] Ver avaliações

### Admin
- [ ] Registrar
- [ ] Login
- [ ] Criar restaurante
- [ ] Editar restaurante
- [ ] Deletar restaurante
- [ ] Gerenciar cardápio
- [ ] Ver dashboard

---

## 📞 URLS IMPORTANTES

```
Frontend:     http://localhost:5173
phpMyAdmin:   http://localhost/phpmyadmin
API:          http://localhost/sintex/backend/api
```

---

## 📚 REFERÊNCIAS RÁPIDAS

### React
- useState: gerenciar estado
- useEffect: efeitos colaterais
- useCallback: memoizar função
- Custom Hook: lógica reutilizável

### PHP
- PDO: database seguro
- password_hash: criptografar
- password_verify: validar
- json_encode: retornar JSON

### MySQL
- SELECT: buscar dados
- INSERT: adicionar
- UPDATE: atualizar
- DELETE: remover
- JOIN: relacionar tabelas

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Código testado
- [ ] Sem console.log() debug
- [ ] Variáveis de ambiente configuradas
- [ ] SSL/HTTPS
- [ ] Banco em servidor
- [ ] Uploads para CDN (opcional)
- [ ] Backup configurado

---

## 💡 PRÓ-DICAS

1. **Use localStorage para favoritos**
   ```javascript
   localStorage.setItem('favoritos', JSON.stringify([1,2,3]))
   ```

2. **Gere fingerprint único por navegador**
   ```javascript
   const fp = gerarFingerprint(); // Em ratingService
   ```

3. **Use classes CSS reutilizáveis**
   ```css
   .btn, .btn-primary, .btn-small
   ```

4. **Teste APIs com Postman**
   - Criar requests
   - Testar sem frontend

5. **Use developer tools**
   - F12 abre Chrome DevTools
   - Network: ver requisições
   - Console: ver erros

---

## ✅ FINAL CHECKLIST

- [ ] INSTALACAO.md lido
- [ ] Banco de dados criado
- [ ] npm install executado
- [ ] npm run dev rodando
- [ ] APIs testadas
- [ ] Componentes copiados
- [ ] Páginas integradas
- [ ] Rotas configuradas
- [ ] Testes completados
- [ ] Tudo funcionando! 🎉

---

**Próximo passo: Ler PROXIMOS_PASSOS.md** 📋

---

**Criado com ❤️**
**Versão: 1.0**
**Last Updated: 2024**
