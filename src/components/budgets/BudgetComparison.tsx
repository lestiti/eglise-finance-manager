import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useMemo } from "react";

export const BudgetComparison = () => {
  const { data: comparisons } = useQuery({
    queryKey: ['budget-comparisons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budget_reports')
        .select(`
          *,
          department_budgets (
            nom
          )
        `)
        .eq('annee', new Date().getFullYear());
      
      if (error) throw error;
      return data;
    },
    staleTime: 300000, // 5 minutes
    cacheTime: 3600000, // 1 heure
  });

  const chartData = useMemo(() => 
    comparisons?.map(comparison => ({
      name: comparison.department_budgets?.nom,
      prevu: comparison.montant_prevu,
      realise: comparison.montant_realise,
      ecart: comparison.montant_prevu - comparison.montant_realise
    })) || [], 
    [comparisons]
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Comparaison Budget vs Réalisé</h3>
      <Card className="p-4">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toLocaleString()} Ar`} />
              <Legend />
              <Bar dataKey="prevu" name="Budget Prévu" fill="#8884d8" />
              <Bar dataKey="realise" name="Réalisé" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};