import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export const TresoreryForecast = () => {
  const data = [
    { 
      mois: "Juil", 
      dons_prevus: 15000000,
      depenses_prevues: 12000000,
      solde_prevu: 3000000
    },
    { 
      mois: "Août", 
      dons_prevus: 14000000,
      depenses_prevues: 13000000,
      solde_prevu: 1000000
    },
    { 
      mois: "Sept", 
      dons_prevus: 16000000,
      depenses_prevues: 11000000,
      solde_prevu: 5000000
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Prévisions sur 3 mois</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `${value.toLocaleString()} Ar`}
              />
              <Legend />
              <Bar 
                dataKey="dons_prevus" 
                name="Dons Prévus" 
                fill="#22c55e" 
              />
              <Bar 
                dataKey="depenses_prevues" 
                name="Dépenses Prévues" 
                fill="#ef4444" 
              />
              <Bar 
                dataKey="solde_prevu" 
                name="Solde Prévu" 
                fill="#3b82f6" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};