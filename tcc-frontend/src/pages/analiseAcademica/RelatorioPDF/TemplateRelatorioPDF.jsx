import React from "react";
import "./TemplateRelatorioPDF.css";

function TemplateRelatorioPDF({ totalizadores, dadosOrientadores, dadosExcelencia, dadosEstruturaTipo, filtros, listaCursos }) {
    // Descobrir o nome do curso selecionado para colocar no cabeçalho
    const nomeCursoFiltrado = filtros.curso === "todos" 
        ? "Todos os Cursos" 
        : listaCursos.find(c => String(c.idCurso || c.id) === String(filtros.curso))?.nome || "Curso Específico";

    const tipoTrabalhoTexto = filtros.tipoTrabalho === "todos" ? "Todos os Formatos" : 
                             filtros.tipoTrabalho === "individual" ? "Trabalhos Individuais" : "Em Grupo";

    // Data de emissão formatada
    const dataEmissao = new Date().toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    return (
        <div className="folha-a4-container">
            {/* 1. CABEÇALHO INSTITUCIONAL */}
            <div className="pdf-header-formal">
                <div className="pdf-logo-placeholder">IPIL</div>
                <div className="pdf-header-texto">
                    <h2>INSTITUTO POLITÉCNICO INDUSTRIAL DE LUANDA</h2>
                    <h3>Coordenação de Informática</h3>
                    <p>Sistema de Gestão de Acervo Digital — Relatório Estatístico</p>
                </div>
            </div>

            <hr className="pdf-linha-divisoria" />

            {/* 2. METADADOS E CONTEXTO DOS FILTROS */}
            <div className="pdf-meta-dados">
                <div><strong>Data de Emissão:</strong> {dataEmissao}</div>
                <div><strong>Filtros:</strong> Ano: {filtros.ano === "todos" ? "Global" : filtros.ano} | {nomeCursoFiltrado} | {tipoTrabalhoTexto}</div>
            </div>

            <h4 className="pdf-titulo-seccao">1. Indicadores Gerais Reatados</h4>
            
            {/* 3. OS QUATRO CARDES EM FORMATO DE TABELA COMPACTA */}
            <table className="pdf-tabela-kpi">
                <tbody>
                    <tr>
                        <td><strong>Total de TCCs:</strong> {totalizadores?.totalTccs || 0} registos</td>
                        <td><strong>Média Geral de Notas:</strong> {totalizadores?.mediaNotas || 0} / 20v</td>
                    </tr>
                    <tr>
                        <td><strong>Curso Líder no Contexto:</strong> {totalizadores?.cursoLider || "Nenhum"}</td>
                        <td><strong>Orientador Mais Ativo:</strong> {totalizadores?.orientadorMaisAtivo?.nome || "Nenhum"} ({totalizadores?.orientadorMaisAtivo?.quantidade || 0} orientações)</td>
                    </tr>
                </tbody>
            </table>

            {/* 4. ANÁLISE DE PROPORÇÃO DE TRABALHOS */}
            <h4 className="pdf-titulo-seccao" style={{ marginTop: "30px" }}>2. Distribuição por Formato de Trabalho</h4>
            <table className="pdf-tabela-dados">
                <thead>
                    <tr>
                        <th>Formato de Organização</th>
                        <th style={{ textAlign: "center" }}>Quantidade de Projetos</th>
                        <th style={{ textAlign: "center" }}>Alunos Envolvidos</th>
                        <th style={{ textAlign: "center" }}>Média Final de Notas</th>
                    </tr>
                </thead>
                <tbody>
                    {dadosEstruturaTipo?.tabela?.map((row, idx) => (
                        <tr key={idx}>
                            <td><strong>{row.tipo}</strong></td>
                            <td style={{ textAlign: "center" }}>{row.quantidade}</td>
                            <td style={{ textAlign: "center" }}>{row.alunosEnvolvidos}</td>
                            <td style={{ textAlign: "center" }} className="pdf-txt-destaque">{row.media} v.</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 5. TOP ORIENTADORES */}
            <h4 className="pdf-titulo-seccao" style={{ marginTop: "30px" }}>3. Desempenho e Eficiência de Orientação (Top 5)</h4>
            <table className="pdf-tabela-dados">
                <thead>
                    <tr>
                        <th>Nome do Docente Orientador</th>
                        <th style={{ textAlign: "center" }}>Total de TCCs Concluídos</th>
                        <th style={{ textAlign: "center" }}>Média de Notas do Grupo</th>
                    </tr>
                </thead>
                <tbody>
                    {dadosExcelencia?.slice(0, 5).map((row, idx) => (
                        <tr key={idx}>
                            <td>{idx + 1}. {row.nome}</td>
                            <td style={{ textAlign: "center" }}>{row.totalTrabalhos}</td>
                            <td style={{ textAlign: "center" }} className="pdf-txt-destaque">{row.mediaNotas} v.</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 6. ASSINATURA FORMAL NO RODAPÉ */}
            <div className="pdf-rodape-assinatura">
                <div className="pdf-linha-assinatura"></div>
                <p>A Coordenação do Curso de Informática</p>
                <p className="pdf-txt-miudo">Documento gerado internamente pelo Sistema de Acervo Digital do IPIL.</p>
            </div>
        </div>
    );
}

export default TemplateRelatorioPDF;