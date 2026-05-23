import React, { useState, useEffect } from 'react';
import './registerAllLogs.css';

const LogsPage = () => {
    const [listaLogs, setListaLogs] = useState([]);
    const [estaCarregando, setEstaCarregando] = useState(true);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [totalRegistos, setTotalRegistos] = useState(0);

    useEffect(() => {
        const buscarLogs = async () => {
            setEstaCarregando(true);
            try {
                const resposta = await fetch(`http://localhost:8000/api/logs?page=${paginaAtual}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (resposta.ok) {
                    const dados = await resposta.json();
                    setListaLogs(dados.logs);
                    setTotalPaginas(dados.totalPaginas);
                    setTotalRegistos(dados.totalRegistos);
                } else {
                    console.error("Erro na resposta do servidor:", resposta.status);
                }
            } catch (erro) {
                console.error("Erro ao buscar logs:", erro);
            } finally {
                setEstaCarregando(false);
            }
        };

        buscarLogs();
    }, [paginaAtual]);

    const mudarPagina = (novaPagina) => {
        if (novaPagina >= 1 && novaPagina <= totalPaginas) {
            setPaginaAtual(novaPagina);
            window.scrollTo(0, 0);
        }
    };

    if (estaCarregando) {
        return <div className="logsContainer"><p>A carregar registos de auditoria...</p></div>;
    }

    return (
        <div className="logsContainer">
            <header className="logsHeader">
                <h2>Registro de Login</h2>
                <p>Acompanhe todas as tentativas de Login de usuários </p>
            </header>

            <div className="tabelaWrapper">
                <table className="tabelaLogs">
                    <thead>
                        <tr>
                            <th>Nº</th>
                            <th>Utilizador</th>
                            <th>Evento</th>
                            <th>Descrição</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaLogs.map((log, indice) => (
                            <tr key={log.idLog} className="linhaLog">
                                <td> {indice + 1} </td>
                                <td>
                                    <span className="nomeUtilizador">{log.nome}</span>
                                </td>
                                <td>
                                    <span className={`statusBadge ${log.tipoEvento}`}>
                                        {log.tipoEvento === 'loginSucesso' ? 'Sucesso' : 'Tentativa'}
                                    </span>
                                </td>
                                <td>{log.descricaoEvento}</td>
                                <td>{new Date(log.dataEvento).toLocaleString('pt-PT')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginação */}
            {totalPaginas > 1 && (
                <div className="pagination-wrapper">
                    <button
                        className="pag-btn"
                        disabled={paginaAtual === 1}
                        onClick={() => mudarPagina(paginaAtual - 1)}
                    >
                        &laquo; Anterior
                    </button>

                    <span className="page-indicator">
                        Página <strong>{paginaAtual}</strong> de {totalPaginas}
                    </span>

                    <button
                        className="pag-btn"
                        disabled={paginaAtual >= totalPaginas}
                        onClick={() => mudarPagina(paginaAtual + 1)}
                    >
                        Próximo &raquo;
                    </button>
                </div>
            )}
        </div>
    );
};

export default LogsPage;