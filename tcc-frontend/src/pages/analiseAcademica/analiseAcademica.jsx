import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, Cell, PieChart, Pie } from "recharts";
import "./analiseAcademica.css";

function AppAnaliseAcademica() {
    // 1. Estados de Dados Operacionais
    const [totalizadores, setTotalizadores] = useState(null);
    const [dadosAno, setDadosAno] = useState([]);
    const [dadosOrientadores, setDadosOrientadores] = useState([]);
    const [dadosExcelencia, setDadosExcelencia] = useState([]);
    const [dadosEstruturaTipo, setDadosEstruturaTipo] = useState({ grafico: [], tabela: [] });
    const [listaCursos, setListaCursos] = useState([]); // Armazena cursos da base de dados
    const [loading, setLoading] = useState(true);

    // 2. Estado Único para os Filtros do Dashboard
    const [filtros, setFiltros] = useState({
        ano: "todos",
        curso: "todos",
        tipoTrabalho: "todos"
    });

    const CORES_DONUT = ["#34495e", "#e67e22"]; 

    // 3. Carregar Cursos uma única vez ao montar a página
    useEffect(() => {
        const carregarCursosEstaticos = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:8000/api/tccs/form-data");
                setListaCursos(res.data.cursos || []);
            } catch (err) {
                console.error("Erro ao procurar cursos para filtros:", err);
            }
        };
        carregarCursosEstaticos();
    }, []);

    // 4. Efeito Reativo: Sempre que qualquer filtro mudar, recarrega o Dashboard automaticamente
    useEffect(() => {
        const carregarDadosDashboard = async () => {
            setLoading(true);
            try {
                // Monta os query params baseados no estado atual dos filtros
                const params = {
                    anoDefesa: filtros.ano,
                    idCurso: filtros.curso,
                    tipoTrabalho: filtros.tipoTrabalho
                };

                const [resTotalizadores, resAno, resOrientadores, resExcelencia, resTipo] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/analise-academica/totalizadores", { params }),
                    axios.get("http://127.0.0.1:8000/api/analise-academica/evolucao-ano", { params }),
                    axios.get("http://127.0.0.1:8000/api/analise-academica/top-orientadores", { params }),
                    axios.get("http://127.0.0.1:8000/api/analise-academica/orientadores-excelencia", { params }),
                    axios.get("http://127.0.0.1:8000/api/analise-academica/estatisticas-tipo", { params })
                ]);

                setTotalizadores(resTotalizadores.data);
                setDadosAno(resAno.data);
                setDadosOrientadores(resOrientadores.data);
                setDadosExcelencia(resExcelencia.data);
                setDadosEstruturaTipo(resTipo.data);
            } catch (error) {
                console.error("Erro ao atualizar métricas do painel:", error);
                toast.error("Erro ao atualizar os dados analíticos.");
            } finally {
                setLoading(false);
            }
        };

        carregarDadosDashboard();
    }, [filtros]);

    // Manipulador de alterações dos selects
    const handleFiltroChange = (campo, valor) => {
        setFiltros(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    // Função auxiliar para construir o rótulo de tempo dinâmico nos subtítulos e kpis
    const obterSufixoContexto = () => {
        return filtros.ano === "todos" ? "Globais" : `em ${filtros.ano}`;
    };

    return (
        <div className="dashboardContainer">
            <div className="dashboardHeader">
                <h1>Análise Académica</h1>
                <span>Dados detalhados da Coordenação de Informática</span>
            </div>

            {/* BARRA DE FILTROS REUTILIZADA DA SEARCHPAGE */}
            <div className="barra-filtros-horizontal" style={{ marginTop: "20px", marginBottom: "5px" }}>
                {/* Filtro de Ano */}
                <div className="filtro-item">
                    <label>Ano de Defesa</label>
                    <select value={filtros.ano} onChange={(e) => handleFiltroChange("ano", e.target.value)}>
                        <option value="todos">Todos os Anos</option>
                        {Array.from({ length: 17 }, (_, i) => 2026 - i).map(ano => (
                            <option key={ano} value={ano}>{ano}</option>
                        ))}
                    </select>
                </div>

                {/* Filtro de Curso Dinâmico */}
                <div className="filtro-item">
                    <label>Curso</label>
                    <select value={filtros.curso} onChange={(e) => handleFiltroChange("curso", e.target.value)}>
                        <option value="todos">Todos os Cursos</option>
                        {listaCursos.map(c => (
                            <option key={c.idCurso || c.id} value={c.idCurso || c.id}>{c.nome}</option>
                        ))}
                    </select>
                </div>

                {/* Filtro de Estrutura de Trabalho */}
                <div className="filtro-item">
                    <label>Formação</label>
                    <select value={filtros.tipoTrabalho} onChange={(e) => handleFiltroChange("tipoTrabalho", e.target.value)}>
                        <option value="todos">Todos os Trabalhos</option>
                        <option value="individual">Trabalho Individual</option>
                        <option value="grupo">Em Grupo</option>
                    </select>
                </div>
            </div>

            {loading && <div className="loadingIndicadorSuave">Atualizando dados...</div>}

            {/* SEÇÃO 1: Totalizadores Dinâmicos */}
            <div className="totalizadoresGrid">
                <div className="cardKpi">
                    <h4>Total de TCCs {obterSufixoContexto()}</h4>
                    <span className="kpiValue">{totalizadores?.totalTccs}</span>
                    <p className="kpiSub">registos ativos</p>
                </div>

                <div className="cardKpi">
                    <h4>Média de Notas {obterSufixoContexto()}</h4>
                    <span className="kpiValue">{totalizadores?.mediaNotas}</span>
                    <p className="kpiSub">valores de 0 a 20</p>
                </div>

                <div className="cardKpi">
                    <h4>Curso Líder {obterSufixoContexto()}</h4>
                    <span className="kpiValueText">{totalizadores?.cursoLider}</span>
                    <p className="kpiSub">maior volume de projetos</p>
                </div>

                <div className="cardKpi">
                    <h4>Mais Ativo {obterSufixoContexto()}</h4>
                    <span className="kpiValueText">{totalizadores?.orientadorMaisAtivo?.nome}</span>
                    <p className="kpiSub">{totalizadores?.orientadorMaisAtivo?.quantidade} trabalhos orientados</p>
                </div>
            </div>

            {/* SEÇÃO 2: Bloco de Orientadores */}
            <div className="seccaoAnaliseDupla">
                <div className="chartCard">
                    <h3>Top 5 Orientadores por Volume {obterSufixoContexto()}</h3>
                    <div className="chartResponsiveWrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dadosOrientadores} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                                <XAxis type="number" stroke="#7f8c8d" fontSize={11} allowDecimals={false} />
                                <YAxis type="category" dataKey="nome" stroke="#2c3e50" fontSize={11} width={85} />
                                <Tooltip />
                                <Bar dataKey="quantidade" barSize={14} radius={[0, 4, 4, 0]} name="Projetos">
                                    {dadosOrientadores.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? "#e67e22" : "#34495e"} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chartCard">
                    <h3>Ranking de Orientadores por Nota Média {obterSufixoContexto()}</h3>
                    <div className="tableResponsiveWrapper">
                        <table className="dashboardTable">
                            <thead>
                                <tr>
                                    <th>Orientador</th>
                                    <th>Trabalhos</th>
                                    <th>Média</th>
                                    <th>Desempenho</th>
                                </tr>
                            </thead>
                            <tbody>
                                    {dadosExcelencia.slice(0, 5).map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.nome}</td>
                                            <td>{row.totalTrabalhos}</td>
                                            <td className="tableBoldCell">{row.mediaNotas} v.</td>
                                            <td>
                                                <span className={`statusBadge ${parseFloat(row.mediaNotas) >= 16 ? "badgeExcelent" : "badgeWarning"}`}>
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

            {/* SEÇÃO 3: Unificação de Formato de Trabalho e Histórico */}
            <div className="seccaoAnaliseDupla">
                <div className="chartCard">
                    <h3>Proporção por Formato de Trabalho {obterSufixoContexto()}</h3>
                    <div className="wrapperSplitDonut">
                        <div className="containerGraficoDonut">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dadosEstruturaTipo.grafico}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {dadosEstruturaTipo.grafico.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CORES_DONUT[index % CORES_DONUT.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="tableResponsiveWrapper flexTable">
                            <table className="dashboardTable">
                                <thead>
                                    <tr>
                                        <th>Formato</th>
                                        <th>Trabalhos</th>
                                        <th>Alunos</th>
                                        <th>Média</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dadosEstruturaTipo.tabela.map((row, index) => (
                                        <tr key={index}>
                                            <td style={{ fontWeight: 600 }}>
                                                <span className="formatoIndicador" style={{ backgroundColor: CORES_DONUT[index] }}></span>
                                                {row.tipo}
                                            </td>
                                            <td>{row.quantidade}</td>
                                            <td><span className="txtAlunos">{row.alunosEnvolvidos}</span></td>
                                            <td className="tableBoldCell">{row.media} v.</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="chartCard">
                    <h3>Histórico de Evolução Temporal de TCCs</h3>
                    <div className="chartResponsiveWrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dadosAno} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="ano" stroke="#7f8c8d" fontSize={11} />
                                <YAxis stroke="#7f8c8d" fontSize={11} allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="quantidade" fill="#e67e22" radius={[4, 4, 0, 0]} name="TCCs" barSize={35} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AppAnaliseAcademica;