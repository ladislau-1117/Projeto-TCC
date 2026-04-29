import React, { useState, useEffect } from 'react';
import './registerAllLogs.css';

const LogsPage = () => {
    const [listaLogs, setListaLogs] = useState([]);
    const [estaCarregando, setEstaCarregando] = useState(true);

    useEffect(() => {
        const buscarLogs = async () => {
            try {
                const resposta = await fetch('http://localhost/TCC_PROJETO/tcc_back/user/RegistLog.php');
                const dados = await resposta.json();
                setListaLogs(dados);
            } catch (erro) {
                console.error("Erro ao buscar logs:", erro);
            } finally {
                setEstaCarregando(false);
            }
        };

        buscarLogs();
    }, []);

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
                                <td >
                                    <span className="nomeUtilizador">{log.nome}</span></td>
                                <td>
                                    <span className={`statusBadge ${log.tipoEvento}`}>
                                        {log.tipoEvento === 'loginSucesso' ? 'Sucesso' : 'Tentativa'}
                                    </span>

                                </td>
                                <td>{log.descricaoEvento}
                                    
                                </td>
                                <td>{new Date(log.dataEvento).toLocaleString('pt-PT')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LogsPage;