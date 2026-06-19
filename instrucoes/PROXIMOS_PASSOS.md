# 🎯 PRÓXIMOS PASSOS - GUIA PRÁTICO

## ✅ O QUE JÁ ESTÁ PRONTO

```
Backend
  ✓ Conexão com MySQL (config/db.php)
  ✓ Banco de dados completo (database.sql)
  ✓ Modelo User.php
  ✓ Modelo Restaurant.php
  ✓ Modelo Rating.php
  ✓ Modelo Menu.php
  ✓ API /auth.php (login, registro)
  ✓ API /restaurants.php (CRUD)
  ✓ API /ratings.php (avaliações)
  ✓ API /menu.php (cardápio)

Frontend React
  ✓ authService.js (autenticação)
  ✓ restaurantService.js (restaurantes)
  ✓ ratingService.js (avaliações)
  ✓ menuService.js (cardápio)
  ✓ useAuth.js (hook autenticação)
  ✓ useFavoritos.js (hook favoritos)
  ✓ RestaurantCard.jsx (componente)
  ✓ SearchBar.jsx (componente)
  ✓ RatingForm.jsx (componente)
  ✓ RatingList.jsx (componente)
  ✓ Home_EXAMPLE.jsx (página exemplo)
  ✓ AdminDashboard_EXAMPLE.jsx (painel exemplo)

Documentação
  ✓ INSTALACAO.md (guia de setup)
  ✓ DOCUMENTACAO.md (documentação técnica)
  ✓ RESUMO_DO_PROJETO.md (sumário)
  ✓ INDICE_COMPLETO.md (índice)
```

---

## 🚀 FASE 1: PREPARAÇÃO (30 minutos)

### 1.1 Seguir o Guia de Instalação

```bash
# 1. Abrir INSTALACAO.md
# 2. Seguir cada passo:
#    - Instalar XAMPP
#    - Criar banco de dados
#    - Importar SQL
#    - Instalar Node.js
#    - npm install
#    - npm run dev
```

### 1.2 Verificar Setup

```bash
# Testar Backend
curl http://localhost/sintex/backend/api/auth.php?action=verificar

# Testar Frontend
http://localhost:5173 (deve abrir página React)
```

---

## 📋 FASE 2: INTEGRAÇÃO (2-3 horas)

### 2.1 Copiar Home_EXAMPLE para Home.jsx

```bash
# Arquivo: src/Pages/Home/Home.jsx

# Copiar conteúdo de Home_EXAMPLE.jsx
# Substituir o Home.jsx existente

# Certifique-se de:
✓ Importar RestaurantCard
✓ Importar SearchBar
✓ Importar restaurantService
✓ CSS está correto
```

### 2.2 Copiar AdminDashboard para seu Admin

```bash
# Arquivo: src/Pages/Admin/Admin.jsx (ou criar)

# Copiar conteúdo de AdminDashboard_EXAMPLE.jsx
# Integrar em sua página admin

# Certifique-se de:
✓ Usar useAuth() para verificar login
✓ Mostrar só para admins
✓ CSS está correto
```

### 2.3 Copiar Componentes

```bash
# Copie para seu projeto:
✓ src/Componentes/RestaurantCard/
✓ src/Componentes/SearchBar/
✓ src/Componentes/RatingForm/
✓ src/Componentes/RatingList/

# Certifique-se de manter a estrutura de pastas
```

### 2.4 Copiar Serviços e Hooks

```bash
# Se não existem, copie:
✓ src/services/authService.js
✓ src/services/restaurantService.js
✓ src/services/ratingService.js
✓ src/services/menuService.js
✓ src/hooks/useAuth.js
✓ src/hooks/useFavoritos.js
```

---

## 📄 FASE 3: CRIAR PÁGINAS (3-4 horas)

### 3.1 Página de Detalhes do Restaurante

**Arquivo:** `src/Pages/RestaurantDetails/RestaurantDetails.jsx`

**O que exibir:**
```jsx
import { useParams } from 'react-router-dom';
import { restaurantService, menuService, ratingService } from '../../services';
import { RatingForm } from '../../Componentes/RatingForm/RatingForm';
import { RatingList } from '../../Componentes/RatingList/RatingList';

export const RestaurantDetails = () => {
  const { id } = useParams(); // ID do URL
  const [restaurante, setRestaurante] = useState(null);

  useEffect(() => {
    const buscar = async () => {
      const res = await restaurantService.obter(id);
      if (res.sucesso) setRestaurante(res.dados.restaurante);
    };
    buscar();
  }, [id]);

  return (
    <div>
      {/* Foto de capa */}
      <img src={restaurante?.cover_image_url} />

      {/* Informações */}
      <h1>{restaurante?.name}</h1>
      <p>{restaurante?.description}</p>

      {/* Cardápio */}
      {restaurante?.cardapio && (
        <div>
          <h2>Cardápio</h2>
          {restaurante.cardapio.map(categoria => (
            <div key={categoria.id}>
              <h3>{categoria.name}</h3>
              {/* Listar produtos */}
            </div>
          ))}
        </div>
      )}

      {/* Formulário de Avaliação */}
      <RatingForm restauranteId={id} />

      {/* Lista de Avaliações */}
      <RatingList restauranteId={id} />

      {/* Mapa */}
      <a href={restaurante?.google_maps_url} target="_blank">
        Ver no Mapa
      </a>
    </div>
  );
};
```

