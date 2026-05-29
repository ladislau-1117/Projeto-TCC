<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Curso;

class CursoController extends Controller
{
    public function index()
    {
        try {
            $cursos = Curso::orderBy('nome')->get(['idCurso', 'nome']);
            return response()->json($cursos, 200);
        } catch (\Exception $e) {
            return response()->json([
                'erro' => 'Erro ao buscar cursos: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $curso = Curso::create([
                'nome' => $request->input('nome')
            ]);

            return response()->json([
                'message' => 'Curso criado com sucesso!',
                'curso' => $curso
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'erro' => 'Erro ao criar curso: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $curso = Curso::findOrFail($id);
            return response()->json($curso, 200);
        } catch (\Exception $e) {
            return response()->json([
                'erro' => 'Curso não encontrado'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $curso = Curso::findOrFail($id);
            $curso->update([
                'nome' => $request->input('nome')
            ]);

            return response()->json([
                'message' => 'Curso atualizado com sucesso!',
                'curso' => $curso
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'erro' => 'Erro ao atualizar curso: ' . $e->getMessage()
            ], 500);
        }
    }

    public function delete($id)
    {
        try {
            $curso = Curso::findOrFail($id);
            $curso->delete();

            return response()->json([
                'message' => 'Curso deletado com sucesso!'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'erro' => 'Erro ao deletar curso: ' . $e->getMessage()
            ], 500);
        }
    }
}
