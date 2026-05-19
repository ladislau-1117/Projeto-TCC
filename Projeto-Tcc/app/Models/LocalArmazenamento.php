<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocalArmazenamento extends Model
{
    protected $table = 'locaisarmazenamento';
    protected $primaryKey = 'idLocal';
    public $timestamps = false;

    protected $fillable = ['blocoArquivo', 'estante', 'prateleira', 'compartimento'];
}