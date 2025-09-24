<?php
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['numero_nota']) || empty($data['fornecedor']) || empty($data['valor']) || empty($data['data_emissao']) || empty($data['data_vencimento'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Dados incompletos.']);
    exit;
}

// Incluindo o novo campo tecnico_responsavel
$sql = "INSERT INTO notas_fiscais (numero_nota, fornecedor, valor, data_emissao, data_vencimento, numero_lancamento, numero_pedido, tecnico_responsavel) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $data['numero_nota'],
        $data['fornecedor'],
        $data['valor'],
        $data['data_emissao'],
        $data['data_vencimento'],
        $data['numero_lancamento'],
        $data['numero_pedido'],
        $data['tecnico_responsavel'] // Adicionado aqui
    ]);
    echo json_encode(['success' => 'Nota fiscal registrada com sucesso!']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao registrar nota: ' . $e->getMessage()]);
}
?>