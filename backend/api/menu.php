<?php
/**
 * ARQUIVO: api/menu.php
 * PROPÓSITO: Endpoints para gerenciar cardápio
 * 
 * EXPLICAÇÃO:
 * Rotas:
 * POST /api/menu.php?action=criar_categoria - Criar categoria
 * POST /api/menu.php?action=criar_produto - Criar produto
 * PUT /api/menu.php?action=atualizar_produto&id=1 - Atualizar produto
 * DELETE /api/menu.php?action=deletar_produto&id=1 - Deletar produto
 * POST /api/menu.php?action=upload_cardapio - Upload de cardápio
 * GET /api/menu.php?restaurant_id=1 - Obter cardápio
 */

require_once __DIR__ . '/response.php';
require_once __DIR__ . '/../models/Menu.php';
require_once __DIR__ . '/../models/Restaurant.php';

session_start();

// Verificar se está logado
if (!isset($_SESSION['user_id']) && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    responderErro('Usuário não autenticado', [], 401);
}

$menu = new Menu();
$restaurant = new Restaurant();

// Obter action
$action = $_GET['action'] ?? 'listar';

// ============================================================================
// POST: Criar categoria
// ============================================================================
if ($action === 'criar_categoria' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $dados = obterDadosJSON();
    
    if (empty($dados['restaurant_id']) || empty($dados['name'])) {
        responderErro('Restaurant ID e Name são obrigatórios', [], 400);
    }
    
    // Verificar se o restaurante pertence ao usuário
    $rest = $restaurant->obter($dados['restaurant_id']);
    if (!$rest || $rest['user_id'] != $_SESSION['user_id']) {
        responderErro('Acesso negado', [], 403);
    }
    
    $resultado = $menu->criarCategoria(
        $dados['restaurant_id'],
        $dados['name'],
        $dados['description'] ?? null,
        $dados['order'] ?? 0
    );
    
    if ($resultado['sucesso']) {
        responderSucesso($resultado['mensagem'], ['id' => $resultado['id']], 201);
    } else {
        responderErro($resultado['mensagem'], [], 400);
    }
}

// ============================================================================
// POST: Criar produto
// ============================================================================
elseif ($action === 'criar_produto' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $dados = obterDadosJSON();
    
    if (empty($dados['menu_category_id']) || empty($dados['restaurant_id'])) {
        responderErro('Category ID e Restaurant ID são obrigatórios', [], 400);
    }
    
    // Verificar se o restaurante pertence ao usuário
    $rest = $restaurant->obter($dados['restaurant_id']);
    if (!$rest || $rest['user_id'] != $_SESSION['user_id']) {
        responderErro('Acesso negado', [], 403);
    }
    
    $resultado = $menu->criarProduto(
        $dados['menu_category_id'],
        $dados['restaurant_id'],
        $dados
    );
    
    if ($resultado['sucesso']) {
        responderSucesso($resultado['mensagem'], ['id' => $resultado['id']], 201);
    } else {
        responderErro($resultado['mensagem'], [], 400);
    }
}

// ============================================================================
// PUT: Atualizar produto
// ============================================================================
elseif ($action === 'atualizar_produto' && $_SERVER['REQUEST_METHOD'] === 'PUT') {
    
    if (!isset($_GET['id'])) {
        responderErro('ID do produto é obrigatório', [], 400);
    }
    
    $dados = obterDadosJSON();
    $id = intval($_GET['id']);
    
    if (empty($dados['restaurant_id'])) {
        responderErro('Restaurant ID é obrigatório', [], 400);
    }
    
    // Verificar acesso
    $rest = $restaurant->obter($dados['restaurant_id']);
    if (!$rest || $rest['user_id'] != $_SESSION['user_id']) {
        responderErro('Acesso negado', [], 403);
    }
    
    $resultado = $menu->atualizarProduto($id, $dados['restaurant_id'], $dados);
    
    if ($resultado['sucesso']) {
        responderSucesso($resultado['mensagem']);
    } else {
        responderErro($resultado['mensagem'], [], 400);
    }
}

