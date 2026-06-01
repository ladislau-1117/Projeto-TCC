<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Utilizador extends Authenticatable
{
    protected $table = 'utilizadores';
    protected $primaryKey = 'idUtilizador';
    
    // Informe ao Laravel que a coluna da senha chama-se 'senha'
    public function getAuthPassword() {
        return $this->senha;
    }

    protected $fillable = [
        'nome', 'email', 'senha', 'numProcesso', 'tentativasFalhas'
    ];

    protected $hidden = [
        'senha',
    ];

    public $timestamps = false;
    
    // buscar os logs do utilizador
    public function logs()
    {
        return $this->hasMany(LogAcesso::class, 'idUtilizador', 'idUtilizador');
    }

    // último login de sucesso
    public function ultimoLogin()
    {
        return $this->hasOne(LogAcesso::class, 'idUtilizador', 'idUtilizador')
                    ->where('tipoEvento', 'loginSucesso')
                    ->latest('dataEvento');
    }
}

