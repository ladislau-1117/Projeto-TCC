<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tcc;
use Illuminate\Support\Facades\DB;

class AnaliseAcademicaController extends Controller
{
    /**
     * Função Auxiliar para centralizar a aplicação de filtros condicionados
     */
    private function aplicarFiltrosDinamicos($query, Request $request, $ignorarAno = false)
    {
        $idCurso = $request->input('idCurso');
        $anoDefesa = $request->input('anoDefesa');
        $tipoTrabalho = $request->input('tipoTrabalho');

        // Filtro de Curso (Se não for "todos")
        if ($idCurso && $idCurso !== 'todos') {
            $query->where('tccs.idCurso', $idCurso);
        }

        // Filtro de Ano (Se não for "todos" e não estiver explicitamente ignorado)
        if (!$ignorarAno && $anoDefesa && $anoDefesa !== 'todos') {
            $query->where('tccs.anoDefesa', $anoDefesa);
        }

        // Filtro de Formato/Estrutura (Baseado na tabela tcc_autores)
        if ($tipoTrabalho && $tipoTrabalho !== 'todos') {
            if ($tipoTrabalho === 'individual') {
                $query->whereNotExists(function ($subquery) {
                    $subquery->select(DB::raw(1))
                        ->from('tcc_autores')
                        ->whereRaw('tcc_autores.idTcc = tccs.idTcc')
                        ->groupBy('tcc_autores.idTcc')
                        ->havingRaw('count(*) > 1');
                });
            } elseif ($tipoTrabalho === 'grupo') {
                $query->whereExists(function ($subquery) {
                    $subquery->select(DB::raw(1))
                        ->from('tcc_autores')
                        ->whereRaw('tcc_autores.idTcc = tccs.idTcc')
                        ->groupBy('tcc_autores.idTcc')
                        ->havingRaw('count(*) > 1');
                });
            }
        }

        return $query;
    }

    public function obterTotalizadores(Request $request)
    {
        try {
            // 1. Contagem total de TCCs catalogados com filtros aplicados
            $totalTccs = $this->aplicarFiltrosDinamicos(Tcc::query(), $request)->count();

            // 2. Média global das notas finais filtradas
            $mediaNotas = round($this->aplicarFiltrosDinamicos(Tcc::query(), $request)->avg('notaFinal'), 1) ?? 0;

            // 3. Descobrir o Curso Líder baseado no contexto filtrado
            $cursoLiderReg = $this->aplicarFiltrosDinamicos(
                DB::table('tccs')->join('cursos', 'tccs.idCurso', '=', 'cursos.idCurso'), 
                $request
            )
            ->select('cursos.nome', DB::raw('count(*) as total'))
            ->groupBy('cursos.idCurso', 'cursos.nome')
            ->orderBy('total', 'desc')
            ->first();

            $cursoLiderNome = $cursoLiderReg ? $cursoLiderReg->nome : 'Nenhum';

            // 4. Descobrir o Orientador Mais Ativo no contexto filtrado
            $orientadorAtivoReg = $this->aplicarFiltrosDinamicos(Tcc::query(), $request)
                ->select('orientadorNome', DB::raw('count(*) as total'))
                ->groupBy('orientadorNome')
                ->orderBy('total', 'desc')
                ->first();

            $orientadorNome = $orientadorAtivoReg ? $orientadorAtivoReg->orientadorNome : 'Nenhum';
            $orientadorTotal = $orientadorAtivoReg ? $orientadorAtivoReg->total : 0;

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

    public function evolucaoAno(Request $request)
    {
        try {
            // REGRA: Ignora o filtro de ano para manter a linha do tempo, mas reage a Curso e Tipo de Trabalho
            $query = Tcc::query();
            $query = $this->aplicarFiltrosDinamicos($query, $request, true);

            $dados = $query->select('anoDefesa as ano', DB::raw('count(*) as quantidade'))
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

    public function topOrientadores(Request $request)
    {
        try {
            $query = Tcc::query();
            $query = $this->aplicarFiltrosDinamicos($query, $request);

            $dados = $query->select('orientadorNome as nome', DB::raw('count(*) as quantidade'))
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

    public function obterOrientadoresExcelencia(Request $request)
    {
        try {
            $query = DB::table('tccs');
            $query = $this->aplicarFiltrosDinamicos($query, $request);

            $dados = $query->select(
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

    public function obterEstatisticasTipoProjeto(Request $request)
    {
        try {
        $baseQuery = DB::table('tccs');
        
        // AJUSTE AQUI: Aplicamos curso e ano normalmente, mas limpamos o tipoTrabalho da Query String apenas para este gráfico
        $requestParaGrafico = clone $request;
        $requestParaGrafico->merge(['tipoTrabalho' => 'todos']); 

        $baseQuery = $this->aplicarFiltrosDinamicos($baseQuery, $requestParaGrafico);

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
                $coletivoTotalAlunos += $numAlunos;
            } else {
                $individualContagem++;
                $individualSomaNotas += $tcc->notaFinal;
                $individualTotalAlunos += 1;
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
            return response()->json(['erro' => 'Erro Tipo Projeto: ' . $e->getMessage()], 200);
        }
    }
}