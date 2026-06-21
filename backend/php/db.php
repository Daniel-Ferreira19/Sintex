<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "sintex_db"; // Altere de "sintex" para "sintex_db"

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Erro na conexão com o banco."]));
}
?>
