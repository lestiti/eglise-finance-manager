import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BudgetData {
  montant_alloue: number;
  montant_utilise: number;
  department_budgets: {
    nom: string;
    budget_annuel: number;
    budget_mensuel: number;
  };
}

interface BudgetOverviewProps {
  data: BudgetData[];
}

export const BudgetOverview = ({ data }: BudgetOverviewProps) => {
  const totalBudget = data.reduce((acc, curr) => acc + Number(curr.montant_alloue), 0);
  const totalUtilise = data.reduce((acc, curr) => acc + Number(curr.montant_utilise), 0);
  const utilisationRate = (totalUtilise / totalBudget) * 100;

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Vue d'ensemble du Budget</h4>
      <Card className="p-4">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span>Budget Total</span>
              <span className="font-medium">{totalBudget.toLocaleString()} Ar</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Montant Utilisé</span>
              <span className="font-medium">{totalUtilise.toLocaleString()} Ar</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Taux d'Utilisation</span>
              <span className="font-medium">{utilisationRate.toFixed(1)}%</span>
            </div>
            <Progress value={utilisationRate} className="h-2" />
          </div>
        </div>
      </Card>
    </div>
  );
};