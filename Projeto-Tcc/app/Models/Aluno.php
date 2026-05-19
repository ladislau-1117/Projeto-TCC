<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aluno extends Model
{
    protected $table = 'alunos'; 
    protected $primaryKey = 'idAluno'; 
    public $timestamps = false;

    protected $fillable = ['nome'];
    public function tccs()
    {
        return $this->belongsToMany(Tcc::class, 'tcc_autores', 'idAluno', 'idTcc');
    }
}