<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CargaMassaTccSeeder extends Seeder
{
    public function run()
    {
        // 1. Listas para gerar nomes realistas (Máximo 4 nomes por aluno)
        $nomesFemininos = ['Analtina', 'Dorivalda', 'Esperança', 'Fátima', 'Ginga', 'Irina', 'Janeth', 'Kiara', 'Lurdes', 'Marisa', 'Nair', 'Ondina', 'Patrícia', 'Rosa', 'Sílvia', 'Tânia', 'Yara', 'Zulmira'];
        $nomesMasculinos = ['António', 'Bernardo', 'Carlos', 'Domingos', 'Edmilson', 'Fernando', 'Gelson', 'Hélder', 'Inácio', 'João', 'Ladislau', 'Manuel', 'Nuno', 'Osvaldo', 'Pedro', 'Ricardo', 'Sampaio', 'Tito'];
        $apelidosFamilia = ['Antunes', 'Bango', 'Canga', 'Domingos', 'Ebo', 'Fonseca', 'Galiano', 'Henriques', 'Inácio', 'Jorge', 'Lemos', 'Manuel', 'Neto', 'Oliveira', 'Pedro', 'Quisanga', 'Rocha', 'Santos', 'Silva', 'Vaz'];

        // 2. Buscar os IDs dos cursos reais que tens no banco de dados
        // Ajusta as strings abaixo se os nomes exatos no teu banco forem ligeiramente diferentes
        $idInformatica = DB::table('cursos')->where('nome', 'like', '%Informática%')->value('idCurso') 
            ?? DB::table('cursos')->where('nome', 'like', '%Informática%')->value('id') ?? 1;
            
        $idGestao = DB::table('cursos')->where('nome', 'like', '%Gestão%')->value('idCurso') 
            ?? DB::table('cursos')->where('nome', 'like', '%Gestão%')->value('id') ?? 2;

        $cursosDisponiveis = [$idInformatica, $idGestao];

        // 3. Buscar IDs de Orientadores existentes para vincular nos TCCs
        $orientadoresIds = DB::table('orientadores')->pluck('idOrientador')->toArray();
        if (empty($orientadoresIds)) {
            $orientadoresIds = DB::table('orientadores')->pluck('id')->toArray();
        }
        // Se não houver orientadores no banco, criamos 5 fictícios para o teste não quebrar
        if (empty($orientadoresIds)) {
            for ($i = 1; $i <= 5; $i++) {
                $orientadoresIds[] = DB::table('orientadores')->insertGetId([
                    'nome' => 'Prof. ' . $nomesMasculinos[array_rand($nomesMasculinos)] . ' ' . $apelidosFamilia[array_rand($apelidosFamilia)],
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }

        // 4. Laço para criar os 1000 registos de TCCs
        $totalRegistos = 1000;
        
        for ($i = 0; $i < $totalRegistos; $i++) {
            
            // Definição aleatória do ano (2010 a 2025)
            $anoDefesa = rand(2010, 2025);
            
            // Nota realista de TCC (entre 10 e 19 valores)
            $notaFinal = rand(10, 19);
            
            // Curso aleatório entre os dois
            $idCursoSelecionado = $cursosDisponiveis[array_rand($cursosDisponiveis)];
            
            // Orientador aleatório
            $idOrientadorSelecionado = $orientadoresIds[array_rand($orientadoresIds)];

            // Tipo de trabalho: Vamos colocar 75% de chance de ser Individual e 25% em Grupo
            // Isso cria uma proporção interessante e realista no teu gráfico Donut
            $eGrupo = (rand(1, 100) > 75); 
            $qtdAlunos = $eGrupo ? rand(2, 4) : 1;

            // Gerar um título fictício para o projeto baseado no curso
            $prefixoTitulo = $idCursoSelecionado == $idInformatica 
                ? ['Sistema de ', 'Desenvolvimento de ', 'Plataforma para ', 'Aplicação Web de ']
                : ['Portal de Gestão de ', 'Otimização de Sistemas de ', 'Software de Auditoria para ', 'Algoritmo de Controlo de '];
            
            $sufixoTitulo = ['Acervo Escolar', 'Recursos Humanos', 'Bibliotecas Digitais', 'Estatísticas Académicas', 'Processos Hospitalares', 'Inscrições Online'];
            $tituloTcc = $prefixoTitulo[array_rand($prefixoTitulo)] . $sufixoTitulo[array_rand($sufixoTitulo)] . " V" . rand(1, 9);

            // Inserir o TCC principal
            $idTcc = DB::table('tccs')->insertGetId([
                'titulo' => $tituloTcc,
                'resumo' => 'Resumo simulado para o projeto académico intitulado ' . $tituloTcc,
                'notaFinal' => $notaFinal,
                'anoDefesa' => $anoDefesa,
                'idCurso' => $idCursoSelecionado,
                'idOrientador' => $idOrientadorSelecionado,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            // Gerar os alunos e vinculá-los ao TCC através da tabela 'tcc_autores'
            for ($j = 0; $j < $qtdAlunos; $j++) {
                
                // Montar nome aleatório com até 4 termos
                $genero = rand(0, 1);
                $promeiroNome = $genero === 0 ? $nomesFemininos[array_rand($nomesFemininos)] : $nomesMasculinos[array_rand($nomesMasculinos)];
                $nomeMeio = $nomesMasculinos[array_rand($nomesMasculinos)];
                $sobrenome1 = $apelidosFamilia[array_rand($apelidosFamilia)];
                $sobrenome2 = $apelidosFamilia[array_rand($apelidosFamilia)];
                
                // Evitar nomes duplicados seguidos no mesmo aluno
                if ($sobrenome1 === $sobrenome2) { $sobrenome2 = $apelidosFamilia[(array_search($sobrenome2, $apelidosFamilia) + 1) % count($apelidosFamilia)]; }
                
                $nomeCompletoAlunos = "{$promeiroNome} {$nomeMeio} {$sobrenome1} {$sobrenome2}";

                // Inserir na tabela de alunos
                $idAluno = DB::table('alunos')->insertGetId([
                    'nome' => $nomeCompletoAlunos,
                    'numProcesso' => rand(10000, 99999) . $anoDefesa, // Número de processo simulado
                    'idCurso' => $idCursoSelecionado,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                // Vincular na tabela pivô/relação de autores
                DB::table('tcc_autores')->insert([
                    'idTcc' => $idTcc,
                    'idAluno' => $idAluno,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }

        $this->command->info("Sucesso! 1000 TCCs e os seus respetivos autores foram gerados com dados angolanos realistas.");
    }
}