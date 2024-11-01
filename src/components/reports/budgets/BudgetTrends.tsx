import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface BudgetData {
  montant_alloue: number;
  montant_utilise: number;
  mois: number;
  annee: number;
}

interface BudgetTrendsProps {
  data: BudgetData[];
}

export const BudgetTrends = ({ data }: BudgetTrendsProps) => {
  const monthlyData = data.reduce((acc, curr) => {
    const key = `${curr.annee}-${curr.mois}`;
    if (!acc[key]) {
      acc[key] = {
        date: `${curr.mois}/${curr.annee}`,
        alloue: 0,
        utilise: 0
      };
    }
    acc[key].alloue += Number(curr.montant_alloue);
    acc[key].utilise += Number(curr.montant_utilise);
    return acc;
  }, {} as Record<string, { date: string; alloue: number; utilise: number; }>);

  const chartData = Object.values(monthlyData).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Tendances Budgétaires</h4>
      <Card className="p-4">
        <div className="h-[300px]">
          <LineChart
            width={800}
            height={300}
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()} Ar`} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="alloue" 
              name="Budget Alloué" 
              stroke="#8884d8" 
            />
            <Line 
              type="monotone" 
              dataKey="utilise" 
              name="Budget Utilisé" 
              stroke="#82ca9d" 
            />
          </LineChart>
        </div>
      </Card>
    </div>
  );
};