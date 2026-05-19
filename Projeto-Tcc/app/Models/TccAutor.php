<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TccAutor extends Model
{
    protected $table = 'tcc_autores';
    public $timestamps = false;
    // Esta tabela usa chave primária composta
    protected $fillable = ['idTcc', 'idAluno'];
}