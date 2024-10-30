import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const DashboardCharts = () => {
  const data = [
    { name: "Jan", dons: 4000, depenses: 2400 },
    { name: "Fév", dons: 3000, depenses: 1398 },
    { name: "Mar", dons: 2000, depenses: 9800 },
    { name: "Avr", dons: 2780, depenses: 3908 },
    { name: "Mai", dons: 1890, depenses: 4800 },
    { name: "Jun", dons: 2390, depenses: 3800 },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Évolution Financière</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="dons" stroke="#4f46e5" strokeWidth={2} />
            <Line type="monotone" dataKey="depenses" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};