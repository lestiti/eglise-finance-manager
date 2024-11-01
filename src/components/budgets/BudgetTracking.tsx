import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const BudgetTracking = () => {
  const { data: budgetReports } = useQuery({
    queryKey: ['budget-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budget_reports')
        .select(`
          *,
          department_budgets (
            nom,
            budget_annuel
          ),
          financial_statements (
            type,
            periode
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Suivi Budgétaire</h3>
      {budgetReports?.map((report) => {
        const ecart = report.montant_prevu - report.montant_realise;
        const pourcentage = (report.montant_realise / report.montant_prevu) * 100;
        const isOverBudget = ecart < 0;

        return (
          <Card key={report.id} className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">{report.department_budgets?.nom}</span>
                <span className="text-sm text-gray-500">
                  {report.periode} {report.annee}
                  {report.mois ? ` - Mois ${report.mois}` : ''}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Prévu: {report.montant_prevu.toLocaleString()} Ar</span>
                  <span>Réalisé: {report.montant_realise.toLocaleString()} Ar</span>
                </div>
                <Progress value={pourcentage} className="h-2" />
              </div>

              {isOverBudget && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Dépassement budgétaire de {Math.abs(ecart).toLocaleString()} Ar
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};