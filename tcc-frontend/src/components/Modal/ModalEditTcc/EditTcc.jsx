import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FileIcon, LocationIcon, CancelAuthor } from "../../../assets/icons";

function ModalEditTcc({ show, tcc, onClose, onSave }) {
    const [formData, setFormData] = useState({
        titulo: '', orientadorNome: '', areaFormacao: '',
        curso: '', anoDefesa: '', nota: '',
        andar: '', sala: '', armario: '', prateleira: ''
    });
    const [autores, setAutores] = useState(['']);

    useEffect(() => {
        if (show && tcc) {
            setFormData({
                titulo: tcc.titulo || '',
                orientadorNome: tcc.orientadorNome || '',
                areaFormacao: tcc.areaFormacao, 
                // Se idCurso for 1 é Técnico de Informática, se for 2 é Gestão de Sistemas
                curso: parseInt(tcc.idCurso) || 1,
                anoDefesa: tcc.anoDefesa,
                nota: tcc.notaFinal,
                
                // Mapeamento exato com o teu JSON real do Banco de Dados
                andar: tcc.blocoArquivo || 'Rés-do-chão',
                sala: tcc.estante || '78',
                armario: tcc.compartimento || '1',
                prateleira: tcc.prateleira || '1'
            });

            if (tcc.autores) {
                setAutores(Array.isArray(tcc.autores) ? tcc.autores : [tcc.autores]);
            } else {
                setAutores(['']);
            }
        }
    }, [show, tcc]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAutorChange = (index, value) => {
        const novos = [...autores];
        novos[index] = value;
        setAutores(novos);
    };

    const addAutor = () => setAutores([...autores, '']);
    const removeAutor = (index) => setAutores(autores.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userSession = sessionStorage.getItem('user');
        if (!userSession) {
            toast.error("Sessão expirada. Faça login novamente.");
            return;
        }

        const userObj = JSON.parse(userSession);
        const userId = userObj.idUtilizador || userObj.id;

        // Monta o Payload com os nomes exatos que o teu Laravel update precisa ler
        const payload = {
            titulo: formData.titulo,
            orientadorNome: formData.orientadorNome,
            anoDefesa: parseInt(formData.anoDefesa),
            notaFinal: parseInt(formData.nota), // Casado com 'notaFinal' do Laravel
            idCurso: parseInt(formData.curso), 
            idLocal: tcc.idLocal, // Enviando o ID do local correto
            
            // Tradução das variáveis do HTML para as colunas do Banco (blocoArquivo, estante, etc.)
            blocoArquivo: formData.andar,
            estante: formData.sala,
            compartimento: formData.armario,
            prateleira: formData.prateleira,
            
            userId: userId,
            autores: autores
        };

        try {
            // Rota PUT da tua API unificada do Laravel
            const res = await axios.put(`http://127.0.0.1:8000/api/tccs/${tcc.idTcc}`, payload);

            if (res.status === 200 && res.data.message) {
                toast.success(res.data.message || "Relatório atualizado com sucesso!");
                onSave();
            } else {
                toast.error("Erro ao atualizar. Resposta inválida do servidor.");
            }
        } catch (error) {
            console.error("Erro na atualização:", error);
            const mensagemErro = error.response?.data?.erro || "Erro na ligação ao servidor Laravel";
            toast.error(mensagemErro);
        }
    };

    if (!show) return null;

    return (
        <div className="modalOverlay">
            <div className="modalContent">
                <form onSubmit={handleSubmit} >

                    {/* SEÇÃO 1: DADOS DO TRABALHO */}
                    <div className="containerRegister">
                        <div className="section-title">
                            <FileIcon />
                            <h3>Dados do trabalho</h3>
                        </div>

                        <div className="divInputs">
                            <div className="inputContainer">
                                <input type="text" name="titulo" placeholder=" " required value={formData.titulo} onChange={handleChange} />
                                <label>Título</label>
                            </div>

                            <div className="gridInput">
                                {/* Lista de Autores */}
                                <div className="autores-section">
                                    {autores.map((nome, index) => (
                                        <div key={index} className="autor-item" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                            <div className="inputContainer" style={{ flex: 1 }}>
                                                <input type="text" placeholder=" " required value={nome} onChange={(e) => handleAutorChange(index, e.target.value)} />
                                                <label>Autor {index + 1}</label>
                                            </div>
                                            {autores.length > 1 && (
                                                <button type="button" onClick={() => setAutores(autores.filter((_, i) => i !== index))} className="btn-remove-autor">
                                                    <CancelAuthor />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => setAutores([...autores, ''])} className="btn-add-autor">
                                        Adicionar mais um autor
                                    </button>
                                </div>

                                <div className="inputContainer">
                                    <input type="text" name="orientadorNome" placeholder=" " required value={formData.orientadorNome} onChange={handleChange} />
                                    <label>Orientador</label>
                                </div>

                                <div className="inputContainer">
                                    <select name="areaFormacao" required value={formData.areaFormacao} onChange={handleChange}>
                                        <option value="Informática">Informática</option>
                                    </select>
                                    <label>Área de formação</label>
                                </div>

                                <div className="inputContainer">
                                    <select name="curso" required value={formData.curso} onChange={handleChange}>
                                        <option value={1}>Técnico de Informática</option>
                                        <option value={2}>Gestão de Sistemas Informático</option>
                                    </select>
                                    <label>Curso</label>
                                </div>

                                <div className="inputContainer">
                                    <select name="anoDefesa" required value={formData.anoDefesa} onChange={handleChange}>
                                        {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                    <label>Ano da Defesa</label>
                                </div>

                                <div className="inputContainer">
                                    <select name="nota" required value={formData.nota} onChange={handleChange}>
                                        {Array.from({ length: 20 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                    <label>Nota Final</label>
                                </div>
                            </div>
                        </div>
                        <span>*todos os campos são obrigatórios</span>
                    </div>

                    {/* SEÇÃO 2: LOCALIZAÇÃO */}
                    <div className="containerRegister">
                        <div className="section-title">
                            <LocationIcon />
                            <h3>Localização do trabalho</h3>
                        </div>
                        <div className="divInputs">
                            <div className="gridInput">
                                <div className="inputContainer">
                                    <select name="andar" required value={formData.andar} onChange={handleChange}>
                                        <option value="Rés-do-chão">Rés-do-chão</option>
                                        <option value="1º Andar">1º Andar</option>
                                        <option value="2º Andar">2º Andar</option>
                                    </select>
                                    <label>Andar</label>
                                </div>
                                <div className="inputContainer">
                                    <select name="sala" required value={formData.sala} onChange={handleChange}>
                                        <option value="78">78</option><option value="79">79</option><option value="80">80</option>
                                    </select>
                                    <label>Sala</label>
                                </div>
                                <div className="inputContainer">
                                    <select name="armario" required value={formData.armario} onChange={handleChange}>
                                        <option value="1">1</option><option value="2">2</option><option value="3">3</option>
                                    </select>
                                    <label>Armário</label>
                                </div>
                                <div className="inputContainer">
                                    <select name="prateleira" required value={formData.prateleira} onChange={handleChange}>
                                        <option value="1">1</option><option value="2">2</option><option value="3">3</option>
                                    </select>
                                    <label>Prateleira</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer-buttons" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="button" onClick={onClose} className="btnDraft" style={{ background: 'var(--fundo-escuro)' }}>Cancelar</button>
                        <button type="submit" className="btnDraft">Salvar Alterações</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalEditTcc;