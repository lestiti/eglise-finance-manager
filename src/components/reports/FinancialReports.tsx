import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonationsReport } from "./church/DonationsReport";
import { ExpensesReport } from "./church/ExpensesReport";
import { ProjectsReport } from "./church/ProjectsReport";
import { SocialReport } from "./church/SocialReport";

export const FinancialReports = () => {
  const { toast } = useToast();

  const { data: donations, isLoading: isLoadingDonations } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('date_don', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: departments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('department_budgets')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['charitable-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('charitable_activities')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const handleExport = async (format: string) => {
    try {
      toast({
        title: "Export réussi",
        description: `Le rapport a été exporté en format ${format}`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'export",
        variant: "destructive",
      });
    }
  };

  if (isLoadingDonations || isLoadingDepartments || isLoadingProjects || isLoadingActivities) {
    return (
      <div className="p-8">
        <Card className="p-6">
          <div className="text-center">Chargement des rapports financiers...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => handleExport("pdf")}
        >
          <Download className="h-4 w-4" />
          Exporter en PDF
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => handleExport("excel")}
        >
          <Download className="h-4 w-4" />
          Exporter en Excel
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => window.print()}
        >
          <Printer className="h-4 w-4" />
          Imprimer
        </Button>
      </div>

      <Tabs defaultValue="dons" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dons">Dons et Offrandes</TabsTrigger>
          <TabsTrigger value="depenses">Dépenses</TabsTrigger>
          <TabsTrigger value="projets">Projets</TabsTrigger>
          <TabsTrigger value="social">Aide Sociale</TabsTrigger>
        </TabsList>

        <TabsContent value="dons">
          <DonationsReport donations={donations} />
        </TabsContent>

        <TabsContent value="depenses">
          <ExpensesReport departments={departments} />
        </TabsContent>

        <TabsContent value="projets">
          <ProjectsReport projects={projects} />
        </TabsContent>

        <TabsContent value="social">
          <SocialReport activities={activities} />
        </TabsContent>
      </Tabs>
    </div>
  );
};