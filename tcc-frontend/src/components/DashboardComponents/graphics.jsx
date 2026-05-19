import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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

function CircleGrafic({ data, title, label1, label2 }) {
    // Mesma lógica: 'data' já é o array circleData
    if (!data || data.length === 0) return <p>Sem dados</p>;

    const COLORS = ['var(--cor-primaria)', 'var(--fundo-escuro)', '#252525', '#cc7626'];

    return (
        <div className="ContainerGraph">
            <h4>{title || "Tipo de trabalhos"}</h4>
            <ResponsiveContainer className="graph" width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={data}
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                        nameKey="name"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>

            <div style={{ display: "flex", flexDirection: 'column', marginTop: '-30px' }}>
                <div style={{ display: 'flex' }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: '50%', background: 'var(--cor-primaria)' }}></div>
                    <span>{label1 || "Trabalhos em Grupo"}</span>
                </div>
                <div style={{ display: 'flex' }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: '50%', background: 'var(--fundo-escuro)' }}></div>
                    <span>{label2 || "Trabalhos individuais"}</span>
                </div>
            </div>
        </div>
    );
}

export { CircleGrafic, BarGrafic };



