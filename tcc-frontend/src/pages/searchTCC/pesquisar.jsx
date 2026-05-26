import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import SearchBar from "../../components/Search/SearchBar/searchBar";
import ShowResult from "../../components/Search/SearchResult/ShowResult";
import toast from "react-hot-toast";
import DeleteModal from "../../components/common/divConfirmDelete";
import ModalDetailsTcc from "../../components/Modal/ModalDetalhesTcc";
import ModalEditTcc from "../../components/Modal/ModalEditTcc/EditTcc";

import "./pesquisa.css";

function SearchPage() {
    // 1. Estados de Dados e Navegação
    const [tccs, setTccs] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [termoBusca, setTermoBusca] = useState("");
    const [loading, setLoading] = useState(false);

    // 2. Estados para os Modais
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [tccSelecionado, setTccSelecionado] = useState(null);

    // Estados de filtros atualizado (Adicionado tipoTrabalho e ajustado notas padrão do IPIL)
    const [filtros, setFiltros] = useState({
        ano: "todos",
        curso: "todos",
        tipoTrabalho: "todos",
        notaMin: 10,
        notaMax: 20
    });



    const cursosUnicos = useMemo(() => {
        const cursosMap = new Map();

        tccs.forEach((tcc) => {
            const id = String(tcc.idCurso || "").trim();
            const nome = String(tcc.curso || "").trim();
            const key = nome.toLowerCase();

            if (nome && !cursosMap.has(key)) {
                cursosMap.set(key, { id, nome });
            }
        });

        return Array.from(cursosMap.values());
    }, [tccs]);

    // 3. Lógica Unificada de Busca e Paginação (AGORA COM OS FILTROS LIGADOS)
    useEffect(() => {
        const carregarDados = async () => {
            setLoading(true);
            try {
                const resposta = await axios.get("http://127.0.0.1:8000/api/tccs", {
                    params: {
                        page: pagina,
                        query: termoBusca,
                        ano: filtros.ano,
                        curso_id: filtros.curso,
                        tipo_trabalho: filtros.tipoTrabalho,
                        nota_min: filtros.notaMin,
                        nota_max: filtros.notaMax
                    }
                });

                if (resposta.data && resposta.data.tccs) {
                    setTccs(resposta.data.tccs);
                    setTotalPaginas(resposta.data.totalPaginas);
                } else {
                    setTccs([]);
                    setTotalPaginas(0);
                }
            } catch (error) {
                console.error("Erro detalhado:", error);
                toast.error("Erro ao conectar com o servidor Laravel.");
            } finally {
                setLoading(false);
            }
        };

        // delay de um segundo na pesquisa automática
        const delayDebounceFn = setTimeout(() => {
            carregarDados();
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [pagina, termoBusca, filtros]); // Executa sempre que mudar a página, o texto ou qualquer filtro!

    // --- FUNÇÕES DE AJUSTE DOS FILTROS ---
    const handleFiltroChange = (campo, valor) => {
        setFiltros(prev => ({ ...prev, [campo]: valor }));
        setPagina(1); // Sempre que mudar um filtro, reseta para a página 1
    };

    const handleNotaMin = (e) => {
        const valor = Math.min(Number(e.target.value), filtros.notaMax);
        handleFiltroChange("notaMin", valor);
    };

    const handleNotaMax = (e) => {
        const valor = Math.max(Number(e.target.value), filtros.notaMin);
        handleFiltroChange("notaMax", valor);
    };

    // --- FUNÇÕES DE INTERAÇÃO (Mantidas 100% originais) ---
    const prepararEdicao = async (tcc) => {
        try {
            const resposta = await axios.get(`http://127.0.0.1:8000/api/tccs/${tcc.idTcc}`);
            if (resposta.data) {
                const tccCompleto = { ...resposta.data, listaAutores: resposta.data.autores };
                setTccSelecionado(tccCompleto);
                setShowEditModal(true);
                setShowDetailsModal(false);
            }
        } catch (error) {
            toast.error("Erro ao carregar os dados reais para edição.");
        }
    };

    const visualizarDetalhes = (tcc) => {
        setTccSelecionado(tcc);
        setShowDetailsModal(true);
    };

    const confirmarExclusao = (tcc) => {
        setTccSelecionado(tcc);
        setShowDeleteModal(true);
    };

    const handleUpdateSuccess = async () => {
        setShowEditModal(false);
        setPagina(1); // Força a atualização voltando à página 1
    };

    const handleConfirmDelete = async () => {
        try {
            const userStorage = sessionStorage.getItem('user');
            const userObj = JSON.parse(userStorage);
            const userId = userObj.idUtilizador || userObj.id;

            await axios.delete(`http://127.0.0.1:8000/api/tccs/${tccSelecionado.idTcc}`, {
                params: { userId: userId }
            });

            setTccs(prev => prev.filter(item => item.idTcc !== tccSelecionado.idTcc));
            setShowDeleteModal(false);
            setShowDetailsModal(false);
            toast.success("Relatório removido com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao apagar o relatório.");
        }
    };

    return (
        <div className="pesquisa-page-container">
            <div className="headerSearch">
                <h1>Pesquisar Relatórios</h1>
                <p><strong>Explore e consulte todos os relatórios do sistema</strong></p>
            </div>

            {/* Renderiza a tua barra de busca de texto */}
            <SearchBar
                query={termoBusca}
                setQuery={(val) => {
                    setTermoBusca(val);
                    setPagina(1);
                }}
                onSearch={() => { }}
            />

            {/* A Tua Nova Barra Horizontal de Filtros Organizada */}
            {/* A Tua Barra Horizontal de Filtros Super Tunada */}
            <div className="barra-filtros-horizontal">

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

                {/* Filtro de Curso Atualizado (Buscando direto dos TCCs carregados) */}
                <div className="filtro-item">
                    <label>Curso</label>
                    <select value={filtros.curso} onChange={(e) => handleFiltroChange("curso", e.target.value)}>
                        <option value="todos">Todos os Cursos</option>
                        {cursosUnicos.map(c => (
                            <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                    </select>
                </div>

                {/* Filtro de Estrutura */}
                <div className="filtro-item">
                    <label>Formação</label>
                    <select value={filtros.tipoTrabalho} onChange={(e) => handleFiltroChange("tipoTrabalho", e.target.value)}>
                        <option value="todos">Todos os Trabalhos</option>
                        <option value="individual">Trabalho Individual</option>
                        <option value="grupo">Em Grupo</option>
                    </select>
                </div>

                {/* Range Slider Estilo Premium (Igual à imagem roxa) */}
                <div className="filtro-item range-container-item">
                    <label>Nota IPIL</label>

                    <div className="range-slider-duplo-wrapper">
                        {/* Indicadores numéricos flutuantes que acompanham as bolinhas */}
                        <div className="range-valores-flutuantes">
                            <span
                                className="valor-balao"
                                style={{ left: `${((filtros.notaMin - 10) / 10) * 100}%` }}
                            >
                                {filtros.notaMin}v
                            </span>
                            <span
                                className="valor-balao"
                                style={{ left: `${((filtros.notaMax - 10) / 10) * 100}%` }}
                            >
                                {filtros.notaMax}v
                            </span>
                        </div>

                        <div
                            className="range-pista-background"
                            style={{
                                background: `linear-gradient(to right, 
                        var(--fundo-claro) ${((filtros.notaMin - 10) / 10) * 100}%, 
                        var(--cor-primaria) ${((filtros.notaMin - 10) / 10) * 100}%, 
                        var(--cor-primaria) ${((filtros.notaMax - 10) / 10) * 100}%, 
                        var(--fundo-claro) ${((filtros.notaMax - 10) / 10) * 100}%)`
                            }}
                        >
                            <input
                                type="range"
                                min="10"
                                max="20"
                                value={filtros.notaMin}
                                onChange={handleNotaMin}
                                className="input-range-slider low-range"
                            />
                            <input
                                type="range"
                                min="10"
                                max="20"
                                value={filtros.notaMax}
                                onChange={handleNotaMax}
                                className="input-range-slider high-range"
                            />
                        </div>

                        {/* Limites estáticos nas pontas (0 e 20) */}
                        <div className="range-limites-as-pontas">
                            <span>10</span>
                            <span>20</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Exibição dos Resultados */}
            <ShowResult
                items={tccs}
                onEdit={prepararEdicao}
                onDeleteClick={confirmarExclusao}
                onDetailsClick={visualizarDetalhes}
                loading={loading}
                query={termoBusca}
            />

            {/* Paginação Estilo Catálogo */}
            {totalPaginas > 1 && (
                <div className="pagination-wrapper">
                    <button
                        className="pag-btn"
                        disabled={pagina === 1}
                        onClick={() => { setPagina(p => p - 1); window.scrollTo(0, 0); }}
                    >
                        &laquo; Anterior
                    </button>

                    <span className="page-indicator">
                        Página <strong>{pagina}</strong> de {totalPaginas}
                    </span>

                    <button
                        className="pag-btn"
                        disabled={pagina >= totalPaginas}
                        onClick={() => { setPagina(p => p + 1); window.scrollTo(0, 0); }}
                    >
                        Próximo &raquo;
                    </button>
                </div>
            )}

            {/* Modais Originais Mantidos */}
            <ModalDetailsTcc
                show={showDetailsModal}
                tcc={tccSelecionado}
                onClose={() => setShowDetailsModal(false)}
                onDelete={confirmarExclusao}
                onEdit={prepararEdicao}
            />

            <ModalEditTcc
                show={showEditModal}
                tcc={tccSelecionado}
                onClose={() => setShowEditModal(false)}
                onSave={handleUpdateSuccess}
            />

            <DeleteModal
                show={showDeleteModal}
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                tccTitulo={tccSelecionado ? (tccSelecionado.tituloTcc || tccSelecionado.titulo) : ''}
            />
        </div>
    );
}

export default SearchPage;