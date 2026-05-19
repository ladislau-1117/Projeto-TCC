import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarGrafic, CircleGrafic } from '../../components/DashboardComponents/graphics';
import './statistics.css';

const StatsData = () => {
    // 1. Criamos um estado interno para esta página
    const [graphData, setGraphData] = useState({ barData: [], circleData: [] });
    const [loading, setLoading] = useState(true);

    // 2. Função que busca os dados diretamente no PHP existente
    const fetchDadosEstatisticos = async () => {
        try {
            const res = await axios.get('http://localhost/TCC_PROJETO/tcc_back/dashboard/grafics.php');
            setGraphData(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao carregar dados no Stats:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDadosEstatisticos();
    }, []);

    if (loading) return <div className="stats-container">Carregando estatísticas...</div>;

    return (
        <div className="stats-container">
            <header className="stats-header">
                <h1>Análise Acadêmica</h1>
                <p>Dados detalhados da Coordenação de Informática</p>
            </header>

            <div className="stats-grid">
                {/* GRÁFICO DE BARRAS (Dados Reais do PHP) */}
                <section className="chart-section">
                    <BarGrafic 
                        data={graphData} 
                        titulo="Produção de Relatórios por Ano" 
                    />
                </section>

                {/* GRÁFICO DE PIZZA (Dados Fixos por enquanto) */}
                <section className="chart-section side-chart">
                    <CircleGrafic 
                        data={graphData} 
                        titulo="Dinâmica: Grupo vs Individual"
                        label1="Trabalhos Individuais"
                        label2="Trabalhos em Grupo"
                    />
                </section>

                {/* TABELA DE ORIENTADORES */}
                <section className="chart-section table-section">
                    <h3>Desempenho por Orientador</h3>
                    <div className="placeholder-table">Em breve: Ranking de Professores</div>
                </section>
            </div>
        </div>
    );
};

export default StatsData;




