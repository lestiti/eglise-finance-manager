import { NavigationBar } from "@/components/layout/NavigationBar";
import { BudgetOverview } from "@/components/budgets/BudgetOverview";
import { ExpenseForm } from "@/components/budgets/ExpenseForm";
import { DepartmentExpenses } from "@/components/budgets/DepartmentExpenses";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BudgetsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Gestion des Budgets</h1>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="expense">Nouvelle Dépense</TabsTrigger>
            <TabsTrigger value="department">Dépenses par Département</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <BudgetOverview />
          </TabsContent>

          <TabsContent value="expense">
            <ExpenseForm />
          </TabsContent>

          <TabsContent value="department">
            <DepartmentExpenses />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BudgetsPage;