import React, { useEffect, useState } from "react";
import axios from "axios";
import CircleLoad from "../../components/common/CircleLoad";
import "./gestaoUsuarios.css";

const GestaoUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const response = await axios.get("http://127.0.0.1:8000/api/utilizadores/todos", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsuarios(response.data);
            } catch (error) {
                console.error("Erro ao carregar utilizadores", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, []);

    if (loading) return <CircleLoad mensagem="Carregando Dados" />;

    return (
        <div className="GestaoContainer">
            <div className="GestaoHeader">
                <h2>Gestão de Utilizadores</h2>
                <p>Gerencie quem tem acesso ao Acervo Digital do IPIL</p>
            </div>

            <div className="tabelaCard">
                <table className="usuariosTable">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Nº Processo</th>
                            <th>E-mail</th>
                            <th>Tipo</th>
                            <th>Data Registo</th>
                            <th>Último Login</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                                    Nenhum utilizador encontrado.
                                </td>
                            </tr>
                        ) : (
                            usuarios.map((user) => (
                                <tr key={user.id}>
                                    <td className="nomeCell">{user.nome}</td>
                                    <td>{user.numProcesso}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge ${user.tipo === 'Administrador' ? 'admin' : 'user'}`}>
                                            {user.tipo}
                                        </span>
                                    </td>
                                    <td>{user.data_registro}</td>
                                    <td>{user.ultimo_login}</td>
                                    <td>
                                        <div className="statusOnline"></div> Ativo
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GestaoUsuarios;