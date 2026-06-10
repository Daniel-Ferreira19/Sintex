<?php

header("Content-Type: application/json");

include "conexao.php";

$data = json_decode(file_get_contents("php://input"), true);

$nome = $data["nome"];
$email = $data["email"];
$senha = password_hash($data["senha"], PASSWORD_DEFAULT);

// Verifica se já existe
$sql = "SELECT id FROM administradores WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Email já cadastrado"
    ]);
    exit;
}

$sql = "INSERT INTO administradores(nome,email,senha)
VALUES(?,?,?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $nome, $email, $senha);

$stmt->execute();

echo json_encode([
    "success" => true,
    "message" => "Administrador cadastrado"
]);