<?php

//função para guardar informação se usuário fez o login com sucesso ou se falhor...
//importante para o histórico de login...
function registrarLogAcesso($conexao, $idUtilizador, $tipoEvento, $descricaoEvento) {
    $sql = "INSERT INTO logsAcesso (idUtilizador, tipoEvento, descricaoEvento) VALUES (?, ?, ?)";
    $stmt = $conexao->prepare($sql);
    
    $stmt->bind_param("iss", $idUtilizador, $tipoEvento, $descricaoEvento);
    return $stmt->execute();
}
?>