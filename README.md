# 🎓 Sistema de Gestão de Teses - TCC

Um sistema completo de gestão de trabalhos acadêmicos (TCC) desenvolvido com **Laravel 12** e **React 18**, permitindo submissão, análise e gerenciamento de teses de conclusão de curso.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow) ![Laravel](https://img.shields.io/badge/Laravel-12-orange) ![React](https://img.shields.io/badge/React-18-blue) ![PHP](https://img.shields.io/badge/PHP-8.2+-purple)

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API](#api)
- [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

O **Sistema de Gestão de Teses** é uma plataforma web que centraliza o processo de submissão, avaliação e acompanhamento de trabalhos acadêmicos. Oferece:

- ✅ Autenticação segura com tokens (Laravel Sanctum)
- ✅ Submissão e gerenciamento de teses
- ✅ Análise acadêmica com gráficos interativos
- ✅ Busca avançada com filtros
- ✅ Histórico de movimentações
- ✅ Logs de acesso para auditoria
- ✅ Interface responsiva e intuitiva

## 🛠 Tecnologias

### Backend
- **Laravel 12** - Framework PHP moderno
- **MySQL/MariaDB** - Banco de dados
- **Laravel Sanctum** - Autenticação por token
- **Eloquent ORM** - Acesso aos dados
- **PHPUnit** - Testes automatizados

### Frontend
- **React 18** - Biblioteca JavaScript
- **React Router v7** - Roteamento
- **Axios** - Cliente HTTP
- **Bootstrap 5** - Design responsivo
- **Recharts** - Gráficos interativos
- **React Hot Toast** - Notificações

### DevOps
- **XAMPP** - Ambiente local (Apache + MySQL)
- **npm** - Gerenciador de pacotes (frontend)
- **Composer** - Gerenciador de pacotes (backend)

## ✨ Funcionalidades

### 1. 🔐 Autenticação
- Login seguro com e-mail e senha
- Registro de novos usuários
- Bloqueio automático após tentativas falhas de login
- Logout com destruição de token

### 2. 📝 Gestão de Teses
- Submissão de novas teses
- Edição de teses existentes
- Visualização detalhada de informações
- Exclusão (com confirmação)
- Informações: título, descrição, aluno, curso, status

### 3. 🔍 Busca Avançada
- Busca por título, aluno ou descrição
- Filtros por curso
- Filtros por status
- Resultados em tempo real
- Paginação de resultados

### 4. 📊 Análise Acadêmica
- Dashboard com gráficos interativos
- Estatísticas por curso
- Distribuição de teses
- Indicadores de performance
- Visualização com Recharts

### 5. 📜 Histórico
- Registro de todas as movimentações
- Histórico de acessos (LogAcesso)
- Rastreamento de alterações
- Filtros e busca no histórico

### 6. 🔒 Segurança
- Autenticação por token (Sanctum)
- Validação de dados
- Rate limiting nas requisições
- Proteção CORS
- Logs de acesso para auditoria

## 🚀 Instalação

### Pré-requisitos
- PHP 8.2+
- MySQL/MariaDB 5.7+
- Node.js 16+
- Composer 2.0+
- XAMPP ou equivalente (Apache)

### Passo 1: Clonar o Repositório

```bash
git clone <seu-repositorio>
cd TCC_PROJETO
```

### Passo 2: Instalar Backend

```bash
cd Projeto-Tcc

# Instalar dependências PHP
composer install

# Configurar arquivo .env
cp .env.example .env

# Gerar chave da aplicação
php artisan key:generate

# Executar migrações do banco de dados
php artisan migrate

# (Opcional) Seed com dados de teste
php artisan db:seed
```

### Passo 3: Configurar Banco de Dados

Edite o arquivo `.env`:
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tcc_db
DB_USERNAME=root
DB_PASSWORD=
```

Crie o banco de dados:
```bash
mysql -u root -p
CREATE DATABASE tcc_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Passo 4: Instalar Frontend

```bash
cd ../tcc-frontend

# Instalar dependências Node
npm install
```

### Passo 5: Iniciar o Servidor

**Terminal 1 - Backend (Laravel):**
```bash
cd Projeto-Tcc
composer run dev
```

Este comando inicia:
- Servidor Laravel (porta 8000)
- Servidor de desenvolvimento Vite
- Monitoramento de filas
- Visualizador de logs

**Terminal 2 - Frontend (React):**
```bash
cd tcc-frontend
npm start
```

Acesse em seu navegador: **http://localhost:3000**

## 📖 Como Usar

### 1️⃣ Login
```
1. Acesse http://localhost:3000
2. Clique em "Login"
3. Use credenciais válidas ou crie nova conta
4. Após login, você será redirecionado para a Home
```

### 2️⃣ Submeter Uma Tese
```
1. Clique em "Registrar TCC" no menu
2. Preencha os dados:
   - Título do TCC
   - Descrição
   - Selecione o Aluno
   - Selecione o Curso
3. Clique em "Registrar"
4. Você receberá uma confirmação
```

### 3️⃣ Buscar Teses
```
1. Acesse "Pesquisar TCC"
2. Digite no campo de busca
3. Use filtros de Curso e Status
4. Clique no resultado para ver detalhes
```

### 4️⃣ Visualizar Análise Acadêmica
```
1. Acesse "Análise Acadêmica"
2. Veja gráficos de:
   - Distribuição por curso
   - Status de teses
   - Outras estatísticas
```

### 5️⃣ Verificar Histórico
```
1. Clique em "Histórico de Mov." para sua tese
2. Ou acesse "Logs de Acesso" para auditoria completa
3. Veja data, hora e tipo de operação
```

## 📁 Estrutura do Projeto

```
TCC_PROJETO/
├── Projeto-Tcc/                    # Backend Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/        # Endpoints da API
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── TccController.php
│   │   │   │   ├── UserController.php
│   │   │   │   └── ...
│   │   │   └── Middleware/
│   │   ├── Models/                 # Eloquent Models
│   │   │   ├── User.php
│   │   │   ├── Tcc.php
│   │   │   ├── Aluno.php
│   │   │   ├── Curso.php
│   │   │   └── LogAcesso.php
│   ├── database/
│   │   ├── migrations/             # Schema do banco
│   │   └── seeders/                # Dados de teste
│   ├── routes/
│   │   └── api.php                 # Definição de rotas
│   ├── storage/
│   │   └── logs/
│   │       └── laravel.log         # Logs da aplicação
│   └── .env                        # Configurações
│
├── tcc-frontend/                   # Frontend React
│   ├── src/
│   │   ├── pages/                  # Páginas principais
│   │   │   ├── Home/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── RegisterTcc/
│   │   │   ├── searchTCC/
│   │   │   ├── analiseAcademica/
│   │   │   ├── historicMov/
│   │   │   └── RegistAllLogs/
│   │   ├── components/             # Componentes reutilizáveis
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   ├── Modal/
│   │   │   ├── Search/
│   │   │   └── ...
│   │   ├── App.jsx                 # Componente raiz
│   │   └── index.js
│   ├── public/
│   └── package.json
│
└── README.md                       # Este arquivo
```

## 🔌 API

### Endpoints Principais

#### Autenticação
```
POST   /api/auth/register          - Registrar novo usuário
POST   /api/auth/login             - Fazer login
POST   /api/auth/logout            - Fazer logout
```

#### Teses
```
GET    /api/tcc                    - Listar todas as teses
POST   /api/tcc                    - Criar nova tese
GET    /api/tcc/{id}               - Buscar tese por ID
PUT    /api/tcc/{id}               - Atualizar tese
DELETE /api/tcc/{id}               - Deletar tese
```

#### Busca
```
GET    /api/tcc/search?q=termo     - Buscar teses
```

#### Análise
```
GET    /api/stats                  - Obter estatísticas
GET    /api/stats/courses          - Estatísticas por curso
```

#### Histórico
```
GET    /api/logs                   - Logs de acesso
GET    /api/tcc/{id}/history       - Histórico de tese
```

**Nota:** Todas as requisições requerem header:
```
Authorization: Bearer <token>
```

## 🐛 Troubleshooting

### Problema: Erro 500 ao fazer login

**Solução:**
1. Verifique se o banco de dados está running
2. Verifique se as migrações foram executadas:
   ```bash
   php artisan migrate:status
   ```
3. Verifique o arquivo `storage/logs/laravel.log`:
   ```bash
   tail -f storage/logs/laravel.log
   ```

### Problema: React não conecta ao backend (CORS error)

**Solução:**
1. Verifique se o backend está rodando (`composer run dev`)
2. Verifique arquivo `config/cors.php` no Laravel
3. Limpe cache do navegador (Ctrl+Shift+Del)

### Problema: Porta 3000 já em uso

**Solução:**
```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problema: `composer run dev` não funciona

**Solução:**
1. Verifique se o `composer.json` tem os scripts configurados
2. Execute comandos separadamente:
   ```bash
   php artisan serve              # Terminal 1
   npm run dev                    # Terminal 2
   php artisan queue:listen       # Terminal 3
   tail -f storage/logs/laravel.log # Terminal 4
   ```

## 📚 Comandos Úteis

### Backend
```bash
# Criar migration
php artisan make:migration create_table_name

# Criar model com migration
php artisan make:model ModelName -m

# Executar seeds
php artisan db:seed

# Resetar banco
php artisan migrate:reset

# Rodar testes
composer run test

# Tinker (shell interativo)
php artisan tinker
```

### Frontend
```bash
# Build para produção
npm run build

# Rodar testes
npm test

# Limpar cache
npm cache clean --force

# Atualizar dependências
npm update
```

## 📝 Licença

Este projeto é fornecido como é, para fins educacionais.

## 👥 Autores

- **Desenvolvedor Principal:** Ladislau Cabanga
- **Orientador(a):** Sampaio André

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a [Documentação de Debugging](./CLAUDE.md)
2. Consulte os logs: `storage/logs/laravel.log`
3. Abra uma issue no repositório

---

**Última atualização:** 25 de maio de 2026


