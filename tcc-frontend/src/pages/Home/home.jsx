import { useEffect, useState } from "react";
import axios from "axios";
import DashInfo from "../../components/DashboardComponents/dashboardInfo";
import CircleLoad from "../../components/common/CircleLoad";
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import "./home.css";

function Home() {
  const navigate = useNavigate();
  const [dados, setDados] = useState({ totalRelatorios: 0, totalAno: 0, ocupacao: 0 });
  const [graphData, setGraphData] = useState({ barData: [], circleData: [] });
  const [initialLoading, setInitialLoading] = useState(() => sessionStorage.getItem('homeInitialLoadShown') !== 'true');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStorage = sessionStorage.getItem('user');

    if (!userStorage) {
      toast.error("Por favor, faça login para acessar");
      navigate("/"); 
      return;
    }

    
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {

      const [resCards, resGraphs] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/dashboard/stats'),
        axios.get('http://127.0.0.1:8000/api/dashboard/graphs')
      ]);

      setDados(resCards.data);
      setGraphData(resGraphs.data);
    } catch (error) {
      toast.error("Erro ao atualizar dados do Dashboard");
      console.error(error);
    } finally {
      if (initialLoading) {
        sessionStorage.setItem('homeInitialLoadShown', 'true');
        setInitialLoading(false);
      }
      setLoading(false);
    }
  };

  if (initialLoading && loading) {
    return (
      <div className="homeContainer homeLoadingWrapper">
        <CircleLoad mensagem="Carregando dashboard..." />
      </div>
    );
  }

  return (
    <div className="homeContainer">
      <div className="logsHeader">
        <h1>Visão Geral</h1>
        <p><strong>Dashboard do sistema e dados estatísticos.</strong></p>
      </div>
      
      <DashInfo dados={dados} graphData={graphData} />
    </div>
  );
}

export default Home;


