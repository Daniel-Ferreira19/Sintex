<?php
/**
 * ARQUIVO: config/db.php
 * PROPÓSITO: Conectar com o banco de dados MySQL
 * 
 * EXPLICAÇÃO:
 * Este arquivo configura a conexão com o MySQL e oferece
 * uma função para obter a conexão em qualquer lugar do projeto.
 * Ele usa PDO (PHP Data Objects) que é mais seguro que mysqli.
 */

// Credenciais do banco de dados
$DB_HOST = 'localhost';      // Servidor MySQL (localhost para XAMPP)
$DB_USER = 'root';           // Usuário MySQL (padrão XAMPP é root)
$DB_PASS = '';               // Senha (XAMPP não tem senha por padrão)
$DB_NAME = 'sintex_db';      // Nome do banco de dados

try {
    /**
     * PDO: PHP Data Objects
     * Biblioteca segura para se conectar ao banco de dados
     * 
     * DSN: Data Source Name
     * Formato: "mysql:host=localhost;dbname=nome_do_banco;charset=utf8mb4"
     */
    $pdo = new PDO(
        "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
        $DB_USER,
        $DB_PASS,
        [
            // Configurações de erro: lançar exceções
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            // Configuração: retornar dados como array associativo
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
    
    // Conexão bem-sucedida
    // echo "✓ Conectado ao banco de dados!";
    
} catch (PDOException $e) {
    /**
     * Se houver erro na conexão
     * PDOException é a classe de erro do PDO
     */
    echo "✗ Erro ao conectar: " . $e->getMessage();
    die(); // Encerrar script
}

// Função para obter a conexão em qualquer arquivo
function getDB() {
    global $pdo;
    return $pdo;
}
?>
