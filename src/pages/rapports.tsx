import { NavigationBar } from "@/components/layout/NavigationBar";
import { FinancialReports } from "@/components/reports/FinancialReports";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RapportsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Rapports Financiers</h1>
        
        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList>
            <TabsTrigger value="reports">Rapports Disponibles</TabsTrigger>
            <TabsTrigger value="generate">Générer un Rapport</TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <FinancialReports />
          </TabsContent>

          <TabsContent value="generate">
            <ReportGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RapportsPage;