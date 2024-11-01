import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const CashFlowForecast = () => {
  const { data: transactions } = useQuery({
    queryKey: ['treasury-forecast'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('date_transaction', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());
      
      if (error) throw error;
      return data;
    }
  });

  const forecastData = Array.from({ length: 3 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() + i);
    return {
      mois: month.toLocaleString('fr-FR', { month: 'long' }),
      entrees: Math.random() * 10000000,
      sorties: Math.random() * 8000000,
      solde: Math.random() * 2000000
    };
  });

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Prévisions de Trésorerie</h4>
      <Card className="p-4">
        <div className="h-[300px]">
          <BarChart
            width={800}
            height={300}
            data={forecastData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mois" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()} Ar`} />
            <Legend />
            <Bar dataKey="entrees" name="Entrées Prévues" fill="#22c55e" />
            <Bar dataKey="sorties" name="Sorties Prévues" fill="#ef4444" />
            <Bar dataKey="solde" name="Solde Prévu" fill="#3b82f6" />
          </BarChart>
        </div>
      </Card>
    </div>
  );
};