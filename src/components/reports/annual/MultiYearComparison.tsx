import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface FinancialData {
  data: {
    recettes_totales: number;
    depenses_totales: number;
    resultat_net: number;
  };
  annee: number;
}

const isFinancialDataArray = (data: unknown[]): data is FinancialData[] => {
  return data.every(item => {
    if (typeof item !== 'object' || item === null) return false;
    const d = item as Partial<FinancialData>;
    return (
      typeof d.annee === 'number' &&
      typeof d.data === 'object' &&
      d.data !== null &&
      typeof (d.data as any).recettes_totales === 'number' &&
      typeof (d.data as any).depenses_totales === 'number' &&
      typeof (d.data as any).resultat_net === 'number'
    );
  });
};

export const MultiYearComparison = () => {
  const { data: statements } = useQuery({
    queryKey: ['financial-statements-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_statements')
        .select('*')
        .eq('type', 'annuel')
        .order('annee', { ascending: true })
        .limit(5);
      
      if (error) throw error;
      if (!data || !Array.isArray(data) || !isFinancialDataArray(data)) {
        return [];
      }
      return data;
    }
  });

  const chartData = statements?.map(statement => ({
    annee: statement.annee,
    recettes: statement.data.recettes_totales,
    depenses: statement.data.depenses_totales,
    resultat: statement.data.resultat_net
  })) || [];

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Comparatif Pluriannuel</h4>
      <Card className="p-4">
        <div className="h-[300px]">
          <LineChart
            width={800}
            height={300}
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="annee" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()} Ar`} />
            <Legend />
            <Line type="monotone" dataKey="recettes" name="Recettes" stroke="#22c55e" />
            <Line type="monotone" dataKey="depenses" name="Dépenses" stroke="#ef4444" />
            <Line type="monotone" dataKey="resultat" name="Résultat Net" stroke="#3b82f6" />
          </LineChart>
        </div>
      </Card>
    </div>
  );
};