import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export const AnnualOverview = () => {
  const { data: transactions } = useQuery({
    queryKey: ['annual-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('date_transaction', new Date(new Date().getFullYear(), 0, 1).toISOString())
        .lte('date_transaction', new Date(new Date().getFullYear(), 11, 31).toISOString());
      
      if (error) throw error;
      return data;
    }
  });

  const chartData = transactions?.reduce((acc, transaction) => {
    const month = new Date(transaction.date_transaction).getMonth();
    if (!acc[month]) {
      acc[month] = { recettes: 0, depenses: 0 };
    }
    if (transaction.type === 'recette') {
      acc[month].recettes += Number(transaction.montant);
    } else {
      acc[month].depenses += Number(transaction.montant);
    }
    return acc;
  }, {} as Record<number, { recettes: number; depenses: number; }>);

  const formattedData = Object.entries(chartData || {}).map(([month, data]) => ({
    mois: new Date(2024, Number(month)).toLocaleString('fr-FR', { month: 'long' }),
    ...data
  }));

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Bilan Annuel</h4>
      <Card className="p-4">
        <div className="h-[300px]">
          <BarChart
            width={800}
            height={300}
            data={formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mois" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()} Ar`} />
            <Legend />
            <Bar dataKey="recettes" name="Recettes" fill="#22c55e" />
            <Bar dataKey="depenses" name="Dépenses" fill="#ef4444" />
          </BarChart>
        </div>
      </Card>
    </div>
  );
};