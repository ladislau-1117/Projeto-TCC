<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('locaisarmazenamento', function (Blueprint $table) {
            $table->integer('idLocal')->autoIncrement();
            $table->string('blocoArquivo', 50);
            $table->string('estante', 20);
            $table->string('prateleira', 20);
            $table->string('compartimento', 50)->nullable();
        });
    }
    public function down(): void { Schema::dropIfExists('locaisarmazenamento'); }
};