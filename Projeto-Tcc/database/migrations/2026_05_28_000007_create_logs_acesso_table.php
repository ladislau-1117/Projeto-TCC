<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('logsacesso', function (Blueprint $table) {
            $table->integer('idLog')->autoIncrement();
            $table->unsignedBigInteger('idUtilizador');
            $table->string('tipoEvento', 50);
            $table->text('descricaoEvento')->nullable();
            $table->timestamp('dataEvento')->useCurrent();

            $table->foreign('idUtilizador')->references('id')->on('users')->onDelete('cascade');
        });
    }
    public function down(): void { Schema::dropIfExists('logsacesso'); }
};