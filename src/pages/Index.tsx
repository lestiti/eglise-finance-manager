import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardNotifications } from "@/components/dashboard/DashboardNotifications";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de Bord</h1>
        <Button 
          onClick={() => navigate("/transactions")}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          Nouvelle Transaction
        </Button>
      </div>
      
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