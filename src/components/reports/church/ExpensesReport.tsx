import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatAmount } from "@/lib/utils";

interface ExpenseData {
  categorie: string;
  budget: number;
  depenses: number;
}

interface DepartmentData {
  nom: string;
  budget: number;
  depenses: number;
}

interface ExpensesReportProps {
  depenses: ExpenseData[];
  departements: DepartmentData[];
}

export const ExpensesReport = ({ depenses, departements }: ExpensesReportProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Rapport des Dépenses</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Dépenses par Catégorie</h4>
          <div className="space-y-4">
            {depenses.map((item) => (
              <div key={item.categorie}>
                <div className="flex justify-between mb-2">
                  <span>{item.categorie}</span>
                  <div>
                    <span className="mr-2">{formatAmount(item.depenses)}</span>
                    <span className="text-sm text-gray-500">
                      / {formatAmount(item.budget)}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={(item.depenses / item.budget) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Dépenses par Département</h4>
          <div className="space-y-4">
            {departements.map((dept) => (
              <div key={dept.nom}>
                <div className="flex justify-between mb-2">
                  <span>{dept.nom}</span>
                  <div>
                    <span className="mr-2">{formatAmount(dept.depenses)}</span>
                    <span className="text-sm text-gray-500">
                      / {formatAmount(dept.budget)}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={(dept.depenses / dept.budget) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};