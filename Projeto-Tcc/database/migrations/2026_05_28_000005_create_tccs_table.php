<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('tccs', function (Blueprint $table) {
            $table->integer('idTcc')->autoIncrement();
            $table->string('titulo', 255);
            $table->string('tipo_projeto', 50)->nullable();
            $table->string('orientadorNome', 100)->nullable();
            $table->integer('anoDefesa');
            $table->enum('statusAprovacao', ['Aprovado', 'Reprovado'])->default('Aprovado');
            $table->integer('notaFinal')->nullable();
            $table->integer('idCurso');
            $table->integer('idLocal');
            $table->dateTime('dataHora')->nullable();

            // Chaves Estrangeiras
            $table->foreign('idCurso')->references('idCurso')->on('cursos')->onDelete('cascade');
            $table->foreign('idLocal')->references('idLocal')->on('locaisarmazenamento');
        });
    }
    public function down(): void { Schema::dropIfExists('tccs'); }
};