<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "sintex";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Erro na conexão com o banco."]));
}