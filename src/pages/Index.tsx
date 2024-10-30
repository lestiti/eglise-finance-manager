import { Card } from "@/components/ui/card";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardNotifications } from "@/components/dashboard/DashboardNotifications";

const Index = () => {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Tableau de Bord</h1>
      
      <div className="grid gap-6">
        <DashboardStats />
        <div className="grid md:grid-cols-2 gap-6">
          <DashboardCharts />
          <DashboardNotifications />
        </div>
      </div>
    </div>
  );
};

export default Index;