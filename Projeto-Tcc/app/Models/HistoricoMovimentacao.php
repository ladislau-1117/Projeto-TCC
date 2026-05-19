<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoricoMovimentacao extends Model
{
    protected $table = 'historicomovimentacao';
    protected $primaryKey = 'idMov'; // No dump está idMov, não idHistorico
    public $timestamps = false;
    protected $fillable = ['idTcc', 'idUtilizador', 'dataAcao', 'tipoAcao', 'tituloTcc'];
}