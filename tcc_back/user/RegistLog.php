<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once("../config.php");

$sql = "SELECT 
            l.idLog, 
            l.tipoEvento, 
            l.descricaoEvento, 
            l.dataEvento, 
            u.nome AS nome,
            (SELECT COUNT(*) 
             FROM logsAcesso l2 
             WHERE l2.idUtilizador = l.idUtilizador 
               AND l2.tipoEvento = 'loginFalha' 
               AND l2.idLog <= l.idLog) AS numTentativa
        FROM logsAcesso l 
        JOIN utilizadores u ON l.idUtilizador = u.idUtilizador 
        ORDER BY l.dataEvento DESC";

$result = $connection->query($sql);
$listaLogs = [];

while($row = $result->fetch_assoc()) {
    $listaLogs[] = $row;
}

echo json_encode($listaLogs);