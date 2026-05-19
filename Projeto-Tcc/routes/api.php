<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TccController;
use App\Http\Controllers\DashboardController;

// Autenticação
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Dashboard 
Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
Route::get('/dashboard/graphs', [DashboardController::class, 'getGraphData']);
Route::get('/dashboard/history', [DashboardController::class, 'getHistory']);

// Registo
Route::get('/tccs/form-data', [TccController::class, 'getFormData']);
Route::post('/tccs', [TccController::class, 'store']);

//Presquisa, ver, editar e apagar relatorios
Route::get('/tccs', [TccController::class, 'index']);
Route::delete('/tccs/{id}', [TccController::class, 'delete']);
Route::get('/tccs/{id}', [TccController::class, 'show']);
Route::put('/tccs/{id}', [TccController::class, 'update']);





