import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export const TresoreryOverview = () => {
  const data = [
    { mois: "Jan", entrees: 12000000, sorties: 8000000, solde: 4000000 },
    { mois: "Fév", entrees: 15000000, sorties: 10000000, solde: 5000000 },
    { mois: "Mar", entrees: 13000000, sorties: 11000000, solde: 2000000 },
    { mois: "Avr", entrees: 18000000, sorties: 12000000, solde: 6000000 },
    { mois: "Mai", entrees: 14000000, sorties: 13000000, solde: 1000000 },
    { mois: "Jun", entrees: 16000000, sorties: 11000000, solde: 5000000 },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Flux de Trésorerie</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `${value.toLocaleString()} Ar`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="entrees" 
                name="Entrées"
                stroke="#22c55e" 
                strokeWidth={2} 
              />
              <Line 
                type="monotone" 
                dataKey="sorties" 
                name="Sorties"
                stroke="#ef4444" 
                strokeWidth={2} 
              />
              <Line 
                type="monotone" 
                dataKey="solde" 
                name="Solde"
                stroke="#3b82f6" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};