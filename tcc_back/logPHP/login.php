<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json"); 

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();
include_once "../config.php";
include_once "../user/functionLogRegist.php"; 

$dados = json_decode(file_get_contents("php://input"));

if (!empty($dados->numProcesso) && !empty($dados->senha)) {
    $numProcesso = $dados->numProcesso;
    $senhaInput = $dados->senha;

    // IMPORTANTE: Adicionei 'tentativasFalhas' no SELECT
    $query = "SELECT idUtilizador, nome, senha, tentativasFalhas FROM utilizadores WHERE numProcesso = ? LIMIT 1";
    $stmt = mysqli_prepare($connection, $query);
    mysqli_stmt_bind_param($stmt, "s", $numProcesso);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $user = mysqli_fetch_assoc($result);

    if ($user) {
        // 1. Verificar senha...
        if (password_verify($senhaInput, $user['senha'])) { 
            // -- SENHA CORRECTA ---

            // Verificar falhas acumuladas...
           $tentativas = $user['tentativasFalhas'];

    if ($tentativas > 0) {
        // Registar a falha primeiro...
        registrarLogAcesso(
            $connection, 
            $user['idUtilizador'], 
            'loginFalha', 
            "Tentativa de login falhada {$tentativas}x"
        );
        // Pequena pausa de 1s ...
        sleep(1); 
    }

    // registar o Sucesso...
    registrarLogAcesso(
        $connection, 
        $user['idUtilizador'], 
        'loginSucesso', 
        'Login efectuado com sucesso'
    );

            // resetar o contador de falhas para 0 ...
            $sqlReset = "UPDATE utilizadores SET tentativasFalhas = 0 WHERE idUtilizador = ?";
            $stmtReset = mysqli_prepare($connection, $sqlReset);
            mysqli_stmt_bind_param($stmtReset, "i", $user['idUtilizador']);
            mysqli_stmt_execute($stmtReset);

            echo json_encode([
                "success" => true,
                "id" => $user['idUtilizador'],
                "nome" => $user['nome']
            ]);

        } else {
            // --- FALHA: Senha incorreta ---

            $sqlIncrement = "UPDATE utilizadores SET tentativasFalhas = tentativasFalhas + 1 WHERE idUtilizador = ?";
            $stmtInc = mysqli_prepare($connection, $sqlIncrement);
            mysqli_stmt_bind_param($stmtInc, "i", $user['idUtilizador']);
            mysqli_stmt_execute($stmtInc);

            echo json_encode([
                "success" => false, 
                "error" => "Número de processo ou senha incorretos."
            ]);
        }
    } else {
        echo json_encode([
            "success" => false, 
            "error" => "Número de processo ou senha incorretos."
        ]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Preencha todos os campos."]);
}
?>