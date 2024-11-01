import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const BudgetReport = () => {
  const { data: budgetData, isLoading, error } = useQuery({
    queryKey: ['budget-tracking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budget_tracking')
        .select(`
          *,
          department_budgets (
            nom,
            budget_annuel,
            budget_mensuel
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>Chargement des données budgétaires...</div>;
  
  if (error) return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Erreur lors du chargement des données budgétaires
      </AlertDescription>
    </Alert>
  );

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Rapport Budgétaire</h3>
      <div className="space-y-4">
        {budgetData?.map((budget) => (
          <div key={budget.id} className="border-b pb-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {budget.department_budgets?.nom || 'Département non spécifié'}
              </span>
              <span className="text-sm text-gray-500">
                {budget.montant_utilise.toLocaleString()} Ar / {budget.montant_alloue.toLocaleString()} Ar
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};