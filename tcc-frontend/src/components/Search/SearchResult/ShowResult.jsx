import { TccCard } from '../goSearch/goSearch';
import { SearchNotFoundIcon } from '../../../assets/icons';
import CircleLoad from '../../common/CircleLoad';
import './showResult.css';


function ShowResult({tcc, items, loading, query, onDeleteClick, onDetailsClick, onEdit, hasSearched }) {

    const safeItems = Array.isArray(items) ? items : [];
    // Se estiver a carregar, mostra apenas a mensagem de espera
    if (loading) {
        return (
            <div className="loader-container">
                <CircleLoad mensagem="Consultando o acervo..." />
            </div>
        )
    }


    if (hasSearched && (!items || items.length === 0)) {
        return (
            <div className='divTccNotFound'>
                <div className='tccNotFound'>
                    <SearchNotFoundIcon />
                    <h1>Nenhum item encontrado</h1>
                    <p>Não existem relatórios para "<strong>{query}</strong>"</p>
                </div>
            </div>
        );
    }

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <div className="resultsContainer" >
            {/* Título Dinâmico com Contador */}
            <div className="results-header" >
                <p><strong>{items.length}</strong> {items.length === 1 ? 'Resultado encontrado' : 'Resultados encontrados'}</p>

            </div>

            <div className="tccResults">
                {items.map((tcc, index) => (
    <TccCard 
        key={tcc.idTcc || index} 
        tcc={tcc} 
        onEdit={onEdit}
        onDelete={onDeleteClick} 
        onDetails={onDetailsClick}
    />
))}
            </div>
        </div>
    );
};





export default ShowResult;