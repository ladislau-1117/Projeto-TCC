<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once("../config.php");

$limite = 10; 
$pagina = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$offset = ($pagina - 1) * $limite;
$busca = isset($_GET['query']) ? "%" . $_GET['query'] . "%" : "%%";

try {
    // query para Contar total de resultados 
    $sqlContar = "SELECT COUNT(DISTINCT t.idTcc) as total 
                  FROM tccs t
                  LEFT JOIN cursos c ON t.idCurso = c.idCurso
                  LEFT JOIN areas_formacao af ON c.area_id = af.idArea
                  LEFT JOIN tcc_autores ta ON t.idTcc = ta.idTcc
                  LEFT JOIN alunos al ON ta.idAluno = al.idAluno
                  WHERE t.titulo LIKE ? OR c.nome LIKE ? OR al.nome LIKE ? OR af.nomeArea LIKE ?";
    
    $stmtTotal = $connection->prepare($sqlContar);
    $stmtTotal->bind_param("ssss", $busca, $busca, $busca, $busca);
    $stmtTotal->execute();
    $totalRegistos = $stmtTotal->get_result()->fetch_assoc()['total'];
    $totalPaginas = ceil($totalRegistos / $limite);

    // Query para a paginação
    $sql = "SELECT 
                t.idTcc, t.idLocal, t.titulo, t.orientadorNome, t.anoDefesa, 
                t.statusAprovacao, t.notaFinal,
                c.nome AS curso, 
                af.nomeArea AS areaFormacao, 
                l.blocoArquivo, l.estante, l.prateleira, l.compartimento,
                GROUP_CONCAT(DISTINCT al.nome SEPARATOR ', ') AS autores
            FROM tccs t
            LEFT JOIN cursos c ON t.idCurso = c.idCurso
            LEFT JOIN areas_formacao af ON c.area_id = af.idArea
            LEFT JOIN locaisarmazenamento l ON t.idLocal = l.idLocal
            LEFT JOIN tcc_autores ta ON t.idTcc = ta.idTcc
            LEFT JOIN alunos al ON ta.idAluno = al.idAluno
            WHERE t.titulo LIKE ? OR c.nome LIKE ? OR al.nome LIKE ? OR af.nomeArea LIKE ?
            GROUP BY t.idTcc
            ORDER BY t.anoDefesa DESC
            LIMIT ? OFFSET ?";

    $stmt = $connection->prepare($sql);
    $stmt->bind_param("ssssii", $busca, $busca, $busca, $busca, $limite, $offset);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $tccs = [];
    while ($row = $result->fetch_assoc()) {
        $tccs[] = $row;
    }

    echo json_encode([
        "tccs" => $tccs,
        "totalPaginas" => $totalPaginas,
        "totalRegistos" => $totalRegistos,
        "paginaAtual" => $pagina
    ]);

} catch (Exception $e) {
    echo json_encode(["erro" => $e->getMessage()]);
}
?>


