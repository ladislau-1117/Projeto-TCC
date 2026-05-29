<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('cursos', function (Blueprint $table) {
            $table->integer('idCurso')->autoIncrement();
            $table->string('nome', 255);
            $table->integer('area_id')->nullable();
            
            // Relacionamento com Áreas de Formação
            $table->foreign('area_id')->references('idArea')->on('areas_formacao')->onDelete('set null');
        });
    }
    public function down(): void { Schema::dropIfExists('cursos'); }
};