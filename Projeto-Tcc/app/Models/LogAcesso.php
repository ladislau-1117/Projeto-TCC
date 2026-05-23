<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogAcesso extends Model
{
    use HasFactory;

    protected $table = 'logsacesso';
    protected $primaryKey = 'idLog';
    public $timestamps = false;

    protected $fillable = [
        'idUtilizador',
        'tipoEvento',
        'descricaoEvento',
        'dataEvento'
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'idUtilizador');
    }
}