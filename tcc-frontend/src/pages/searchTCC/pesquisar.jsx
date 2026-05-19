import React, { useState, useEffect } from "react";
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

    // Estados de filtros...
    const [filtros, setFiltros] = useState({
        ano: "",
        curso: "",
        notaMin: 0,
        notaMax: 20
    });


    // 3. Lógica Unificada de Busca e Paginação
    useEffect(() => {
        const carregarDados = async () => {
            setLoading(true);
            try {
                // Usamos o axios para fazer o pedido GET limpo
                const resposta = await axios.get("http://127.0.0.1:8000/api/tccs", {
                    params: {
                        page: pagina,
                        query: termoBusca
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

        // delay de meio segundo na pesquisa automática
        const delayDebounceFn = setTimeout(() => {
            carregarDados();
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [pagina, termoBusca, filtros]);

    // --- FUNÇÕES DE INTERAÇÃO ---

    const prepararEdicao = async (tcc) => {
        try {
            // Busca os dados ultra completos e reais do relatório
            const resposta = await axios.get(`http://127.0.0.1:8000/api/tccs/${tcc.idTcc}`);

            if (resposta.data) {
                // Unifica os dados do TCC e os autores para o ModalEditTcc ler perfeitamente
                const tccCompleto = {
                    ...resposta.data.tcc,
                    listaAutores: resposta.data.autores // Passa a lista real de autores
                };
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

    const handleUpdateSuccess = () => {
        setShowEditModal(false);
        // Resetamos para a página 1 para ver as alterações
        setPagina(1);
        setTermoBusca(termoBusca);
    };

    const handleConfirmDelete = async () => {
        try {
            const userStorage = sessionStorage.getItem('user');
            const userObj = JSON.parse(userStorage);
            const userId = userObj.idUtilizador || userObj.id;

            // Chamada direta para a nova API do Laravel
            await axios.delete(`http://127.0.0.1:8000/api/tccs/${tccSelecionado.idTcc}`, {
                params: { userId: userId }
            });

            // Remove localmente para dar feedback visual instantâneo
            setTccs(prev => prev.filter(item => item.idTcc !== tccSelecionado.idTcc));

            setShowDeleteModal(false);
            setShowDetailsModal(false);
            toast.success("Relatório removido com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao apagar o relatório no servidor Laravel.");
        }
    };

    return (
        <div className="pesquisa-page-container">
            <div className="headerSearch">
                <h1>Pesquisar Relatórios</h1>
                <p><strong>Explore e consulte todos os relatórios do sistema</strong></p>
            </div>

            <SearchBar
                query={termoBusca}
                setQuery={(val) => {
                    setTermoBusca(val);
                    setPagina(1); // Sempre que pesquisar, volta para a página 1
                }}
                onSearch={() => { }}
            />

            <ShowResult
                items={tccs} // Agora usa o estado unificado 'tccs'
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

            {/* Modais */}
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