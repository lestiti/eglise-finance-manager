import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export const CharitableFunding = () => {
  const { data: donations } = useQuery({
    queryKey: ['charitable-donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('type', 'caritatif');
      
      if (error) throw error;
      return data;
    }
  });

  const chartData = donations?.reduce((acc, donation) => {
    const source = donation.source;
    if (!acc[source]) {
      acc[source] = 0;
    }
    acc[source] += Number(donation.montant);
    return acc;
  }, {} as Record<string, number>);

  const formattedData = Object.entries(chartData || {}).map(([source, montant]) => ({
    source,
    montant
  }));

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Sources de Financement Caritatif</h4>
      <Card className="p-4">
        <div className="h-[300px]">
          <BarChart
            width={600}
            height={300}
            data={formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()} Ar`} />
            <Legend />
            <Bar dataKey="montant" name="Montant" fill="#8884d8" />
          </BarChart>
        </div>
      </Card>
    </div>
  );
};