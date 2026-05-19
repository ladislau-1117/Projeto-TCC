<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

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

    public function login(Request $request){
        $credentials = $request->validate([
            'numProcesso' => 'required|string',
            'password' => 'required|string',
        ]);

        // Tenta encontrar o utilizador pelo número de processo
        $user = User::where('numProcesso', $credentials['numProcesso'])->first();

        // Verifica se o utilizador existe e se a senha está correta
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Número de processo ou senha incorretos.'
            ], 401);
        }

        // Por agora, vamos retornar os dados do utilizador
        // No futuro, podemos gerar um Token aqui
        return response()->json([
            'message' => 'Login efetuado com sucesso!',
            'user' => $user
        ], 200);
    }
}




