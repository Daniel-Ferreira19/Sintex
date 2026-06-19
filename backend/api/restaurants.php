<?php
/**
 * ARQUIVO: api/restaurants.php
 * PROPÓSITO: Endpoints para gerenciar restaurantes
 * 
 * EXPLICAÇÃO:
 * Rotas:
 * GET /api/restaurants.php - Listar restaurantes com filtros
 * GET /api/restaurants.php?id=1 - Obter detalhes
 * POST /api/restaurants.php - Criar novo
 * PUT /api/restaurants.php?id=1 - Atualizar
 * DELETE /api/restaurants.php?id=1 - Deletar
 */

require_once __DIR__ . '/response.php';
require_once __DIR__ . '/../models/Restaurant.php';

session_start();

$restaurant = new Restaurant();

// ============================================================================
// GET /api/restaurants.php
// Listar restaurantes com filtros
// ============================================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['id'])) {
    
    // Obter filtros do URL
    $filtros = [
        'cidade' => $_GET['cidade'] ?? '',
        'categoria' => $_GET['categoria'] ?? '',
        'busca' => $_GET['busca'] ?? ''
    ];
    
    $limite = intval($_GET['limite'] ?? 10);
    $pagina = intval($_GET['pagina'] ?? 1);
    
    // Listar restaurantes
    $restaurantes = $restaurant->listar($filtros, $limite, $pagina);
    
    responderSucesso('Restaurantes listados', ['restaurantes' => $restaurantes]);
}

// ============================================================================
// GET /api/restaurants.php?id=1
// Obter detalhes de um restaurante
// ============================================================================
elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    
    $id = intval($_GET['id']);
    $dados = $restaurant->obter($id);
    
    if ($dados) {
        responderSucesso('Restaurante encontrado', ['restaurante' => $dados]);
    } else {
        responderErro('Restaurante não encontrado', [], 404);
    }
}

// ============================================================================
// POST /api/restaurants.php
// Criar novo restaurante
// ============================================================================
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Verificar se está logado
    if (!isset($_SESSION['user_id'])) {
        responderErro('Usuário não autenticado', [], 401);
    }
    
    // Obter dados
    $dados = obterDadosJSON();
    
    // Validar campos obrigatórios
    if (empty($dados['name'])) {
        responderErro('Nome do restaurante é obrigatório', [], 400);
    }
    
    if (empty($dados['address'])) {
        responderErro('Endereço é obrigatório', [], 400);
    }
    
    if (empty($dados['city'])) {
        responderErro('Cidade é obrigatória', [], 400);
    }
    
    if (empty($dados['state'])) {
        responderErro('Estado é obrigatório', [], 400);
    }
    
    // Criar restaurante
    $resultado = $restaurant->criar($_SESSION['user_id'], $dados);
    
    if ($resultado['sucesso']) {
        responderSucesso($resultado['mensagem'], ['id' => $resultado['id']], 201);
    } else {
        responderErro($resultado['mensagem'], [], 400);
    }
}

// ============================================================================
// PUT /api/restaurants.php?id=1
// Atualizar restaurante
// ============================================================================
elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    
    // Verificar se está logado
    if (!isset($_SESSION['user_id'])) {
        responderErro('Usuário não autenticado', [], 401);
    }
    
    // Obter ID
    if (!isset($_GET['id'])) {
        responderErro('ID do restaurante é obrigatório', [], 400);
    }
    
    $id = intval($_GET['id']);
    $dados = obterDadosJSON();
    
    // Atualizar
    $resultado = $restaurant->atualizar($id, $_SESSION['user_id'], $dados);
    
    if ($resultado['sucesso']) {
        responderSucesso($resultado['mensagem']);
    } else {
        responderErro($resultado['mensagem'], [], 403);
    }
}

// ============================================================================
// DELETE /api/restaurants.php?id=1
// Deletar restaurante
// ============================================================================
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    
    // Verificar se está logado
    if (!isset($_SESSION['user_id'])) {
        responderErro('Usuário não autenticado', [], 401);
    }
    
    // Obter ID
    if (!isset($_GET['id'])) {
        responderErro('ID do restaurante é obrigatório', [], 400);
    }
    
    $id = intval($_GET['id']);
    
    // Deletar
    $resultado = $restaurant->deletar($id, $_SESSION['user_id']);
    
    if ($resultado['sucesso']) {
        responderSucesso($resultado['mensagem']);
    } else {
        responderErro($resultado['mensagem'], [], 403);
    }
}

// ============================================================================
// Método HTTP inválido
// ============================================================================
else {
    responderErro('Método HTTP não permitido', [], 405);
}

?>
