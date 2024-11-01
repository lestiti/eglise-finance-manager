import { Card } from "@/components/ui/card";
import { MonthlyExpenses } from "./MonthlyExpenses";
import { BudgetComparison } from "./BudgetComparison";
import { ExpenseCategories } from "./ExpenseCategories";
import { DepartmentExpenses } from "./DepartmentExpenses";

export const ExpenseReport = () => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Rapport des Dépenses Générales de l'Église</h3>
      <div className="space-y-8">
        <MonthlyExpenses />
        <BudgetComparison />
        <ExpenseCategories />
        <DepartmentExpenses />
      </div>
    </Card>
  );
};