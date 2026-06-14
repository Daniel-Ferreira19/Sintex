<?php
// Permite que o React (que está em outra porta) converse com o PHP
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "db.php"; // Conecta com o MySQL

// Pega o texto puro enviado pelo React e transforma em um array do PHP
$data = json_decode(file_get_contents("php://input"), true);

$email = $data["email"];
$senhaDigitada = $data["password"];

// 1. Busca o usuário no banco de dados de forma segura
$stmt = $conn->prepare("SELECT * FROM administradores WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$resultado = $stmt->get_result();

// 2. Se não achar o e-mail, avisa o React
if ($resultado->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Email não encontrado!"]);
    exit;
}

$admin = $resultado->fetch_assoc();

// 3. Compara a senha digitada com a criptografada que está no banco
if (password_verify($senhaDigitada, $admin["senha"])) {
    echo json_encode(["success" => true, "message" => "Login bem-sucedido!"]);
} else {
    echo json_encode(["success" => false, "message" => "Senha incorreta!"]);
}