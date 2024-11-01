import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

export const CharitableActivitiesExpenses = () => {
  const { data: activities } = useQuery({
    queryKey: ['charitable-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('charitable_activities')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const chartData = activities?.map(activity => ({
    name: activity.nom,
    value: Number(activity.depenses_actuelles)
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Dépenses par Activité Caritative</h4>
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
            <Tooltip formatter={(value: number) => `${value.toLocaleString()} Ar`} />
            <Legend />
          </PieChart>
        </div>
      </Card>
    </div>
  );
};