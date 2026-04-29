import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/home';
import SearchPage from './pages/searchTCC/pesquisar';
import StatsData from "./pages/statistics/statistics";
import Layout from './components/Layout/layout';
import HistoricMov from './pages/historicMov/historicMov'
import RegisterTcc from './pages/RegisterTcc/registerTcc';
import LogsPage from './pages/RegistLogs/RegistAllLogs';

function App() {
  return (
    <>
    <Toaster position="top-right"/>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />


        <Route element={<Layout />}> 
          <Route path="/pages/home" element={<Home />} />
          <Route path="/pages/pesquisar" element={<SearchPage />} />
          <Route path="/pages/statistics" element={<StatsData />} />
          <Route path="/pages/historicMov" element={<HistoricMov />} />
          <Route path="/pages/registerTcc" element={<RegisterTcc />} />
          <Route path="/pages/registLog" element={<LogsPage />} />
          
        </Route>
      </Routes>
    </Router>
    </>
  );
}

export default App;
