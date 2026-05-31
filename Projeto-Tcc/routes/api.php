<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TccController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AnaliseAcademicaController;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\API\PerfilController;



// Autenticação
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Dashboard 
Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
Route::get('/dashboard/graphs', [DashboardController::class, 'getGraphData']);
Route::get('/dashboard/history', [DashboardController::class, 'getHistory']);

// Curso
Route::get('/cursos', [CursoController::class, 'index']);
Route::post('/cursos', [CursoController::class, 'store']);
Route::get('/cursos/{id}', [CursoController::class, 'show']);
Route::put('/cursos/{id}', [CursoController::class, 'update']);
Route::delete('/cursos/{id}', [CursoController::class, 'delete']);

// Registo
Route::get('/tccs/form-data', [TccController::class, 'getFormData']);
Route::post('/tccs', [TccController::class, 'store']);


//Presquisa, ver, editar e apagar 
Route::get('/tccs', [TccController::class, 'index']);
Route::delete('/tccs/{id}', [TccController::class, 'delete']);
Route::get('/tccs/{id}', [TccController::class, 'show']);
Route::put('/tccs/{id}', [TccController::class, 'update']);


// Análise acadêmica
    //cards 
Route::get('/analise-academica/totalizadores', [AnaliseAcademicaController::class, 'obterTotalizadores']);
Route::get('/analise-academica/evolucao-ano', [AnaliseAcademicaController::class, 'evolucaoAno']);
Route::get('/analise-academica/top-orientadores', [AnaliseAcademicaController::class, 'topOrientadores']);
Route::get('/analise-academica/media-notas-ano', [AnaliseAcademicaController::class, 'obterMediaNotasAno']);
    //graficos e tabelas
Route::get('/analise-academica/orientadores-excelencia', [AnaliseAcademicaController::class, 'obterOrientadoresExcelencia']);
Route::get('/analise-academica/estatisticas-tipo', [AnaliseAcademicaController::class, 'obterEstatisticasTipoProjeto']);
Route::get('/analise-academica/media-notas-ano', [AnaliseAcademicaController::class, 'obterMediaNotasAno']);
Route::get('/analise-academica/orientadores-excelencia', [AnaliseAcademicaController::class, 'obterOrientadoresExcelencia']);
Route::get('/analise-academica/estatisticas-tipo', [AnaliseAcademicaController::class, 'obterEstatisticasTipoProjeto']);


//Log de Acesso
Route::post('/login', [AuthController::class, 'login']);
Route::get('/logs', [AuthController::class, 'obterLogs']);


//Ver e editar perfil
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/perfil', [PerfilController::class, 'show']);
    Route::put('/perfil', [PerfilController::class, 'update']);
});


