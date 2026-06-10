<?php

header("Content-Type: application/json");

include "conexao.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = $data["email"];
$senha = $data["password"];

// Verifica se existe algum administrador
$result = $conn->query("SELECT COUNT(*) as total FROM administradores");

$row = $result->fetch_assoc();

if ($row["total"] == 0) {
    echo json_encode([
        "success" => false,
        "status" => "admin_not_registered"
    ]);
    exit;
}

$sql = "SELECT * FROM administradores WHERE email = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Email não encontrado"
    ]);
    exit;
}

$admin = $result->fetch_assoc();

if (!password_verify($senha, $admin["senha"])) {
    echo json_encode([
        "success" => false,
        "message" => "Senha incorreta"
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "role" => "admin"
]);