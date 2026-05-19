<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once("../config.php");

try {
    // Buscar todas as Áreas
    $resAreas = $connection->query("SELECT idArea, nomeArea FROM areas_formacao ORDER BY nomeArea");
    $areas = $resAreas->fetch_all(MYSQLI_ASSOC);

    // Buscar todos os Cursos
    $resCursos = $connection->query("SELECT idCurso, nome, area_id FROM cursos ORDER BY nome");
    $cursos = $resCursos->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        "areas" => $areas,
        "cursos" => $cursos
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["erro" => $e->getMessage()]);
}
?>