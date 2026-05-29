<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('tcc_autores', function (Blueprint $table) {
            $table->integer('idTcc');
            $table->integer('idAluno');
            
            $table->primary(['idTcc', 'idAluno']);
            
            $table->foreign('idTcc')->references('idTcc')->on('tccs')->onDelete('cascade');
            $table->foreign('idAluno')->references('idAluno')->on('alunos')->onDelete('cascade');
        });
    }
    public function down(): void { Schema::dropIfExists('tcc_autores'); }
};