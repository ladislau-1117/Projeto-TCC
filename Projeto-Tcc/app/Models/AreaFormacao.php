<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AreaFormacao extends Model
{
    protected $table = 'areas_formacao'; 
    protected $primaryKey = 'idArea';
    public $timestamps = false;
}