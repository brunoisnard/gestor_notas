<?php
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'ID da nota não fornecido.']);
    exit;
}

$sql = "UPDATE notas_fiscais SET status = 'Pago' WHERE id = ?";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$data['id']]);
    echo json_encode(['success' => 'Nota baixada com sucesso!']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao dar baixa na nota: ' . $e->getMessage()]);
}
?>