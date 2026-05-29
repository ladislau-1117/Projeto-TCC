<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class PerfilController extends Controller
{
    /**
     * Obter dados do utilizador autenticado.
     */
    public function show(Request $request)
    {
        // Retorna o utilizador logado via token (Sanctum/Passport)
        return response()->json([
            'sucesso' => true,
            'dados' => $request->user()
        ], 200);
    }

    /**
     * Atualizar Nome, E-mail e/ou Senha do utilizador.
     */
    public function update(Request $request)
    {
        $user = $request->user(); // Este já será uma instância de Utilizador

        $request->validate([
            'nome' => 'required|string|max:100',
            'email' => 'required|email|max:35|unique:utilizadores,email,' . $user->idUtilizador . ',idUtilizador',
            'senha' => 'nullable|string|min:8',
        ]);

        // Gravação correta nas colunas da tabela 'utilizadores'
        $user->nome = $request->nome;
        $user->email = $request->email;

        if ($request->filled('senha')) {
            $user->senha = \Illuminate\Support\Facades\Hash::make($request->senha);
        }

        $user->save();

        return response()->json([
            'sucesso' => true,
            'mensagem' => 'Perfil atualizado com sucesso!',
            'dados' => $user
        ], 200);
    }
}