import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatAmount } from "@/lib/utils";

interface DepartmentBudget {
  id: string;
  nom: string;
  budget_annuel: number;
  budget_mensuel: number;
  annee: number;
  mois?: number;
  created_at?: string;
}

interface ExpensesReportProps {
  departments?: DepartmentBudget[];
}

export const ExpensesReport = ({ departments }: ExpensesReportProps) => {
  if (!departments || departments.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6">Rapport des Dépenses</h3>
        <p className="text-gray-500">Aucune donnée disponible</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Rapport des Dépenses</h3>
      
      <div className="space-y-8">
        <div>
          <h4 className="font-medium mb-4">Dépenses par Département</h4>
          <div className="space-y-6">
            {departments.map((dept) => (
              <div key={dept.id} className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-medium">{dept.nom}</span>
                  <div className="text-sm text-gray-500">
                    Budget annuel: {formatAmount(dept.budget_annuel)}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Budget mensuel</span>
                    <span>{formatAmount(dept.budget_mensuel)}</span>
                  </div>
                  <Progress 
                    // Since we don't have actual expenses, we'll show budget utilization based on month
                    value={((dept.mois || 1) / 12) * 100} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Période</span>
                    <span>{dept.mois ? `Mois ${dept.mois}` : 'Année complète'} - {dept.annee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};