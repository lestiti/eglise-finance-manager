import { Card } from "@/components/ui/card";
import { 
  Banknote, 
  Users, 
  FolderKanban, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
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

  const { data: lastMonthDonations } = useQuery({
    queryKey: ['last-month-donations'],
    queryFn: async () => {
      const startOfLastMonth = new Date();
      startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
      startOfLastMonth.setDate(1);
      startOfLastMonth.setHours(0, 0, 0, 0);
      
      const endOfLastMonth = new Date();
      endOfLastMonth.setDate(0);
      endOfLastMonth.setHours(23, 59, 59, 999);
      
      const { data, error } = await supabase
        .from('donations')
        .select('montant')
        .gte('date_don', startOfLastMonth.toISOString())
        .lte('date_don', endOfLastMonth.toISOString());
      
      if (error) throw error;
      return data?.reduce((sum, don) => sum + Number(don.montant), 0) || 0;
    }
  });

  const { data: membersCount } = useQuery({
    queryKey: ['dashboard-members'],
    queryFn: async () => {
      const { count: currentCount } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('statut', 'actif');
      
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const { count: lastMonthCount } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('statut', 'actif')
        .lte('created_at', lastMonth.toISOString());
      
      return {
        current: currentCount || 0,
        variation: currentCount && lastMonthCount ? 
          ((currentCount - lastMonthCount) / lastMonthCount) * 100 : 0
      };
    }
  });

  const { data: projectsData } = useQuery({
    queryKey: ['dashboard-projects'],
    queryFn: async () => {
      const { data: currentProjects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('statut', 'en_cours');
      
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const { data: lastMonthProjects } = await supabase
        .from('projects')
        .select('*')
        .eq('statut', 'en_cours')
        .lte('created_at', lastMonth.toISOString());
      
      if (error) throw error;
      
      const currentCount = currentProjects?.length || 0;
      const lastMonthCount = lastMonthProjects?.length || 0;
      
      return {
        count: currentCount,
        variation: lastMonthCount ? 
          ((currentCount - lastMonthCount) / lastMonthCount) * 100 : 0
      };
    }
  });

  const calculateDonationVariation = () => {
    if (!lastMonthDonations || lastMonthDonations === 0) return 0;
    return ((currentMonthDonations || 0) - lastMonthDonations) / lastMonthDonations * 100;
  };

  const formatVariation = (variation: number) => {
    const prefix = variation > 0 ? '+' : '';
    return `${prefix}${variation.toFixed(1)}%`;
  };

  const stats = [
    { 
      title: "Total des dons", 
      amount: `${(currentMonthDonations || 0).toLocaleString()} Ar`, 
      change: formatVariation(calculateDonationVariation()),
      icon: Banknote,
      color: "text-green-600",
      bgColor: "bg-green-100",
      onClick: () => navigate("/transactions")
    },
    { 
      title: "Membres actifs", 
      amount: membersCount?.current.toString() || "0", 
      change: formatVariation(membersCount?.variation || 0),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      onClick: () => navigate("/membres")
    },
    { 
      title: "Projets en cours", 
      amount: projectsData?.count.toString() || "0", 
      change: formatVariation(projectsData?.variation || 0),
      icon: FolderKanban,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      onClick: () => navigate("/projets")
    },
    { 
      title: "Performance", 
      amount: "85%", 
      change: "+15%",
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
            {stat.change.startsWith("+") ? (
              <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
            ) : stat.change.startsWith("-") ? (
              <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
            ) : null}
            <p className={`text-sm ${
              stat.change.startsWith("+") ? "text-green-600" : 
              stat.change.startsWith("-") ? "text-red-600" : 
              "text-gray-600"
            }`}>
              {stat.change} par rapport au mois dernier
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};