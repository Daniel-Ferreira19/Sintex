<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = $data["email"];
$senhaCriptografada = password_hash($data["password"], PASSWORD_DEFAULT);
$restaurante = $data["restaurant"]; 

// Verifica se o e-mail já existe
$sql = "SELECT id FROM administradores WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "status" => "admin_already_exists",
        "message" => "Este e-mail já está cadastrado."
    ]);
    exit;
}

// Insere no banco utilizando seus campos
$sql = "INSERT INTO administradores (nome, email, senha) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $restaurante, $email, $senhaCriptografada);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Administrador cadastrado com sucesso!"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erro ao salvar no banco de dados."
    ]);
}