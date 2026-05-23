<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tcc;
use Illuminate\Support\Facades\DB;

class AnaliseAcademicaController extends Controller
{
    public function obterTotalizadores()
    {
        try {
            // 1. Contagem total de TCCs catalogados
            $totalTccs = Tcc::count();

            // 2. Média global das notas finais arredondada para 1 casa decimal
            $mediaNotas = round(Tcc::avg('notaFinal'), 1) ?? 0;

            // 3. Descobrir o Curso Líder (o idCurso que mais aparece na tabela tccs)
            $cursoLiderReg = DB::table('tccs')
                ->join('cursos', 'tccs.idCurso', '=', 'cursos.idCurso')
                ->select('cursos.nome', DB::raw('count(*) as total'))
                ->groupBy('cursos.idCurso', 'cursos.nome')
                ->orderBy('total', 'desc')
                ->first();

            $cursoLiderNome = $cursoLiderReg ? $cursoLiderReg->nome : 'Nenhum';

            // 4. Descobrir o Orientador Mais Ativo (o nome que mais se repete)
            $orientadorAtivoReg = Tcc::select('orientadorNome', DB::raw('count(*) as total'))
                ->groupBy('orientadorNome')
                ->orderBy('total', 'desc')
                ->first();

            $orientadorNome = $orientadorAtivoReg ? $orientadorAtivoReg->orientadorNome : 'Nenhum';
            $orientadorTotal = $orientadorAtivoReg ? $orientadorAtivoReg->total : 0;

            // Retorna tudo mastigado num JSON limpo para o React
            return response()->json([
                'totalTccs' => $totalTccs,
                'mediaNotas' => $mediaNotas,
                'cursoLider' => $cursoLiderNome,
                'orientadorMaisAtivo' => [
                    'nome' => $orientadorNome,
                    'quantidade' => $orientadorTotal
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'erro' => 'Erro ao processar indicadores académicos: ' . $e->getMessage()
            ], 500);
        }
    }

    public function evolucaoAno()
    {
        try {
            $dados = Tcc::select('anoDefesa as ano', DB::raw('count(*) as quantidade'))
                ->groupBy('anoDefesa')
                ->orderBy('anoDefesa', 'asc')
                ->get();

            return response()->json($dados, 200);

        } catch (\Exception $e) {
            return response()->json([
                'erro' => 'Erro ao processar evolução por ano: ' . $e->getMessage()
            ], 500);
        }
    }

    public function topOrientadores()
    {
        try {
            $dados = Tcc::select('orientadorNome as nome', DB::raw('count(*) as quantidade'))
                ->groupBy('orientadorNome')
                ->orderBy('quantidade', 'desc')
                ->limit(5)
                ->get();

            return response()->json($dados, 200);

        } catch (\Exception $e) {
            return response()->json([
                'erro' => 'Erro ao processar top orientadores: ' . $e->getMessage()
            ], 500);
        }
    }




    // 3. Média de Notas Anuais (Já preparado para filtros futuros)
    public function obterMediaNotasAno(Request $request)
    {
        try {
            $idCurso = $request->input('idCurso');

            $dados = DB::table('tccs')
                // PREPARADO: Se futuramente enviares idCurso no filtro, ele filtra aqui automaticamente
                ->when($idCurso, function ($query, $idCurso) {
                    return $query->where('idCurso', $idCurso);
                })
                ->select(DB::raw('anoDefesa as ano'), DB::raw('round(avg(notaFinal), 1) as media'))
                ->groupBy('anoDefesa')
                ->orderBy('anoDefesa', 'asc')
                ->get();

            return response()->json($dados, 200);
        } catch (\Exception $e) {
            return response()->json(['erro' => 'Erro Média Notas Ano: ' . $e->getMessage()], 500);
        }
    }

    // 4. Top Orientadores por Média de Notas (Já preparado para filtros futuros)
    public function obterOrientadoresExcelencia(Request $request)
    {
        try {
            $idCurso = $request->input('idCurso');
            $anoDefesa = $request->input('anoDefesa');

            $dados = DB::table('tccs')
                // PREPARADO: Filtros condicionais para o futuro
                ->when($idCurso, function ($query, $idCurso) {
                    return $query->where('idCurso', $idCurso);
                })
                ->when($anoDefesa, function ($query, $anoDefesa) {
                    return $query->where('anoDefesa', $anoDefesa);
                })
                ->select(
                    'orientadorNome as nome', 
                    DB::raw('count(*) as totalTrabalhos'), 
                    DB::raw('round(avg(notaFinal), 1) as mediaNotas')
                )
                ->groupBy('orientadorNome')
                ->orderBy('mediaNotas', 'desc')
                ->limit(5)
                ->get();

            return response()->json($dados, 200);
        } catch (\Exception $e) {
            return response()->json(['erro' => 'Erro Orientadores Excelência: ' . $e->getMessage()], 500);
        }
    }



    // 5. Estatísticas de Trabalhos Individuais vs Coletivos (Apontando para tcc_autores)
    // 5. Estatísticas de Trabalhos Individuais vs Coletivos (Com Contagem de Alunos Real)
    public function obterEstatisticasTipoProjeto(Request $request)
    {
        try {
            $idCurso = $request->input('idCurso');
            $anoDefesa = $request->input('anoDefesa');

            $baseQuery = DB::table('tccs')
                ->when($idCurso, function ($query, $idCurso) {
                    return $query->where('tccs.idCurso', $idCurso);
                })
                ->when($anoDefesa, function ($query, $anoDefesa) {
                    return $query->where('tccs.anoDefesa', $anoDefesa);
                });

            $tccsComContagemAlunos = DB::table('tcc_autores')
                ->select('idTcc', DB::raw('count(*) as totalAlunos'))
                ->groupBy('idTcc')
                ->get()
                ->keyBy('idTcc');

            $tccsFiltrados = $baseQuery->get();

            $individualContagem = 0;
            $individualSomaNotas = 0;
            $individualTotalAlunos = 0;
            
            $coletivoContagem = 0;
            $coletivoSomaNotas = 0;
            $coletivoTotalAlunos = 0;

            foreach ($tccsFiltrados as $tcc) {
                $numAlunos = isset($tccsComContagemAlunos[$tcc->idTcc]) ? $tccsComContagemAlunos[$tcc->idTcc]->totalAlunos : 1;

                if ($numAlunos > 1) {
                    $coletivoContagem++;
                    $coletivoSomaNotas += $tcc->notaFinal;
                    $coletivoTotalAlunos += $numAlunos; // Soma o total de alunos em grupos
                } else {
                    $individualContagem++;
                    $individualSomaNotas += $tcc->notaFinal;
                    $individualTotalAlunos += 1; // Cada projeto individual tem 1 aluno
                }
            }

            $mediaIndividual = $individualContagem > 0 ? round($individualSomaNotas / $individualContagem, 1) : 0;
            $mediaColetivo = $coletivoContagem > 0 ? round($coletivoSomaNotas / $coletivoContagem, 1) : 0;

            return response()->json([
                'grafico' => [
                    ['name' => 'Individual', 'value' => $individualContagem],
                    ['name' => 'Coletivo', 'value' => $coletivoContagem]
                ],
                'tabela' => [
                    [
                        'tipo' => 'Individual (1 Aluno)',
                        'quantidade' => $individualContagem,
                        'media' => $mediaIndividual,
                        'alunosEnvolvidos' => $individualTotalAlunos
                    ],
                    [
                        'tipo' => 'Coletivo (Grupo)',
                        'quantidade' => $coletivoContagem,
                        'media' => $mediaColetivo,
                        'alunosEnvolvidos' => $coletivoTotalAlunos
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['erro' => 'Erro Tipo Projeto: ' . $e->getMessage()], 500);
        }
    }
}