<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{
    protected $table = 'cursos';
    protected $primaryKey = 'idCurso';

    // Relação com a Área de Formação
    public function areaFormacao()
    {
        return $this->belongsTo(AreaFormacao::class, 'area_id', 'idArea');
    }
}