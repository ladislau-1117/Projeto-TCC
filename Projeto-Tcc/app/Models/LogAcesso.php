<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogAcesso extends Model
{
    protected $table = 'logsacesso';
    protected $primaryKey = 'idLog';
    public $timestamps = false;

    protected $fillable = [
        'idUtilizador', 
        'tipoEvento', 
        'descricaoEvento', 
        'dataEvento'
    ];
}