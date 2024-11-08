import { Card } from "@/components/ui/card";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardNotifications } from "@/components/dashboard/DashboardNotifications";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Users, 
  FileText, 
  Settings,
  Shield
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const quickActions = [
    { 
      title: "Nouvelle transaction",
      icon: Plus,
      onClick: () => navigate("/transactions"),
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    { 
      title: "Gérer les membres",
      icon: Users,
      onClick: () => navigate("/membres"),
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    { 
      title: "Rapports",
      icon: FileText,
      onClick: () => navigate("/rapports"),
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    { 
      title: "Sécurité",
      icon: Shield,
      onClick: () => navigate("/securite"),
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    { 
      title: "Paramètres",
      icon: Settings,
      onClick: () => navigate("/parametres"),
      color: "text-gray-600",
      bgColor: "bg-gray-100"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="container mx-auto p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Tableau de Bord</h1>
          <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className="flex items-center gap-2 text-sm"
                onClick={action.onClick}
              >
                <div className={`p-1 rounded-full ${action.bgColor}`}>
                  <action.icon className={`h-4 w-4 ${action.color}`} />
                </div>
                <span className="hidden sm:inline">{action.title}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <DashboardStats />
          <div className="grid lg:grid-cols-2 gap-6">
            <DashboardCharts />
            <DashboardNotifications />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;