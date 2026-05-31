<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PerfilController extends Controller
{
    /**
     * Obter dados do utilizador autenticado.
     */
    public function show(Request $request)
    {
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
        $user = $request->user(); // Instância de Utilizador (vinculada à tabela 'users')

        // CORREÇÃO: Apontar a regra unique para a tabela 'users' e a PK correta
        $request->validate([
            'nome' => 'required|string|max:100',
            'email' => 'required|email|max:35|unique:users,email,' . $user->id . ',id',
            'senha' => 'nullable|string|min:8',
        ]);

        // Gravação nas colunas do teu banco (usando os nomes corretos)
        $user->name = $request->nome;
        $user->email = $request->email;

        if ($request->filled('senha')) {
            $user->password = Hash::make($request->senha);
        }

        $user->save();

        return response()->json([
            'sucesso' => true,
            'mensagem' => 'Dados atualizados com sucesso!',
            'dados' => [
                'idUtilizador' => $user->id,
                'name'         => $user->name,
                'email'        => $user->email,
                'numProcesso'  => $user->numProcesso
            ]
        ], 200);
    }
}