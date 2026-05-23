<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('logs_acesso', function (Blueprint $table) {
            $table->id('idLog');
            
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('tipoEvento');
            $table->text('descricaoEvento');
            $table->string('ip_address', 45)->nullable(); 
            $table->timestamps(); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('logs_acesso');
    }
};