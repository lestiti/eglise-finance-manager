import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { DonationsReport } from "./church/DonationsReport";
import { ExpensesReport } from "./church/ExpensesReport";
import { ProjectsReport } from "./church/ProjectsReport";
import { SocialReport } from "./church/SocialReport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const FinancialReports = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: financialData, isLoading } = useQuery({
    queryKey: ['financial-statements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_statements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data?.[0]?.data;
    }
  });

  const handleExport = async (format: string) => {
    try {
      const { error } = await supabase
        .from('financial_statements')
        .insert([{
          user_id: user?.id,
          type: 'bilan',
          periode: 'mensuel',
          annee: new Date().getFullYear(),
          mois: new Date().getMonth() + 1,
          data: financialData
        }]);

      if (error) throw error;

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

  if (isLoading) {
    return <div>Chargement des rapports financiers...</div>;
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
          <DonationsReport data={financialData?.dons} />
        </TabsContent>

        <TabsContent value="depenses">
          <ExpensesReport 
            depenses={financialData?.depenses} 
            departements={financialData?.departements} 
          />
        </TabsContent>

        <TabsContent value="projets">
          <ProjectsReport projets={financialData?.projets} />
        </TabsContent>

        <TabsContent value="social">
          <SocialReport activites={financialData?.activites_sociales} />
        </TabsContent>
      </Tabs>
    </div>
  );
};