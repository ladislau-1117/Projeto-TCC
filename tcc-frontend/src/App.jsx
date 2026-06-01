import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/home';
import SearchPage from './pages/searchTCC/pesquisar';
import StatsData from "./pages/analiseAcademica/analiseAcademica";
import Layout from './components/Layout/layout';
import HistoricMov from './pages/historicMov/historicMov';
import RegisterTcc from './pages/RegisterTcc/registerTcc';
import LogsPage from './pages/RegistLogs/RegistAllLogs';
import GestaoUsuarios from './pages/GestaoUsuarios/gestaoUsuarios';

// Importar protetores de rota
import { ProtectedRoute, AdminRoute } from './ProtectedRoute'; 

function App() {
  return (
    <>
      <Toaster position="top-right"/>
      <Router>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />

          {/* BARREIRA 1: Só entra no Layout quem estiver LOGADO */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}> 
              {/* Rotas acessíveis por qualquer utilizador logado */}
              <Route path="/pages/home" element={<Home />} />
              <Route path="/pages/pesquisar" element={<SearchPage />} />
              <Route path="/pages/registerTcc" element={<RegisterTcc />} />
              <Route path="/pages/analiseAcademica" element={<StatsData />} />
              <Route path="/pages/historicMov" element={<HistoricMov />} />
              <Route path="/pages/registLog" element={<LogsPage />} />
              
              {/* BARREIRA 2: Só entra aqui quem for ADMIN */}
              <Route element={<AdminRoute />}>
                <Route path="/pages/gestaoUsuarios" element={<GestaoUsuarios />} />
              </Route>
            </Route>
          </Route>

        </Routes>
      </Router>
    </>
  );
}

export default App;