**Rota:** `<Route path="/restaurante/:id" element={<RestaurantDetails />} />`

### 3.2 Página de Favoritos

**Arquivo:** `src/Pages/Favoritos/Favoritos.jsx`

```jsx
import { useFavoritos } from '../../hooks/useFavoritos';
import { restaurantService } from '../../services';
import { RestaurantCard } from '../../Componentes/RestaurantCard/RestaurantCard';

export const Favoritos = () => {
  const { favoritos } = useFavoritos();
  const [restaurantes, setRestaurantes] = useState([]);

  useEffect(() => {
    const buscar = async () => {
      // Buscar dados de cada favorito
      for (let id of favoritos) {
        const res = await restaurantService.obter(id);
        if (res.sucesso) {
          setRestaurantes(prev => [...prev, res.dados.restaurante]);
        }
      }
    };
    buscar();
  }, [favoritos]);

  return (
    <div>
      <h1>❤️ Meus Favoritos</h1>
      {restaurantes.length === 0 ? (
        <p>Nenhum favorito adicionado</p>
      ) : (
        <div className="grid">
          {restaurantes.map(r => (
            <RestaurantCard key={r.id} restaurante={r} />
          ))}
        </div>
      )}
    </div>
  );
};
```

**Rota:** `<Route path="/favoritos" element={<Favoritos />} />`

### 3.3 Página de Login/Registro

**Arquivo:** `src/Pages/Auth/AuthPage.jsx`

```jsx
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { fazerLogin, fazerRegistro } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (isLogin) {
      const res = await fazerLogin(
        formData.get('email'),
        formData.get('password')
      );
      if (res.sucesso) navigate('/admin');
    } else {
      const res = await fazerRegistro(
        formData.get('name'),
        formData.get('email'),
        formData.get('password'),
        formData.get('phone')
      );
      if (res.sucesso) navigate('/login');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {!isLogin && (
        <>
          <input name="name" placeholder="Nome" required />
          <input name="phone" placeholder="Telefone" />
        </>
      )}
      <input name="email" placeholder="Email" type="email" required />
      <input name="password" placeholder="Senha" type="password" required />
      <button type="submit">
        {isLogin ? 'Login' : 'Registrar'}
      </button>
      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'Criar conta' : 'Já tenho conta'}
      </button>
    </form>
  );
};
```

---

## 🛠️ FASE 4: CRIAR PAINEL ADMIN (4-5 horas)

### 4.1 Página para Criar Restaurante

**Arquivo:** `src/Pages/Admin/CreateRestaurant.jsx`

```jsx
import { useState } from 'react';
import { restaurantService } from '../../services';

export const CreateRestaurant = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    // ... outros campos
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await restaurantService.criar(form);
    if (res.sucesso) {
      alert('Restaurante criado!');
      // Redirecionar
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos do formulário */}
      <input
        name="name"
        value={form.name}
        onChange={(e) => setForm({...form, name: e.target.value})}
        placeholder="Nome do restaurante"
        required
      />
      {/* ... mais campos */}
      <button type="submit">Criar Restaurante</button>
    </form>
  );
};
```

### 4.2 Página para Gerenciar Cardápio

**Arquivo:** `src/Pages/Admin/ManageMenu.jsx`

```jsx
// Similar ao CreateRestaurant
// Usar menuService.criarProduto()
// Usar menuService.deletarProduto()
// Usar menuService.uploadCardapio()
```

### 4.3 Página para Ver Avaliações

**Arquivo:** `src/Pages/Admin/ViewRatings.jsx`

```jsx
// Usar ratingService.obterEstatisticasGerais()
// Exibir todas as avaliações dos restaurantes do admin
```

---

## 🔗 FASE 5: CONFIGURAR ROTAS (30 minutos)

**Arquivo:** `src/App.jsx`

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './Componentes/ProtectedRoute/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

// Páginas
import Home from './Pages/Home/Home';
import RestaurantDetails from './Pages/RestaurantDetails/RestaurantDetails';
import Favoritos from './Pages/Favoritos/Favoritos';
import AuthPage from './Pages/Auth/AuthPage';
import AdminDashboard from './Pages/Admin/AdminDashboard';

