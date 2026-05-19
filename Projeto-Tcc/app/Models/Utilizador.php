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

    public $timestamps = false; // Como usa 'dataCriacao' em vez de created_at/updated_at
}