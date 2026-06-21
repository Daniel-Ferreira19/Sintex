<?php
/**
 * ARQUIVO: api/restaurants.php
 * PROPÓSITO: Endpoints para gerenciar restaurantes
 */

// ============================================================================
// 1. CABEÇALHOS CORS E JSON (Essencial para o Vite/React)
// ============================================================================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Interceptador Pre-flight (Resolve o erro vermelho no Network)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ============================================================================
// 2. DEPENDÊNCIAS
// ============================================================================
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
    
    // ATENÇÃO: Para testar sem travar no React, desativei temporariamente a trava de sessão.
    // O React usando fetch não envia cookies de sessão automaticamente sem configuração extra.
    /*
    if (!isset($_SESSION['user_id'])) {
        responderErro('Usuário não autenticado', [], 401);
    }
    */
    
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
    
    // Definindo um ID de usuário fixo para testes (já que a sessão está comentada)
    $user_id_teste = 1; 
    
    // Criar restaurante
    $resultado = $restaurant->criar($user_id_teste, $dados);
    
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
    
    /*
    if (!isset($_SESSION['user_id'])) {
        responderErro('Usuário não autenticado', [], 401);
    }
    */
    
    // Obter ID
    if (!isset($_GET['id'])) {
        responderErro('ID do restaurante é obrigatório', [], 400);
    }
    
    $id = intval($_GET['id']);
    $dados = obterDadosJSON();
    
    $user_id_teste = 1;
    
    // Atualizar
    $resultado = $restaurant->atualizar($id, $user_id_teste, $dados);
    
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
    
    /*
    if (!isset($_SESSION['user_id'])) {
        responderErro('Usuário não autenticado', [], 401);
    }
    */
    
    // Obter ID
    if (!isset($_GET['id'])) {
        responderErro('ID do restaurante é obrigatório', [], 400);
    }
    
    $id = intval($_GET['id']);
    $user_id_teste = 1;
    
    // Deletar
    $resultado = $restaurant->deletar($id, $user_id_teste);
    
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