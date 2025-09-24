<?php
header('Content-Type: application/json');

$host = 'localhost';
$db_name = 'gestao_financeira';
$username = 'root';
$password = ''; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['status' => 'error', 'message' => 'Falha na conexão com o banco de dados: ' . $e->getMessage()]));
}
?>