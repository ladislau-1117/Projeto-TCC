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




// Buscar um TCC específico para edição
    public function show($id)
    {
        try {
            // Puxa o TCC com as relações mapeadas exatamente como fizemos no index
            $tcc = Tcc::with(['curso.areaFormacao', 'autores', 'local'])->find($id);

            if (!$tcc) {
                return response()->json(["erro" => "Relatório não encontrado."], 404);
            }

            // Formata o JSON de retorno para o React receber os campos mastigados
            return response()->json([
            'idTcc' => $tcc->idTcc,
            'idLocal' => $tcc->idLocal,
            'titulo' => $tcc->titulo,
            'orientadorNome' => $tcc->orientadorNome,
            'anoDefesa' => $tcc->anoDefesa,
            'notaFinal' => $tcc->notaFinal,
            'idCurso' => $tcc->idCurso,
            'idArea' => $tcc->curso->area_id ?? null,
            
            'autores' => $tcc->autores->pluck('nome')->toArray(),
            
            'blocoArquivo' => $tcc->local->blocoArquivo ?? '',
            'estante' => $tcc->local->estante ?? '',
            'compartimento' => $tcc->local->compartimento ?? '',
            'prateleira' => $tcc->local->prateleira ?? ''
            ]);

        } catch (\Exception $e) {
            return response()->json([
                "erro" => "Erro ao carregar dados reais para edição: " . $e->getMessage()
            ], 500);
        }
    }

    // Salva as alterações feitas no Modal de Edição
    public function update(Request $request, $id)
    {
        try {
            return DB::transaction(function () use ($request, $id) {

                // 1. Atualizar a tabela TCCs
                $affectedRows = DB::table('tccs')->where('idTcc', $id)->update([
                    'titulo'         => $request->input('titulo'),
                    'orientadorNome' => $request->input('orientadorNome'),
                    'anoDefesa'      => $request->input('anoDefesa'),
                    'notaFinal'      => $request->input('notaFinal'),
                    'idCurso'        => $request->input('idCurso'),
                ]);

                // 2. Atualizar a tabela Locais de Armazenamento
                $idLocal = $request->input('idLocal');
                if ($idLocal) {
                    DB::table('locaisarmazenamento')->where('idLocal', $idLocal)->update([
                        'blocoArquivo'  => $request->input('blocoArquivo'),
                        'estante'       => $request->input('estante'),
                        'compartimento' => $request->input('compartimento'),
                        'prateleira'    => $request->input('prateleira'),
                    ]);
                }

                // Validar se algo foi realmente atualizado
                if ($affectedRows === 0) {
                    return response()->json([
                        'erro' => 'Nenhum registo foi atualizado.'
                    ], 400);
                }

                return response()->json([
                    'message' => 'Relatório atualizado com sucesso!'
                ], 200);
            });
        } catch (\Exception $e) {
            return response()->json([
                'erro' => 'Erro interno ao atualizar: ' . $e->getMessage()
            ], 500);
        }
    }
}