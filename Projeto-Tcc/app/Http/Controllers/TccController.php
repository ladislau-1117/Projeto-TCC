<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;
use App\Models\Tcc;
use App\Models\Aluno;
use App\Models\Curso;
use App\Models\LocalArmazenamento;
use App\Models\HistoricoMovimentacao;
use App\Models\AreaFormacao;




class TccController extends Controller
{

    public function getFormData(){
        try {
            $areas = AreaFormacao::orderBy('nomeArea')->get(['idArea', 'nomeArea']);
            $cursos = Curso::orderBy('nome')->get(['idCurso', 'nome', 'area_id']);

            return response()->json([
                "areas" => $areas,
                "cursos" => $cursos
            ]);
        } catch (\Exception $e) {
            return response()->json(["erro" => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        // Inicia uma transação para garantir que só guarda se tudo correr bem
        DB::beginTransaction();

        try {
            // 1. Criar o registo na tabela locaisarmazenamento com os dados vindos do React
            $local = LocalArmazenamento::create([
                'blocoArquivo'  => $request->andar,
                'estante'       => $request->sala,
                'compartimento' => $request->armario,
                'prateleira'    => $request->prateleira,
            ]);

            // 2. Criar o TCC vinculando o idLocal gerado automaticamente acima
            $tcc = Tcc::create([
                'titulo'          => $request->titulo,
                'tipo_projeto'    => $request->tipo_projeto,
                'orientadorNome'  => $request->orientadorNome,
                'anoDefesa'       => $request->anoDefesa,
                'statusAprovacao' => $request->statusAprovacao,
                'notaFinal'       => $request->notaFinal,
                'idCurso'         => $request->idCurso,
                'idLocal'         => $local->idLocal, // <--- ID DINÂMICO AQUI!
                'dataHora'        => now(), // ou o formato que usares
            ]);

            // 3. Lógica para associar os autores (tcc_autores)
            if ($request->has('autores')) {
                foreach ($request->autores as $nomeAutor) {
                    if (!empty($nomeAutor)) {
                        // Aqui assume-se que geras ou buscas o aluno pelo nome. 
                        // Se criares um aluno novo para o TCC:
                        $aluno = Aluno::create(['nome' => $nomeAutor]);
                        $tcc->autores()->attach($aluno->idAluno);
                    }
                }
            }

            DB::commit();

            return response()->json([
                "status" => "success",
                "message" => "Relatório e localização cadastrados com sucesso!"
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                "status" => "error",
                "erro" => "Erro ao cadastrar relatório: " . $e->getMessage()
            ], 500);
        }
    }


    //Para a pesquisa de relatórios...
    public function index(Request $request)
    {
        try {
            $busca = $request->query('query');

            $query = Tcc::with(['curso.areaFormacao', 'autores', 'local']);

            if (!empty($busca)) {
                $query->where(function ($q) use ($busca) {
                    $q->where('titulo', 'LIKE', "%{$busca}%")
                    ->orWhereHas('autores', function ($a) use ($busca) {
                        $a->where('nome', 'LIKE', "%{$busca}%");
                    });
                });
            }

            $tccsPaginados = $query->orderBy('anoDefesa', 'desc')->paginate(10);

            $tccsFormatados = collect($tccsPaginados->items())->map(function ($tcc) {
                $stringAutores = $tcc->autores->isNotEmpty() 
                    ? $tcc->autores->pluck('nome')->implode(', ') 
                    : "Sem autores associados";
                
                return [
                    'idTcc' => $tcc->idTcc,
                    'idLocal' => $tcc->idLocal,
                    'titulo' => $tcc->titulo,
                    'orientadorNome' => $tcc->orientadorNome ?? "Não informado",
                    'anoDefesa' => $tcc->anoDefesa,
                    'statusAprovacao' => $tcc->statusAprovacao,
                    'notaFinal' => $tcc->notaFinal,
                    'idCurso' => $tcc->idCurso,
                    'curso' => $tcc->curso->nome ?? "Curso não atribuído",
                    'autores' => $stringAutores,
                    'areaFormacao' => $tcc->curso->areaFormacao->nomeArea ?? "Não definida", 
                    'blocoArquivo' => $tcc->local->blocoArquivo ?? "---",
                    'estante' => $tcc->local->estante ?? "---",
                    'prateleira' => $tcc->local->prateleira ?? "---",
                    'compartimento' => $tcc->local->compartimento ?? "---"
                ];
            });

            return response()->json([
                "tccs" => $tccsFormatados,
                "totalPaginas" => $tccsPaginados->lastPage(),
                "totalRegistos" => $tccsPaginados->total(),
                "paginaAtual" => $tccsPaginados->currentPage()
            ]);

        } catch (\Exception $e) {
            return response()->json(["erro" => "Erro ao filtrar relatórios: " . $e->getMessage()], 500);
        }
    }


    //Deletar relatórios...
    public function delete (Request $request, $id)
    {
        try {
            return DB::transaction(function () use ($request, $id) {
                // Encontra o TCC ou falha se não existir
                $tcc = Tcc::findOrFail($id);
                $userId = $request->query('userId'); 

                // REGISTAR NO HISTÓRICO ANTES DE APAGAR 
                DB::table('historicomovimentacao')->insert([
                    'idUtilizador' => $userId, 
                    'dataAcao' => now(),
                    'tipoAcao' => 'Exclusão',
                    'tituloTcc' => $tcc->titulo,
                    'idTcc' => $tcc->idTcc 
                ]);

                // Remover os vínculos dos autores na tabela
                DB::table('tcc_autores')->where('idTcc', $id)->delete();

                // Apagar o TCC
                $tcc->delete();

                return response()->json(['message' => 'Relatório removido com sucesso!'], 200);
            });
        } catch (\Exception $e) {
            return response()->json(['erro' => 'Falha ao apagar: ' . $e->getMessage()], 500);
        }
    }




// 1. Busca os dados para preencher o formulário de edição
public function show($id)
{
    try {
        $tcc = DB::table('tccs as t')
            ->leftJoin('cursos as c', 't.idCurso', '=', 'c.idCurso')
            ->leftJoin('area_formacao as af', 'c.idArea', '=', 'af.idArea') 
            ->leftJoin('locaisarmazenamento as l', 't.idLocal', '=', 'l.idLocal')
            ->select(
                't.idTcc', 't.idLocal', 't.titulo', 't.orientadorNome', 't.anoDefesa',
                't.statusAprovacao', 't.notaFinal', 't.idCurso',
                'c.nome as curso_nome', 'af.nomeArea as area_nome',
                'l.blocoArquivo', 'l.estante', 'l.prateleira', 'l.compartimento'
            )
            ->where('t.idTcc', $id)
            ->first();

        if (!$tcc) {
            return response()->json(['erro' => 'Relatório não encontrado'], 404);
        }

        // Busca os autores vinculados
        $autores = DB::table('tcc_autores as ta')
            ->join('alunos as al', 'ta.idAluno', '=', 'al.idAluno')
            ->where('ta.idTcc', $id)
            ->select('al.idAluno', 'al.nome')
            ->get();

        return response()->json([
            'tcc' => $tcc,
            'autores' => $autores
        ]);

    } catch (\Exception $e) {
        return response()->json(['erro' => 'Erro ao carregar dados: ' . $e->getMessage()], 500);
    }
}

// Salva as alterações feitas no Modal de Edição
public function update(Request $request, $id)
{
    try {
        return DB::transaction(function () use ($request, $id) {
            
            // Atualiza os dados na tabela TCCs
            DB::table('tccs')->where('idTcc', $id)->update([
                'titulo' => $request->input('titulo'),
                'orientadorNome' => $request->input('orientadorNome'),
                'anoDefesa' => $request->input('anoDefesa'),
                'notaFinal' => $request->input('notaFinal'),
                'idCurso' => $request->input('idCurso'),
            ]);

            
            $idLocal = $request->input('idLocal');
            if ($idLocal) {
                DB::table('locaisarmazenamento')->where('idLocal', $idLocal)->update([
                    'blocoArquivo' => $request->input('blocoArquivo'),
                    'estante' => $request->input('estante'),
                    'prateleira' => $request->input('prateleira'),
                    'compartimento' => $request->input('compartimento'),
                ]);
            }

            return response()->json(['message' => 'Relatório atualizado com sucesso!']);
        });
    } catch (\Exception $e) {
        return response()->json(['erro' => 'Erro ao atualizar: ' . $e->getMessage()], 500);
    }
}
}