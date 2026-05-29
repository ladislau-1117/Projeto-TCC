import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import html2pdf from "html2pdf.js";
import { ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, Cell, PieChart, Pie } from "recharts";
import TemplateRelatorioPDF from "./RelatorioPDF/TemplateRelatorioPDF";
import CircleLoad from "../../components/common/CircleLoad";
import { FileIconMini } from "../../assets/icons";
import "./analiseAcademica.css";

function AppAnaliseAcademica() {
    // ... teus estados anteriores mantêm-se exatamente iguais ...
    const [totalizadores, setTotalizadores] = useState(null);
    const [dadosAno, setDadosAno] = useState([]);
    const [dadosOrientadores, setDadosOrientadores] = useState([]);
    const [dadosExcelencia, setDadosExcelencia] = useState([]);
    const [dadosEstruturaTipo, setDadosEstruturaTipo] = useState({ grafico: [], tabela: [] });
    const [listaCursos, setListaCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState({ ano: "todos", curso: "todos", tipoTrabalho: "todos" });

    // NOVO ESTADO: Controla a abertura do Modal de Impressão
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    const CORES_DONUT = ["#34495e", "#e67e22"];

    useEffect(() => {
        const carregarCursosEstaticos = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:8000/api/cursos");
                setListaCursos(res.data);
            } catch (err) {
                console.error("Erro ao procurar cursos para filtros:", err);
            }
        };
        carregarCursosEstaticos();
    }, []);

    useEffect(() => {
        const carregarDadosDashboard = async () => {
            setLoading(true);
            try {
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
                console.error("Erro ao atualizar métricas:", error);
                toast.error("Erro ao atualizar os dados analíticos.");
            } finally {
                setLoading(false);
            }
        };
        carregarDadosDashboard();
    }, [filtros]);

    const handleFiltroChange = (campo, valor) => {
        setFiltros(prev => ({ ...prev, [campo]: valor }));
    };

    const obterSufixoContexto = () => {
        return filtros.ano === "todos" ? "Globais" : `em ${filtros.ano}`;
    };




    const gerarEBaixarPdf = () => {
        // 1. Capturar o elemento HTML da nossa folha A4 do Preview
        const elemento = document.getElementById("area-tcc-relatorio-impressao");

        if (!elemento) {
            toast.error("Erro ao localizar a área de impressão.");
            return;
        }

        // 2. Definir um nome inteligente para o ficheiro com base nos filtros atuais
        const sufixoAno = filtros.ano === "todos" ? "Global" : filtros.ano;
        const nomeFicheiro = `Relatorio_Academico_IPIL_${sufixoAno}.pdf`;

        // 3. Configurações essenciais para o PDF sair perfeito em formato A4 institucional
        const opcoes = {
            margin: [15, 15, 15, 15], // Margens de segurança: topo, esquerda, fundo, direita (em mm)
            filename: nomeFicheiro,
            image: { type: 'jpeg', quality: 0.98 }, // Qualidade de elementos gráficos que possam existir
            html2canvas: {
                scale: 2, // Aumenta a resolução para os textos não saírem pixelizados (efeito retina)
                useCORS: true, // Permite carregar imagens externas ou fontes se houver necessidade
                letterRendering: true
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait' // Modo Vertical (Folha em pé)
            },
            pagebreak: { mode: ['avoid-all', 'css'] } // Evita quebras feias de texto ao meio nas tabelas
        };

        // Criar um Toast de processamento (feedback visual para o utilizador sabe que está a processar)
        const toastId = toast.loading("A processar e a gerar o PDF institucional...");

        // 4. Executar a conversão e o download automático
        html2pdf()
            .set(opcoes)
            .from(elemento)
            .save()
            .then(() => {
                toast.success("Relatório transferido com sucesso!", { id: toastId });
                setShowPreviewModal(false); // Fecha o modal após o download terminar com sucesso
            })
            .catch((erro) => {
                console.error("Erro na conversão para PDF:", erro);
                toast.error("Houve um erro ao exportar o documento.", { id: toastId });
            });
    };









    return (
        <div className="dashboardContainer">
            {/* HEADERS ATUALIZADO COM O BOTÃO DE EVENTO */}
            <div className="dashboardHeader" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1>Análise Académica</h1>
                    <span>Dados detalhados da Coordenação de Informática</span>
                </div>
                <button className="btnGerarPdf" onClick={() => setShowPreviewModal(true)}>
                    <FileIconMini />
                    Gerar Relatório PDF
                </button>
            </div>

            {/* BARRA DE FILTROS */}
            <div className="barra-filtros-horizontal" style={{ marginTop: "20px", marginBottom: "5px" }}>
                <div className="filtro-item">
                    <label>Ano de Defesa</label>
                    <select value={filtros.ano} onChange={(e) => handleFiltroChange("ano", e.target.value)}>
                        <option value="todos">Todos os Anos</option>
                        {Array.from({ length: 17 }, (_, i) => 2026 - i).map(ano => (
                            <option key={ano} value={ano}>{ano}</option>
                        ))}
                    </select>
                </div>

                <div className="filtro-item">
                    <label>Curso</label>
                    <select value={filtros.curso} onChange={(e) => handleFiltroChange("curso", e.target.value)}>
                        <option value="todos">Todos os Cursos</option>
                        {listaCursos.map(c => (
                            <option key={c.idCurso || c.id} value={c.idCurso || c.id}>{c.nome}</option>
                        ))}
                    </select>
                </div>

                <div className="filtro-item">
                    <label>Formação</label>
                    <select value={filtros.tipoTrabalho} onChange={(e) => handleFiltroChange("tipoTrabalho", e.target.value)}>
                        <option value="todos">Todos os Trabalhos</option>
                        <option value="individual">Trabalho Individual</option>
                        <option value="grupo">Em Grupo</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loadingDashboard">
                    <CircleLoad mensagem="Atualizando dados..." />
                </div>
            ) : (
                <>
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


            
            {showPreviewModal && (
                <div className="pdf-overlay-backdrop">
                    <div className="pdf-modal-janela-operante">

                        {/* Barra de Ações Superior do Preview */}
                        <div className="pdf-modal-barra-acoes">
                            <div className="pdf-modal-info-titulo">
                                <h4>Visualização Prévia do Documento</h4>
                                <p>Confirme as informações antes de exportar</p>
                            </div>
                            <div className="pdf-modal-grupo-botoes">
                                <button className="pdf-btn-acao-cancelar" onClick={() => setShowPreviewModal(false)}>
                                    Fechar
                                </button>
                                <button className="pdf-btn-acao-confirmar" onClick={gerarEBaixarPdf}>
                                    Confirmar e Baixar PDF
                                </button>
                            </div>
                        </div>

                        {/* Área do Papel Virtual A4 */}
                        <div className="pdf-modal-corpo-scroll">
                            <div className="pdf-papel-sombreado-a4" id="area-tcc-relatorio-impressao">
                                <TemplateRelatorioPDF
                                    totalizadores={totalizadores}
                                    dadosOrientadores={dadosOrientadores}
                                    dadosExcelencia={dadosExcelencia}
                                    dadosEstruturaTipo={dadosEstruturaTipo}
                                    filtros={filtros}
                                    listaCursos={listaCursos}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            )}
                </>
            )}

        </div>
    );
}

export default AppAnaliseAcademica;