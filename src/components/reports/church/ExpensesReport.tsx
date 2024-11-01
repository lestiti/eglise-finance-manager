import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatAmount } from "@/lib/utils";

interface DepartmentExpense {
  nom: string;
  budget_annuel: number;
  budget_mensuel: number;
  depenses_actuelles: number;
}

interface ExpensesReportProps {
  departments?: DepartmentExpense[];
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
              <div key={dept.nom} className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-medium">{dept.nom}</span>
                  <div className="text-sm text-gray-500">
                    Budget annuel: {formatAmount(dept.budget_annuel)}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Dépenses actuelles</span>
                    <span>{formatAmount(dept.depenses_actuelles)}</span>
                  </div>
                  <Progress 
                    value={(dept.depenses_actuelles / dept.budget_annuel) * 100} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Budget mensuel</span>
                    <span>{formatAmount(dept.budget_mensuel)}</span>
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