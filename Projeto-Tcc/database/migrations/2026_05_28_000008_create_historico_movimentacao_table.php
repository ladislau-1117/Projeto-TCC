<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('historicomovimentacao', function (Blueprint $table) {
            $table->integer('idMov')->autoIncrement();
            $table->integer('idTcc')->nullable();
            $table->unsignedBigInteger('idUtilizador');
            $table->timestamp('dataAcao')->useCurrent();
            $table->string('tipoAcao', 50);
            $table->string('tituloTcc', 255)->nullable();

            $table->foreign('idTcc')->references('idTcc')->on('tccs')->onDelete('set null');
            $table->foreign('idUtilizador')->references('id')->on('users')->onDelete('cascade');
        });
    }
    public function down(): void { Schema::dropIfExists('historicomovimentacao'); }
};