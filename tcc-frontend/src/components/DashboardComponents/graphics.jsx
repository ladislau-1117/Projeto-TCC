import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import "./dashboardInfo.css";

function BarGrafic({ data, title }) {
    if (!data || data.length === 0) return <p>Sem dados para exibir</p>;

    return (
        <div className="graph-container" style={{ width: '100%', height: 300, background: '#fff', padding: '15px', borderRadius: '8px' }}>
            <h4>{title || "Produção de TCCs"}</h4>
            <ResponsiveContainer width="100%" height="100%" style={{ 'marginLeft': "-15px" }}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="var(--cor-primaria)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function CircleGrafic({ data, title }) {
    if (!data || data.length === 0) return <p>Sem dados</p>;

    const COLORS = ["var(--fundo-escuro)", "var(--cor-primaria)"]; 

    return (
        <div className="ContainerGraph">
            <h4>{title || "Projetos: Proporção Individual vs. Coletivo"}</h4>
            <ResponsiveContainer className="graph" width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="45%"
                        innerRadius={65}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export { CircleGrafic, BarGrafic };



