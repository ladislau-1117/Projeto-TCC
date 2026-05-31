import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PerfilModal.css";

const ProfileModal = ({ mode, setMode, currentUser, refreshUser }) => {

    const [formData, setFormData] = useState({
        nome: currentUser?.name || "",
        email: currentUser?.email || "",
        senha: ""
    });
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        console.log("PerfilModal: mode mudou para:", mode);
    }, [mode]);

    
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
        if (mode !== 'edit') {
            
            e.preventDefault?.();
            return;
        }

        e.preventDefault?.();

        setLoading(true);
        setErro("");

        try {
           
            const token = sessionStorage.getItem("token");

            const response = await axios.put(
                "http://127.0.0.1:8000/api/perfil",
                {
                    nome: formData.nome,
                    email: formData.email,
                    senha: formData.senha || null
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}` 
                    }
                }
            );

        

            if (response.data.sucesso) {
                
                refreshUser({
                    idUtilizador: response.data.dados.idUtilizador,
                    name: response.data.dados.name,
                    email: response.data.dados.email,
                    numProcesso: response.data.dados.numProcesso
                });
                setMode("view"); 
            }
        } catch (err) {
            
            
            setErro(err.response?.data?.error || err.response?.data?.mensagem || "Erro ao atualizar os dados.");
        } finally {
            
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
                <form className="modalForm" noValidate>

                    {/*Número de Processo "Fixo"*/}
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

                    {/* Senha*/}
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

                    {/* RODAPÉ E BOTÕES  */}
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
                                
                                <button type="button" className="btnCancelar" onClick={() => setMode("view")}>
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btnAcaoPrincipal"
                                    disabled={loading}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSalvar(e);
                                    }}
                                >
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