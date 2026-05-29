import "./registerTcc.css";
import { FileIcon, LocationIcon } from "../../assets/icons";
import { useState, useEffect } from "react";
import axios from "axios"
import toast from "react-hot-toast";
import { CancelAuthor } from "../../assets/icons";

function RegisterTcc() {
    // Estado para dados do documento
    const [formData, setFormData] = useState({
        titulo: '', orientadorNome: '', areaFormacao: '',
        curso: '', anoDefesa: '', nota: '',
        andar: '', sala: '', armario: '', prateleira: ''
    });

    const [autores, setAutores] = useState(['']);
    const [showModal, setShowModal] = useState(false);
    const dataHoraAtual = new Date().toLocaleString('pt-PT');
    const [opcoesBack, setOpcoesBack] = useState({ areas: [], cursos: [] });
    const [cursosFiltrados, setCursosFiltrados] = useState([]);

    //função para permitir apenas letras
    const validateLetters = (value) => {
        // Regex para apenas letras
        return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
    };

    // funções para autores dinâmicos
    const handleAutorChange = (index, value) => {
        const novosAutores = [...autores];
        novosAutores[index] = validateLetters(value);
        setAutores(novosAutores);
    };

    const adicionarAutor = () => setAutores([...autores, '']);

    const removerAutor = (index) => {
        const novosAutores = autores.filter((_, i) => i !== index);
        setAutores(novosAutores);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let finalValue = value;

        // Se for um destes campos, remove números e símbolos
        if (name === "titulo" || name === "orientadorNome") {
            finalValue = validateLetters(value);
        }

        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handlePreview = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    const handleFinalRegister = async () => {
        const userStorage = sessionStorage.getItem('user');
        if (!userStorage) {
            toast.error("Sessão expirada.");
            return;
        }

        const userObj = JSON.parse(userStorage);

        
        const enviarDados = {
            titulo: formData.titulo,
            tipo_projeto: "TCC", 
            orientadorNome: formData.orientadorNome,
            anoDefesa: formData.anoDefesa,
            notaFinal: formData.nota, 
            idCurso: formData.curso,  
            statusAprovacao: parseInt(formData.nota) >= 10 ? 'Aprovado' : 'Reprovado',
            autores: autores, 
            userId: userObj.id,
            
            andar: formData.andar,
            sala: formData.sala,
            armario: formData.armario,
            prateleira: formData.prateleira
        };

        try {
            const resposta = await fetch("http://127.0.0.1:8000/api/tccs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(enviarDados) // Enviamos o objeto mapeado
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                toast.success(resultado.message || "Cadastrado com sucesso!");
                setShowModal(false);
            } else {
                // Se o Laravel devolver erro 500 ou 422, ele cai aqui
                toast.error(resultado.erro || "Erro ao cadastrar");
            }
        } catch (erro) {
            toast.error("Erro na conexão com o servidor");
        }
    };

    //VALIDANDO IMPUTS DO FORMULÁRIO...
    useEffect(() => {
        const carregarDados = async () => {
            try {
                // URL atualizada para o padrão do Laravel
                const resposta = await fetch("http://127.0.0.1:8000/api/tccs/form-data");
                const dados = await resposta.json();

                // O Laravel devolve os nomes das colunas exatamente como estão no Model
                setOpcoesBack(dados);
            } catch (erro) {
                console.error("Erro ao carregar opções:", erro);
            }
        };
        carregarDados();
    }, []);

    useEffect(() => {
        if (formData.areaFormacao && opcoesBack.cursos) {
            const filtrados = opcoesBack.cursos.filter(
                (c) => String(c.area_id) === String(formData.areaFormacao)
            );
            setCursosFiltrados(filtrados);
        } else {
            setCursosFiltrados([]);
        }
    }, [formData.areaFormacao, opcoesBack.cursos]);

    const gerarNotas = () => {
        const notaMaxima = 20;
        const notaMinima = 0;
        const notas = [];

        for (let i = notaMinima; i <= notaMaxima; i++) {
            notas.push(i);
        }
        return notas;
    };

    const gerarAnos = () => {
        const anoAtual = new Date().getFullYear();
        const anoInicio = 2010;
        const anos = [];

        for (let i = anoAtual + 1; i >= anoInicio; i--) {
            anos.push(i);
        }
        return anos;
    };

    return (
        <div>
            <div className="headerRegist">
                <h1>Registar Relatório</h1>
                <p><strong>Adicionar novos relatórios ao sistema</strong></p>
            </div>
            <form onSubmit={handlePreview} className="gridMain">

                <div className="containerRegister">
                    <div className="section-title">
                        <FileIcon />
                        <h3>Dados do trabalho</h3>
                    </div>
                    <div className="divInputs">
                        <div className="inputContainer">
                            <input type="text" name="titulo" value={formData.titulo} placeholder=" " required onChange={handleChange} />
                            <label>Título</label>
                        </div><br />

                        <div className="gridInput">
                            {/* SEÇÃO DINÂMICA DE AUTORES */}
                            <div className="autores-section">
                                {autores.map((nome, index) => (
                                    <div key={index} className="inputContainer autor-item" style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '15px', width: '100%' }}>
                                        <div className="inputContainer" style={{ flex: 1 }}>
                                            <input
                                                type="text"
                                                placeholder=" "
                                                required
                                                value={nome}
                                                onChange={(e) => handleAutorChange(index, e.target.value)}
                                            />
                                            <label>Autor {index + 1}</label>
                                        </div>
                                        {autores.length > 1 && (
                                            <button type="button" onClick={() => removerAutor(index)} className="btn-remove-autor" style={{ marginBottom: '7px' }}>
                                                <CancelAuthor />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={adicionarAutor} className="btn-add-autor">
                                    Adicionar autor
                                </button>
                            </div>
                            <div className="inputContainer">
                                <input type="text" name="orientadorNome" value={formData.orientadorNome} placeholder=" " required onChange={handleChange} />
                                <label>Orientador</label>
                            </div>
                            {/* Selects*/}
                            <div className="inputContainer">
                                <select
                                    name="areaFormacao"
                                    required
                                    value={formData.areaFormacao}
                                    onChange={handleChange}
                                >
                                    <option value="" hidden></option>
                                    {opcoesBack.areas?.map(area => (
                                        <option key={area.idArea} value={area.idArea}>
                                            {area.nomeArea}
                                        </option>
                                    ))}
                                </select>
                                <label>Área de formação</label>
                            </div>
                            <div className="inputContainer">
                                <select
                                    name="curso"
                                    required
                                    value={formData.curso}
                                    onChange={handleChange}
                                    disabled={!formData.areaFormacao}
                                >
                                    <option value=""></option>
                                    {cursosFiltrados.map(curso => (
                                        <option key={curso.idCurso} value={curso.idCurso}> {/* CORRETO: Enviamos o ID */}
                                            {curso.nome}
                                        </option>
                                    ))}
                                </select>
                                <label>Curso</label>
                            </div>
                            <div className="inputContainer">
                                <select name="anoDefesa" required onChange={handleChange} value={formData.anoDefesa}>
                                    <option value="" hidden></option>
                                    {gerarAnos().map((ano) => (
                                        <option key={ano} value={ano}>
                                            {ano}
                                        </option>
                                    ))}
                                </select>
                                <label>Ano da Defesa</label>
                            </div>
                            <div className="inputContainer">
                                <select name="nota" required onChange={handleChange} >
                                    <option value={formData.nota} hidden></option>
                                    {gerarNotas().map((notas) => (
                                        <option key={notas} value={notas}>
                                            {notas}
                                        </option>
                                    ))}
                                </select>
                                <label>Nota Final</label>
                            </div>
                        </div>
                    </div>
                    <span>*todos os campos são obrigatórios</span>
                </div>

                {/* SEÇÃO: LOCALIZAÇÃO */}
                <div className="containerRegister">
                    <div className="section-title">
                        <LocationIcon />
                        <h3>Localização do trabalho</h3>
                    </div>
                    <div className="divInputs">
                        <div className="gridInput">
                            <div className="inputContainer">
                                <select name="andar" required onChange={handleChange}>
                                    <option value="" hidden></option>
                                    <option value="Rés-do-chão">Rés-do-chão</option>
                                    <option value="1º Andar">1º Andar</option>
                                    <option value="2º Andar">2º Andar</option>
                                </select>
                                <label>Andar</label>
                            </div>
                            <div className="inputContainer">
                                <select name="sala" required onChange={handleChange}>
                                    <option value="" hidden></option>
                                    <option value="78">78</option>
                                    <option value="79">79</option>
                                    <option value="80">80</option>
                                </select>
                                <label>Sala</label>
                            </div>
                            <div className="inputContainer">
                                <select name="armario" required onChange={handleChange}>
                                    <option value="" hidden></option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                                <label>Armário</label>
                            </div>
                            <div className="inputContainer">
                                <select name="prateleira" required onChange={handleChange}>
                                    <option value="" hidden></option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                                <label>Prateleira</label>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btnDraft">Visualizar</button>
            </form>

            {/* MODAL DE PRÉ-VISUALIZAÇÃO */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-">
                        <header className="modalHeader">
                            <h2>Confirmar Registo</h2>

                        </header>

                        <div className="preview-body">
                            <p><strong>Título:</strong> {formData.titulo}</p>
                            <p><strong>Autor:</strong> {autores.join(" | ")}</p>
                            <p><strong>Orientador:</strong> {formData.orientadorNome}</p>
                            <p><strong>Área de formação:</strong> {formData.areaFormacao}</p>
                            <p><strong>Curso:</strong> {formData.curso}</p>
                            <p><strong>Ano:</strong> {formData.anoDefesa}</p>
                            <p><strong>Nota Final:</strong> {formData.nota}</p>
                            <p className="current-date"><strong>
                                Data do registo:</strong> {dataHoraAtual}</p>
                            <hr />
                            <p><strong>Andar: </strong>{formData.andar}</p>
                            <p><strong>Sala: </strong> {formData.sala}</p>
                            <p><strong>Armário: </strong>{formData.armario}</p>
                            <p><strong>Prateleira: </strong>{formData.prateleira}</p>

                        </div>

                        <div className="modal-actions">
                            <button className="btn-edit" onClick={() => setShowModal(false)}>
                                Editar
                            </button>
                            <button className="btn-save" onClick={handleFinalRegister}>
                                Registar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


export default RegisterTcc;