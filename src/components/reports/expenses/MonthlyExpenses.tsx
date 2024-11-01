import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatAmount } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export const MonthlyExpenses = () => {
  const { data: transactions } = useQuery({
    queryKey: ['monthly-expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('date_transaction, montant, type')
        .eq('type', 'depense')
        .gte('date_transaction', new Date(new Date().getFullYear(), 0, 1).toISOString());
      
      if (error) throw error;
      return data;
    }
  });

  const monthlyData = transactions?.reduce((acc, transaction) => {
    const month = new Date(transaction.date_transaction).getMonth();
    acc[month] = (acc[month] || 0) + Number(transaction.montant);
    return acc;
  }, {} as Record<number, number>) || {};

  const chartData = Array.from({ length: 12 }, (_, i) => ({
    name: new Date(2024, i).toLocaleString('fr-FR', { month: 'long' }),
    montant: monthlyData[i] || 0
  }));

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Dépenses Mensuelles</h4>
      <Card className="p-4">
        <div className="h-[300px] w-full">
          <BarChart
            width={800}
            height={300}
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => formatAmount(value)} />
            <Tooltip formatter={(value: number) => formatAmount(value)} />
            <Legend />
            <Bar dataKey="montant" fill="#ef4444" name="Montant des dépenses" />
          </BarChart>
        </div>
      </Card>
    </div>
  );
};