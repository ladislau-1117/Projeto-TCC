<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\LogAcesso;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request){
        // Validação: e-mail e numero de processo são dados unicos
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'numProcesso' => 'required|string|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Criar do Usuário...
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'numProcesso' => $request->numProcesso,
            'password' => Hash::make($request->password),
        ]);

       
        return response()->json([
            'message' => 'Usuário registrado com sucesso!',
            'user' => $user
        ], 201);
    }




    //Login
    public function login(Request $request)
    {
        // 1. Validamos os campos exatos que vêm do teu ecrã React
        $request->validate([
            'num_processo' => 'required',
            'password' => 'required',
        ]);

        $numProcesso = $request->input('num_processo');

        // 2. Procuramos o utilizador na base de dados
        $user = User::where('numProcesso', $numProcesso)->first();

        // Se o utilizador existir, usamos o e-mail dele para o Throttle.
        // Se não existir, usamos o próprio número digitado + IP para ninguém burlar o limite.
        $identificadorChave = $user ? $user->email : $numProcesso;
        $throttleKey = Str::transliterate(strtolower($identificadorChave).'|'.$request->ip());

        // 3. Verificar se já estourou o limite de tentativas
        if (RateLimiter::tooManyAttempts($throttleKey, 3)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            return response()->json([
                'error' => "Muitas tentativas falhadas. Acesso bloqueado por segurança. Tente novamente em {$seconds} segundos."
            ], 429);
        }

        // 4. Se o utilizador não existe ou a senha está errada
        if (!$user || !Hash::check($request->input('password'), $user->password)) {
            // FALHA: Incrementa o bloqueio (janela de 2 minutos base)
            RateLimiter::hit($throttleKey, 120);

            if ($user) {
                $tentativas = RateLimiter::attempts($throttleKey);
                $descricao = "Tentativa de login falhada para o Processo {$numProcesso}.";

                if ($tentativas >= 3) {
                    $descricao .= " Limite de 3 tentativas atingido. Utilizador bloqueado temporariamente.";
                }

                LogAcesso::create([
                    'idUtilizador' => $user->id,
                    'tipoEvento' => 'loginFalha',
                    'descricaoEvento' => $descricao
                ]);
            }

            return response()->json([
                'error' => 'Nº de Processo ou Senha incorretos. Verifique os dados.'
            ], 401);
        }

        // SUCESSO: Limpa o histórico de erros do Cache
        RateLimiter::clear($throttleKey);

        // Grava o Log de Sucesso na base de dados
        LogAcesso::create([
            'idUtilizador' => $user->id,
            'tipoEvento' => 'loginSucesso',
            'descricaoEvento' => "Sessão iniciada com sucesso via Processo nº {$numProcesso}."
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['token' => $token, 'user' => $user], 200);
    }

    public function obterLogs(Request $request)
    {
        try {
            $page = $request->input('page', 1);
            $perPage = 10;

            $logs = LogAcesso::with('user')
                ->select('idLog', 'idUtilizador', 'tipoEvento', 'descricaoEvento', 'dataEvento')
                ->orderBy('dataEvento', 'desc')
                ->paginate($perPage, ['*'], 'page', $page);

            $dados = $logs->getCollection()->map(function($log) {
                return [
                    'idLog' => $log->idLog,
                    'nome' => $log->user ? $log->user->name : 'Utilizador Desconhecido',
                    'tipoEvento' => $log->tipoEvento,
                    'descricaoEvento' => $log->descricaoEvento,
                    'dataEvento' => $log->dataEvento
                ];
            });

            return response()->json([
                'logs' => $dados,
                'totalRegistos' => $logs->total(),
                'totalPaginas' => $logs->lastPage(),
                'paginaAtual' => $logs->currentPage()
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'erro' => 'Erro ao buscar logs: ' . $e->getMessage()
            ], 500);
        }
    }
}




