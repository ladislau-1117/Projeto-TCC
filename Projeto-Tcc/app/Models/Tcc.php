<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tcc extends Model
{
    protected $table = 'tccs';
    protected $primaryKey = 'idTcc';
    public $timestamps = false; // Ajusta para true se usares timestamps nesta tabela

    protected $fillable = [
        'titulo', 'tipo_projeto', 'orientadorNome', 'anoDefesa', 
        'statusAprovacao', 'notaFinal', 'idCurso', 'idLocal', 'dataHora'
    ];

    // 1. Relação com os Autores (Muitos para Muitos)
    public function autores()
    {
        return $this->belongsToMany(Aluno::class, 'tcc_autores', 'idTcc', 'idAluno');
    }

    // 2. Relação com o Curso (Um TCC pertence a um Curso)
    public function curso()
    {
        return $this->belongsTo(Curso::class, 'idCurso', 'idCurso');
    }

    public function local()
    {
        return $this->belongsTo(LocalArmazenamento::class, 'idLocal', 'idLocal');
    }
}