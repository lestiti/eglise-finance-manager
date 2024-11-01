import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatAmount } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export const BudgetComparison = () => {
  const { data: budgets } = useQuery({
    queryKey: ['department-budgets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('department_budgets')
        .select('*')
        .eq('annee', new Date().getFullYear());
      
      if (error) throw error;
      return data;
    }
  });

  const { data: expenses } = useQuery({
    queryKey: ['department-expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', 'depense')
        .gte('date_transaction', new Date(new Date().getFullYear(), 0, 1).toISOString());
      
      if (error) throw error;
      return data;
    }
  });

  const departmentExpenses = expenses?.reduce((acc, expense) => {
    const dept = expense.description?.split('-')[0]?.trim() || 'Autre';
    acc[dept] = (acc[dept] || 0) + Number(expense.montant);
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Comparatif Budget vs. Dépenses Réelles</h4>
      <div className="space-y-6">
        {budgets?.map((budget) => {
          const depenses = departmentExpenses[budget.nom] || 0;
          const pourcentage = (depenses / Number(budget.budget_annuel)) * 100;
          
          return (
            <Card key={budget.id} className="p-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{budget.nom}</span>
                <span className="text-sm text-gray-500">
                  {formatAmount(depenses)} / {formatAmount(Number(budget.budget_annuel))}
                </span>
              </div>
              <Progress value={pourcentage} className="h-2" />
              <div className="mt-2 text-sm text-gray-500 flex justify-between">
                <span>{pourcentage.toFixed(1)}% utilisé</span>
                <span className={pourcentage > 100 ? "text-red-500" : "text-green-500"}>
                  {pourcentage > 100 ? "Dépassement" : "Dans le budget"}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};