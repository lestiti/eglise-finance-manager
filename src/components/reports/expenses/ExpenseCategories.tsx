import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatAmount } from "@/lib/utils";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

export const ExpenseCategories = () => {
  const { data: transactions } = useQuery({
    queryKey: ['expense-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('description, montant')
        .eq('type', 'depense')
        .gte('date_transaction', new Date(new Date().getFullYear(), 0, 1).toISOString());
      
      if (error) throw error;
      return data;
    }
  });

  const categories = {
    'Administration': ['salaires', 'fournitures', 'bureautique'],
    'Entretien': ['maintenance', 'réparation', 'nettoyage'],
    'Activités': ['jeunesse', 'musique', 'événements'],
    'Services': ['électricité', 'eau', 'internet'],
    'Social': ['aide', 'soutien', 'dons'],
  };

  const categoryData = transactions?.reduce((acc, transaction) => {
    const category = Object.entries(categories).find(([_, keywords]) =>
      keywords.some(keyword => 
        transaction.description?.toLowerCase().includes(keyword)
      )
    )?.[0] || 'Autres';
    
    acc[category] = (acc[category] || 0) + Number(transaction.montant);
    return acc;
  }, {} as Record<string, number>) || {};

  const chartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Catégorisation des Dépenses</h4>
      <Card className="p-4">
        <div className="h-[300px] w-full flex justify-center items-center">
          <PieChart width={400} height={300}>
            <Pie
              data={chartData}
              cx={200}
              cy={150}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatAmount(value)} />
            <Legend />
          </PieChart>
        </div>
      </Card>
    </div>
  );
};