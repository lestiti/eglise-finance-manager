import { Card } from "@/components/ui/card";
import { 
  Banknote, 
  Users, 
  FolderKanban, 
  TrendingUp
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const DashboardStats = () => {
  const navigate = useNavigate();

  const { data: currentMonthDonations } = useQuery({
    queryKey: ['current-month-donations'],
    queryFn: async () => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('donations')
        .select('montant')
        .gte('date_don', startOfMonth.toISOString());
      
      if (error) throw error;
      return data?.reduce((sum, don) => sum + Number(don.montant), 0) || 0;
    }
  });

  const { data: membersCount } = useQuery({
    queryKey: ['dashboard-members'],
    queryFn: async () => {
      const { count } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('statut', 'actif');
      
      return count || 0;
    }
  });

  const { data: projectsCount } = useQuery({
    queryKey: ['dashboard-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('statut', 'en_cours');
      
      if (error) throw error;
      return data?.length || 0;
    }
  });

  const stats = [
    { 
      title: "Total des dons", 
      amount: `${(currentMonthDonations || 0).toLocaleString()} Ar`, 
      change: "Nouveau",
      icon: Banknote,
      color: "text-green-600",
      bgColor: "bg-green-100",
      onClick: () => navigate("/transactions")
    },
    { 
      title: "Membres actifs", 
      amount: membersCount?.toString() || "0", 
      change: "Nouveau",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      onClick: () => navigate("/membres")
    },
    { 
      title: "Projets en cours", 
      amount: projectsCount?.toString() || "0", 
      change: "Nouveau",
      icon: FolderKanban,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      onClick: () => navigate("/projets")
    },
    { 
      title: "Performance", 
      amount: "85%", 
      change: "Nouveau",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      onClick: () => navigate("/rapports")
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card 
          key={stat.title} 
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={stat.onClick}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <h3 className="text-2xl font-bold mt-2">{stat.amount}</h3>
            </div>
            <div className={`h-12 w-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <p className="text-sm text-muted-foreground">
              {stat.change}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};