export function App() {
  const { usuario } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/restaurante/:id" element={<RestaurantDetails />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Páginas privadas (admin) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute logado={!!usuario}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* ... mais rotas admin */}
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🧪 FASE 6: TESTES (1-2 horas)

### Checklist de Testes

**Funcionalidades Cliente:**
- [ ] Listar restaurantes
- [ ] Filtrar por cidade
- [ ] Filtrar por categoria
- [ ] Buscar por nome
- [ ] Abrir detalhes
- [ ] Adicionar favorito
- [ ] Ver favoritos
- [ ] Avaliar restaurante
- [ ] Ver avaliações

**Funcionalidades Admin:**
- [ ] Registrar
- [ ] Fazer login
- [ ] Criar restaurante
- [ ] Editar restaurante
- [ ] Deletar restaurante
- [ ] Adicionar categoria
- [ ] Adicionar produto
- [ ] Upload cardápio
- [ ] Ver dashboard

---

## 🎨 FASE 7: MELHORIAS UI/UX (2-3 horas)

### Sugestões de Melhorias

1. **Design System**
   - Cores consistentes
   - Tipografia uniforme
   - Espaçamentos padronizados

2. **Animações**
   - Hover effects
   - Transições suaves
   - Loading spinners

3. **Mobile First**
   - Testar em celular
   - Breakpoints CSS
   - Touch-friendly buttons

4. **Acessibilidade**
   - Labels em inputs
   - Alt em imagens
   - Contrast adequado

---

## 📦 FASE 8: DEPLOY (Futuro)

### Quando estiver pronto, deploy em:

1. **Servidor Web**
   - Hostinger
   - GoDaddy
   - DigitalOcean

2. **Domínio**
   - Comprar domínio
   - Apontar DNS

3. **SSL (HTTPS)**
   - Let's Encrypt (grátis)

4. **Banco de Dados**
   - Cloud MySQL
   - ou no mesmo servidor

---

## ⏱️ TEMPO ESTIMADO

```
Fase 1 (Preparação):     30 min
Fase 2 (Integração):    2-3 horas
Fase 3 (Páginas):       3-4 horas
Fase 4 (Admin):         4-5 horas
Fase 5 (Rotas):        30 min
Fase 6 (Testes):       1-2 horas
Fase 7 (UI/UX):        2-3 horas
─────────────────────────────
TOTAL:                 13-19 horas

(Pode variar conforme experiência)
```

---

## 💡 DICAS IMPORTANTES

### 1. Comece Pequeno
- Não tente fazer tudo de uma vez
- Complete uma fase antes de ir para próxima

### 2. Teste Constantemente
- npm run dev sempre rodando
- Abrir console (F12) para ver erros
- Testar cada funcionalidade

### 3. Use Ferramentas
- **Postman**: testar APIs
- **Chrome DevTools**: debugar frontend
- **phpMyAdmin**: gerenciar BD

### 4. Leia o Código Existente
- Todos os comentários estão lá
- Siga o padrão estabelecido

### 5. Não se Preocupe com Perfeição
- MVP (Mínimo Viável) é suficiente
- Melhorias virão depois

---

## 🆘 PROBLEMAS COMUNS

| Problema | Causa | Solução |
|----------|-------|---------|
| "Cannot find module" | Import incorreto | Verificar caminho do arquivo |
| "API 404" | URL incorreta | Verificar URL em services |
| "Cors error" | Requisição bloqueada | Adicionar CORS headers |
| "Banco não conecta" | Credenciais erradas | Verificar db.php |
| "Componente não aparece" | CSS não importado | Importar CSS no JSX |

---

## 📞 SUPORTE E RECURSOS

1. **Documentação do Projeto**
   - INSTALACAO.md
   - DOCUMENTACAO.md
   - Comentários no código

2. **Comunidades Online**
   - Stack Overflow
   - Reddit r/reactjs
   - GitHub Discussions

3. **Ferramentas Úteis**
   - Postman (testar APIs)
   - VS Code (editor)
   - Chrome DevTools (debugar)

---

## 🎓 APRENDIZADOS

Ao completar este guia, você aprenderá:

✅ Full Stack Development
✅ Arquitetura de projetos
✅ Integração Front/Back
✅ Roteamento em React
✅ Validação de formulários
✅ Gerenciamento de estado
✅ Consumo de APIs
✅ Autenticação
✅ Boas práticas

---

## 🎉 PRÓXIMA AÇÃO

**AGORA:**
1. Leia o arquivo INSTALACAO.md
2. Configure o projeto seguindo os passos
3. Teste cada API com Postman
4. Execute npm run dev
5. Comece a integrar componentes

**BOA SORTE! 🚀**

---

**Criado com ❤️ para ensino Full Stack**
**Versão: 1.0.0**
**Data: 2024**
