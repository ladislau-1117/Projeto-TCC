import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PerfilModal.css";

const ProfileModal = ({ mode, setMode, currentUser, refreshUser }) => {
    // Estado do formulário focado apenas nos 3 campos editáveis
    const [formData, setFormData] = useState({
        nome: currentUser?.name || "",
        email: currentUser?.email || "",
        senha: ""
    });
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    // Sincroniza o estado caso o currentUser mude externamente
    useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                nome: currentUser.name || "",
                email: currentUser.email || ""
            }));
        }
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSalvar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro("");

        try {
            // Recupera o token que o AuthController gerou e guardou no sessionStorage
            const token = sessionStorage.getItem("token");

            // Rota PUT conectada ao Laravel passando o Bearer Token no cabeçalho
            const response = await axios.put(
                "/api/perfil/atualizar",
                {
                    nome: formData.nome,
                    email: formData.email,
                    senha: formData.senha || null
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Informa ao Sanctum quem está a fazer a alteração
                    }
                }
            );

            
            if (response.data.sucesso) {
                // Atualiza o SessionStorage e o estado do Header com o padrão 'name'
                refreshUser({
                    idUtilizador: response.data.dados.idUtilizador,
                    name: response.data.dados.name,
                    email: response.data.dados.email,
                    numProcesso: response.data.dados.numProcesso
                });
                setMode("closed"); // Fecha o modal com sucesso
            }
        } catch (err) {
            // Captura o erro real vindo do Laravel
            setErro(err.response?.data?.error || err.response?.data?.mensagem || "Erro ao atualizar os dados.");
        } finally {
            // Força a limpeza do campo de senha por segurança
            setFormData(prev => ({ ...prev, senha: "" }));
            setLoading(false);
        }
    };

    return (
        <div className="modalOverlay">
            <div className="modalContent">

                {/* CABEÇALHO DO MODAL */}
                <div className="modalHeader">
                    <h3>{mode === "view" ? "Meu Perfil" : "Editar Dados do Perfil"}</h3>
                    <button type="button" className="btnFecharX" onClick={() => setMode("closed")}>&times;</button>
                </div>

                {erro && <div className="errorAlert">{erro}</div>}

                {/* CONTEÚDO DO PERFIL */}
                <form onSubmit={handleSalvar} className="modalForm">

                    {/* Campo Fixo: Número de Processo corrigido com base na migration */}
                    <div className="inputGroup">
                        <label>Nº de Processo (IPIL):</label>
                        <p className="staticField">{currentUser?.numProcesso || "Não definido"}</p>
                    </div>

                    {/* Nome Completo */}
                    <div className="inputGroup">
                        <label>Nome Completo:</label>
                        {mode === "view" ? (
                            <p className="staticField">{formData.nome}</p>
                        ) : (
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleInputChange}
                                required
                            />
                        )}
                    </div>

                    {/* E-mail */}
                    <div className="inputGroup">
                        <label>E-mail Institucional:</label>
                        {mode === "view" ? (
                            <p className="staticField">{formData.email}</p>
                        ) : (
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        )}
                    </div>

                    {/* Senha: Só renderiza se estiver explicitamente no modo de edição */}
                    {mode === "edit" && (
                        <div className="inputGroup">
                            <label>Nova Senha (deixe em branco para manter a atual):</label>
                            <input
                                type="password"
                                name="senha"
                                value={formData.senha}
                                onChange={handleInputChange}
                                placeholder="Mínimo 8 caracteres"
                            />
                        </div>
                    )}

                    {/* RODAPÉ E BOTÕES ALTERNÁVEIS DE FLUXO */}
                    <div className="modalFooter">
                        {mode === "view" ? (
                            <>
                                <button type="button" className="btnCancelar" onClick={() => setMode("closed")}>
                                    Fechar
                                </button>
                                <button type="button" className="btnAcaoPrincipal" onClick={() => setMode("edit")}>
                                    Editar Perfil
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Corrigido: Ao cancelar a edição, volta a exibir o perfil em modo leitura */}
                                <button type="button" className="btnCancelar" onClick={() => setMode("view")}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btnAcaoPrincipal" disabled={loading}>
                                    {loading ? "A guardar..." : "Salvar Alterações"}
                                </button>
                            </>
                        )}
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ProfileModal;