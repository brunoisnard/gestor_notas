<?php
require 'db.php';

try {
    // Selecionando o novo campo tecnico_responsavel
    $stmt = $pdo->query("SELECT id, numero_nota, fornecedor, valor, data_emissao, data_vencimento, numero_lancamento, numero_pedido, tecnico_responsavel, status FROM notas_fiscais ORDER BY data_vencimento ASC");
    $notas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($notas);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao buscar notas: ' . $e->getMessage()]);
}
?>