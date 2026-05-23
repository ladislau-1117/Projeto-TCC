import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, Cell, PieChart, Pie, Legend } from "recharts";
import "./analiseAcademica.css";

function AppAnaliseAcademica() {
    const [totalizadores, setTotalizadores] = useState(null);
    const [dadosAno, setDadosAno] = useState([]);
    const [dadosOrientadores, setDadosOrientadores] = useState([]);
    const [dadosMediaAno, setDadosMediaAno] = useState([]);
    const [dadosExcelencia, setDadosExcelencia] = useState([]);
    const [dadosEstruturaTipo, setDadosEstruturaTipo] = useState({ grafico: [], tabela: [] });
    const [loading, setLoading] = useState(true);

    const CORES_DONUT = ["#34495e", "#e67e22"]; // Escuro para Individual, Laranja para Coletivo

    useEffect(() => {
        const carregarDadosDashboard = async () => {
            try {
                // Executa os 6 pedidos em paralelo com máxima performance
                const [resTotalizadores, resAno, resOrientadores, resMediaAno, resExcelencia, resTipo] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/analise-academica/totalizadores"),
                    axios.get("http://127.0.0.1:8000/api/analise-academica/evolucao-ano"),
                    axios.get("http://127.0.0.1:8000/api/analise-academica/top-orientadores"),
                    axios.get("http://127.0.0.1:8000/api/analise-academica/media-notas-ano"),
                    axios.get("http://127.0.0.1:8000/api/analise-academica/orientadores-excelencia"),
                    axios.get("http://127.0.0.1:8000/api/analise-academica/estatisticas-tipo")
                ]);

                setTotalizadores(resTotalizadores.data);
                setDadosAno(resAno.data);
                setDadosOrientadores(resOrientadores.data);
                setDadosMediaAno(resMediaAno.data);
                setDadosExcelencia(resExcelencia.data);
                setDadosEstruturaTipo(resTipo.data);
            } catch (error) {
                console.error("Erro ao carregar dados do dashboard:", error);
                toast.error("Erro ao carregar os dados analíticos.");
            } finally {
                setLoading(false);
            }
        };

        carregarDadosDashboard();
    }, []);

    if (loading) {
        return <div className="loadingDashboard">Carregando análise académica...</div>;
    }

    return (
        <div className="dashboardContainer">
            <div className="dashboardHeader">
                <h1>Análise Académica</h1>
                <span>Dados detalhados da Coordenação de Informática</span>
            </div>

            {/* SEÇÃO 1: Totalizadores */}
            <div className="totalizadoresGrid">
                <div className="cardKpi">
                    <h4>Total de TCCs Catalogados</h4>
                    <span className="kpiValue">{totalizadores?.totalTccs}</span>
                    <p className="kpiSub">registos ativos</p>
                </div>

                <div className="cardKpi">
                    <h4>Média Global de Notas</h4>
                    <span className="kpiValue">{totalizadores?.mediaNotas}</span>
                    <p className="kpiSub">valores de 0 a 20</p>
                </div>

                <div className="cardKpi">
                    <h4>Curso Líder</h4>
                    <span className="kpiValueText">{totalizadores?.cursoLider}</span>
                    <p className="kpiSub">maior volume de projetos</p>
                </div>

                <div className="cardKpi">
                    <h4>Orientador Mais Ativo</h4>
                    <span className="kpiValueText">{totalizadores?.orientadorMaisAtivo?.nome}</span>
                    <p className="kpiSub">{totalizadores?.orientadorMaisAtivo?.quantidade} trabalhos orientados</p>
                </div>
            </div>

            {/* SEÇÃO 2: Volume de Trabalho */}
            <div className="chartsSectionGrid">
                <div className="chartCard">
                    <h3>Evolução de TCCs Defendidos por Ano</h3>
                    <div className="chartResponsiveWrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dadosAno} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                                <XAxis dataKey="ano" stroke="#7f8c8d" fontSize={12} />
                                <YAxis stroke="#7f8c8d" fontSize={12} allowDecimals={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="quantidade" stroke="#e67e22" strokeWidth={3} activeDot={{ r: 8 }} name="TCCs" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chartCard">
                    <h3>Top 5 Orientadores por Volume de Trabalho</h3>
                    <div className="chartResponsiveWrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dadosOrientadores} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                                <XAxis type="number" stroke="#7f8c8d" fontSize={12} allowDecimals={false} />
                                <YAxis type="category" dataKey="nome" stroke="#2c3e50" fontSize={11} width={90} />
                                <Tooltip />
                                <Bar dataKey="quantidade" barSize={18} radius={[0, 4, 4, 0]} name="Projetos">
                                    {dadosOrientadores.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? "#e67e22" : "#34495e"} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* SEÇÃO 3: Desempenho Pedagógico */}
            <div className="chartsSectionGrid">
                <div className="chartCard">
                    <h3>Desempenho: Média de Notas Anuais</h3>
                    <div className="chartResponsiveWrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dadosMediaAno} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                                <XAxis dataKey="ano" stroke="#7f8c8d" fontSize={12} />
                                <YAxis stroke="#7f8c8d" fontSize={12} domain={[0, 20]} />
                                <Tooltip />
                                <Line type="linear" dataKey="media" stroke="#2c3e50" strokeWidth={3} name="Média de Notas" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chartCard">
                    <h3>Ranking de Orientadores por Nota Média</h3>
                    <div className="tableResponsiveWrapper">
                        <table className="dashboardTable">
                            <thead>
                                <tr>
                                    <th>Orientador / Professor</th>
                                    <th>Trabalhos</th>
                                    <th>Nota Média</th>
                                    <th>Desempenho</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dadosExcelencia.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.nome}</td>
                                        <td>{row.totalTrabalhos}</td>
                                        <td className="tableBoldCell">{row.mediaNotas} v.</td>
                                        <td>
                                            <span className={`statusBadge ${parseFloat(row.mediaNotas) >= 16 ? "badgeNormal" : "badgeWarning"}`}>
                                                {parseFloat(row.mediaNotas) >= 16 ? "Excelente" : "Satisfatório"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* SEÇÃO 4: NOVA LINHA - Dinâmica de Equipas (Gráfico Donut + Tabela Tipo) */}
            <div className="chartsSectionGrid">
                
                {/* Gráfico Donut */}
                <div className="chartCard">
                    <h3>Projetos: Proporção Individual vs. Coletivo</h3>
                    <div className="chartResponsiveWrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={dadosEstruturaTipo.grafico}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={65}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {dadosEstruturaTipo.grafico.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CORES_DONUT[index % CORES_DONUT.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tabela de Métricas Detalhadas */}
                <div className="chartCard">
                    <h3>Análise de Desempenho por Formato de Trabalho</h3>
                    <div className="tableResponsiveWrapper">
                        <table className="dashboardTable">
                            <thead>
                                <tr>
                                    <th>Formato do Projeto</th>
                                    <th>Qtd. Trabalhos</th>
                                    <th>Alunos Integrados</th>
                                    <th>Nota Média</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dadosEstruturaTipo.tabela.map((row, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: 500 }}>{row.tipo}</td>
                                        <td>{row.quantidade}</td>
                                        <td>{row.alunosEnvolvidos} alunos</td>
                                        <td className="tableBoldCell">{row.media} v.</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AppAnaliseAcademica;