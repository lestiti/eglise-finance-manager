import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface BudgetData {
  montant_alloue: number;
  montant_utilise: number;
  department_budgets: {
    nom: string;
    budget_annuel: number;
    budget_mensuel: number;
  };
}

interface DepartmentComparisonProps {
  data: BudgetData[];
}

export const DepartmentComparison = ({ data }: DepartmentComparisonProps) => {
  const departmentData = data.reduce((acc, curr) => {
    const deptName = curr.department_budgets.nom;
    if (!acc[deptName]) {
      acc[deptName] = {
        alloue: 0,
        utilise: 0,
        budget_annuel: curr.department_budgets.budget_annuel
      };
    }
    acc[deptName].alloue += Number(curr.montant_alloue);
    acc[deptName].utilise += Number(curr.montant_utilise);
    return acc;
  }, {} as Record<string, { alloue: number; utilise: number; budget_annuel: number; }>);

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Comparaison par Département</h4>
      <div className="space-y-4">
        {Object.entries(departmentData).map(([dept, data]) => {
          const utilisationRate = (data.utilise / data.alloue) * 100;
          const isOverBudget = utilisationRate > 100;

          return (
            <Card key={dept} className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium">{dept}</h5>
                  <span className="text-sm text-gray-500">
                    {data.utilise.toLocaleString()} Ar / {data.alloue.toLocaleString()} Ar
                  </span>
                </div>
                <Progress 
                  value={utilisationRate} 
                  className={`h-2 ${isOverBudget ? 'bg-red-200' : ''}`}
                />
                {isOverBudget && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Dépassement budgétaire de {(utilisationRate - 100).toFixed(1)}%
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};