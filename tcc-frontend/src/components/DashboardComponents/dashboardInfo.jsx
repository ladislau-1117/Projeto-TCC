import "./dashboardInfo.css";
import { BookIcon, InsertIcon, GraficIcon } from "../../assets/icons";
import { BarGrafic, CircleGrafic } from "./graphics"; 
import TableHistoricMov from "../Historic/tableHistóricMov";

// Sub-componente para os Cards Individuais
const InfoCard = ({ title, value, icon, unit = "" }) => (
  <div className="divDashInfo">
    <h3>{title}</h3>
    <div>
      <h3>{value} {unit}</h3>
      {icon}
    </div>
  </div>
);

function DashInfo({ dados, graphData }) {
  return (
    <>
      <div className="infoMain">
        <InfoCard 
          title="Total de Relatórios" 
          value={dados.totalRelatorios} 
          icon={<BookIcon />} 
        />
        <InfoCard 
          title="Cadastrados Este Ano" 
          value={dados.totalAno} 
          icon={<InsertIcon />} 
        />
        <InfoCard 
          title="Curso Líder" 
          value={dados.cursoLider} 
          icon={<GraficIcon />} 
        />
      </div>

      <DashGraficos graficData={graphData} />

      <div className="sectionHistoric">
        <h3>Histórico de movimentações</h3>
        <TableHistoricMov />
      </div>
    </>
  );
}

function DashGraficos({ graficData }) {
  return (
    <div className="graficosMain">
      <div className="graficoBox">
        <BarGrafic data={graficData.barData} />
      </div>
      <div className="graficoBox">
        <CircleGrafic
          data={graficData.circleData}
          title="Projetos: Proporção Individual vs. Coletivo"
        />
      </div>
    </div>
  );
}

export default DashInfo;