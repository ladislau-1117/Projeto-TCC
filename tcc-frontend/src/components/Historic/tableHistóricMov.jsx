import { useState, useEffect } from "react";
import axios from "axios";
import CircleLoad from "../common/CircleLoad";

const TableHistoricMov = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Novos estados para a paginação
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [totalRegistos, setTotalRegistos] = useState(0);

    useEffect(() => {
        setLoading(true);
        // Mudamos para a porta 8000 do Laravel
        axios.get(`http://127.0.0.1:8000/api/dashboard/history?page=${pagina}`)
            .then((response) => {
                const data = response.data;
                if (data.logs) {
                    setLogs(data.logs);
                    setTotalPaginas(data.totalPaginas);
                    setTotalRegistos(data.totalRegistos);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao buscar logs:", err);
                setLoading(false);
            });
    }, [pagina]); // Recarrega sempre que a página mudar

    const formatarData = (dataSql) => {
        if (!dataSql) return "---";
        const data = new Date(dataSql);
        return data.toLocaleString('pt-AO');
    };

    return (
        <div className="logsContainer">
            {loading ? (
                <div className="loader-container">
                    <CircleLoad mensagem="Carregando atividades..." />
                </div>
            ) : (
                <div className="tableWrapper">
                    <table className="logsTable">
                        <thead>
                            <tr>
                                <th>Data e Hora</th>
                                <th>Utilizador</th>
                                <th>Ação Realizada</th>
                                <th>Título do Relatório</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length > 0 ? (
                                logs.map((log) => (
                                    <tr key={log.idMov} className="logRow">
                                        <td className="dataColuna">{formatarData(log.dataAcao)}</td>
                                        <td className="userColuna">
                                            <span className="userBadge">{log.utilizadorNome}</span>
                                        </td>
                                        <td className="acaoColuna">
                                            <span className={
                                                log.tipoAcao.includes('Eliminação') ? 'acaoBadge delete' : 
                                                log.tipoAcao.includes('Edição') ? 'acaoBadge edit' : 'acaoBadge success'
                                            }>
                                                {log.tipoAcao}
                                            </span>
                                        </td>
                                        <td className="tituloColuna">
                                            <span className="tituloTexto">{log.tituloTcc || "---"}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>Nenhum registo encontrado.</td></tr>
                            )}
                        </tbody>
                    </table>

                    {/* Sinalizadores de Paginação no final da tabela */}
                    <div className="footerTableHistoric">
                        <div className="paginationInfo">
                            Mostrando página <strong>{pagina}</strong> de <strong>{totalPaginas}</strong> ({totalRegistos} Registos)
                        </div>
                        <div className="paginationButtons">
                            <button 
                                onClick={() => setPagina(p => Math.max(1, p - 1))}
                                disabled={pagina === 1}
                                className="pagBtn">
                                Anterior
                            </button>
                            <button 
                                onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                                disabled={pagina >= totalPaginas}
                                className="pagBtn">
                                Próximo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TableHistoricMov;