// ============================================================================
// DELETE: Deletar produto
// ============================================================================
elseif ($action === 'deletar_produto' && $_SERVER['REQUEST_METHOD'] === 'DELETE') {
    
    if (!isset($_GET['id'])) {
        responderErro('ID do produto é obrigatório', [], 400);
    }
    
    $dados = obterDadosJSON();
    $id = intval($_GET['id']);
    
    if (empty($dados['restaurant_id'])) {
        responderErro('Restaurant ID é obrigatório', [], 400);
    }
    
    // Verificar acesso
    $rest = $restaurant->obter($dados['restaurant_id']);
    if (!$rest || $rest['user_id'] != $_SESSION['user_id']) {
        responderErro('Acesso negado', [], 403);
    }
    
    $resultado = $menu->deletarProduto($id, $dados['restaurant_id']);
    
    if ($resultado['sucesso']) {
        responderSucesso($resultado['mensagem']);
    } else {
        responderErro($resultado['mensagem'], [], 400);
    }
}

// ============================================================================
// POST: Upload de cardápio
// ============================================================================
elseif ($action === 'upload_cardapio' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    
    if (!isset($_FILES['file']) || !isset($_POST['restaurant_id'])) {
        responderErro('Arquivo e Restaurant ID são obrigatórios', [], 400);
    }
    
    $file = $_FILES['file'];
    $restaurant_id = intval($_POST['restaurant_id']);
    
    // Verificar acesso
    $rest = $restaurant->obter($restaurant_id);
    if (!$rest || $rest['user_id'] != $_SESSION['user_id']) {
        responderErro('Acesso negado', [], 403);
    }
    
    // Validar tipo de arquivo
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $permitidos = ['pdf', 'jpg', 'jpeg', 'png'];
    
    if (!in_array($ext, $permitidos)) {
        responderErro('Tipo de arquivo não permitido. Use: PDF, JPG ou PNG', [], 400);
    }
    
    // Validar tamanho (máximo 10MB)
    if ($file['size'] > 10 * 1024 * 1024) {
        responderErro('Arquivo muito grande. Máximo 10MB', [], 400);
    }
    
    // Criar nome único
    $nome_arquivo = time() . '_' . uniqid() . '.' . $ext;
    $caminho_destino = __DIR__ . '/../uploads/menu/' . $nome_arquivo;
    
    // Mover arquivo
    if (!move_uploaded_file($file['tmp_name'], $caminho_destino)) {
        responderErro('Erro ao fazer upload do arquivo', [], 400);
    }
    
    // Registrar no banco de dados
    $url_relativa = '/backend/uploads/menu/' . $nome_arquivo;
    $resultado = $menu->uploadCardapio(
        $restaurant_id,
        strtoupper($ext),
        $url_relativa,
        $file['name']
    );
    
    if ($resultado['sucesso']) {
        responderSucesso($resultado['mensagem'], ['url' => $url_relativa], 201);
    } else {
        // Deletar arquivo se erro no banco
        unlink($caminho_destino);
        responderErro($resultado['mensagem'], [], 400);
    }
}

// ============================================================================
// GET: Listar cardápio
// ============================================================================
elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    if (isset($_GET['restaurant_id'])) {
        
        $restaurant_id = intval($_GET['restaurant_id']);
        $rest = $restaurant->obter($restaurant_id);
        
        if ($rest) {
            responderSucesso('Cardápio obtido', ['cardapio' => $rest['cardapio']]);
        } else {
            responderErro('Restaurante não encontrado', [], 404);
        }
    } else {
        responderErro('Restaurant ID é obrigatório', [], 400);
    }
}

// ============================================================================
// Ação inválida
// ============================================================================
else {
    responderErro('Ação inválida ou método HTTP não permitido', [], 405);
}

?>
