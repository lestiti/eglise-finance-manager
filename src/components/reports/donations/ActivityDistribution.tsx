import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatAmount } from "@/lib/utils";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

export const ActivityDistribution = () => {
  const { data: donations } = useQuery({
    queryKey: ['donations-by-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('activite, montant')
        .not('activite', 'is', null)
        .gte('date_don', new Date(new Date().getFullYear(), 0, 1).toISOString());
      
      if (error) throw error;
      return data;
    }
  });

  const activityData = donations?.reduce((acc, donation) => {
    if (donation.activite) {
      acc[donation.activite] = (acc[donation.activite] || 0) + Number(donation.montant);
    }
    return acc;
  }, {} as Record<string, number>) || {};

  const chartData = Object.entries(activityData).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Distribution par Activité</h4>
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