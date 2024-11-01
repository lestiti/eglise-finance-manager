import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatAmount } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export const MonthlyAnalysis = () => {
  const { data: donations } = useQuery({
    queryKey: ['donations-monthly'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('date_don, montant')
        .gte('date_don', new Date(new Date().getFullYear(), 0, 1).toISOString());
      
      if (error) throw error;
      return data;
    }
  });

  const monthlyData = donations?.reduce((acc, donation) => {
    const month = new Date(donation.date_don).getMonth();
    acc[month] = (acc[month] || 0) + Number(donation.montant);
    return acc;
  }, {} as Record<number, number>) || {};

  const chartData = Array.from({ length: 12 }, (_, i) => ({
    name: new Date(2024, i).toLocaleString('fr-FR', { month: 'long' }),
    montant: monthlyData[i] || 0
  }));

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Analyse Mensuelle</h4>
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
            <Bar dataKey="montant" fill="#8884d8" name="Montant des dons" />
          </BarChart>
        </div>
      </Card>
    </div>
  );
};