import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const DashboardCharts = () => {
  const { data: transactions } = useQuery({
    queryKey: ['dashboard-transactions'],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('date_transaction', startDate.toISOString())
        .order('date_transaction', { ascending: true });
      
      if (error) throw error;

      const monthlyData = data.reduce((acc: Record<string, { dons: number, depenses: number }>, transaction) => {
        const month = new Date(transaction.date_transaction).toLocaleString('fr-FR', { month: 'short' });
        if (!acc[month]) {
          acc[month] = { dons: 0, depenses: 0 };
        }
        
        if (transaction.type === 'don') {
          acc[month].dons += Number(transaction.montant);
        } else if (transaction.type === 'depense') {
          acc[month].depenses += Number(transaction.montant);
        }
        
        return acc;
      }, {});

      return Object.entries(monthlyData).map(([month, values]) => ({
        month,
        ...values
      }));
    }
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Évolution Financière</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={transactions || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => `${value.toLocaleString()} Ar`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="dons" 
              name="Dons" 
              stroke="#22c55e" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="depenses" 
              name="Dépenses" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};