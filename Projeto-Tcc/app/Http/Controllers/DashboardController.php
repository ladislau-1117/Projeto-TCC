<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; 
class DashboardController extends Controller
{
    public function getStats(){
        // 1. Total de Relatórios
        $totalRelatorios = DB::table('tccs')->count();

        // 2. Cadastrados Este Ano
        $anoAtual = date('Y');
        $totalAno = DB::table('tccs')->where('anoDefesa', $anoAtual)->count();

        // 3. Curso Líder (maior volume de relatórios por curso)
        $cursoLiderReg = DB::table('tccs')
            ->join('cursos', 'tccs.idCurso', '=', 'cursos.idCurso')
            ->select('cursos.nome', DB::raw('count(*) as total'))
            ->groupBy('cursos.idCurso', 'cursos.nome')
            ->orderBy('total', 'desc')
            ->first();

        $cursoLider = $cursoLiderReg ? $cursoLiderReg->nome : 'Nenhum';

        return response()->json([
            'totalRelatorios' => $totalRelatorios,
            'totalAno' => $totalAno,
            'cursoLider' => $cursoLider
        ]);
    }

    public function getGraphData(){
        // 1. Gráfico de Barras 
        $barData = DB::table('tccs')
            ->select('anoDefesa as name', DB::raw('count(*) as total'))
            ->groupBy('anoDefesa')
            ->orderBy('anoDefesa', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => (string)$item->name,
                    'total' => (int)$item->total
                ];
            });

        // 2. Gráfico de Pizza
       $circleData = DB::table('tcc_autores')
            ->select('idTcc', DB::raw('count(*) as total_autores'))
            ->groupBy('idTcc')
            ->get();

        $individual = 0;
        $grupo = 0;

        foreach ($circleData as $tcc) {
            if ($tcc->total_autores > 1) {
                $grupo++;
            } else {
                $individual++;
            }
        }

        $circleData = [
            ['name' => 'Trabalhos Individuais', 'value' => $individual],
            ['name' => 'Trabalhos em Grupo', 'value' => $grupo]
        ];

        return response()->json([
            'barData' => $barData,
            'circleData' => $circleData
        ]);
    }

    public function getHistory(Request $request){
        $logs = DB::table('historicomovimentacao as h')
            ->leftJoin('users as u', 'h.idUtilizador', '=', 'u.id')
            ->select(
                'h.idMov',
                'h.dataAcao',
                'h.tipoAcao',
                'h.tituloTcc',
                'u.name as utilizadorNome'
            )
            ->orderBy('h.dataAcao', 'desc')
            ->paginate(10);

        return response()->json([
            "logs" => $logs->items(),
            "totalRegistos" => $logs->total(),
            "totalPaginas" => $logs->lastPage(),
            "paginaAtual" => $logs->currentPage()
        ]);
    }
}