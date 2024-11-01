import { Button } from "@/components/ui/button";
import { FileText, Download, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DonationReport } from "./donations/DonationReport";
import { ExpenseReport } from "./expenses/ExpenseReport";
import { ProjectManagementReport } from "./financial-statements/ProjectManagementReport";
import { TreasuryReport } from "./financial-statements/TreasuryReport";
import { SocialAidReport } from "./social-aid/SocialAidReport";
import { AnnualReport } from "./annual/AnnualReport";
import { BudgetReport } from "./budgets/BudgetReport";
import { useAuth } from "@/components/auth/AuthProvider";
import { convertToJson } from "@/lib/typeUtils";
import { FinancialData } from "@/types/financial";

const defaultFinancialData: FinancialData = {
  flux_tresorerie: {
    activites_operationnelles: {
      encaissements_clients: 0,
      decaissements_fournisseurs: 0,
      decaissements_salaires: 0,
      autres_flux_operationnels: 0,
    },
    activites_investissement: {
      acquisitions_immobilisations: 0,
      cessions_immobilisations: 0,
      investissements_financiers: 0,
    },
    activites_financement: {
      emprunts_nouveaux: 0,
      remboursements_emprunts: 0,
      variations_capital: 0,
    },
    tresorerie: {
      debut_periode: 0,
      fin_periode: 0,
    },
  },
  notes: {
    methodes_comptables: [],
    engagements_hors_bilan: [],
    evenements_post_cloture: [],
    risques_incertitudes: [],
  },
};

export const FinancialReports = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: financialData = defaultFinancialData, isLoading } = useQuery({
    queryKey: ['financial-statements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_statements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      const rawData = data?.[0]?.data;
      if (!rawData || typeof rawData !== 'object') return defaultFinancialData;
      
      const isFinancialData = (data: unknown): data is FinancialData => {
        if (typeof data !== 'object' || data === null) return false;
        const d = data as Partial<FinancialData>;
        return (
          'flux_tresorerie' in d &&
          'notes' in d
        );
      };

      return isFinancialData(rawData) ? rawData : defaultFinancialData;
    }
  });

  const handleExport = async (format: string) => {
    try {
      await supabase
        .from('financial_statements')
        .insert([
          {
            user_id: user?.id,
            type: 'export',
            periode: 'mensuel',
            annee: new Date().getFullYear(),
            mois: new Date().getMonth() + 1,
            data: convertToJson(financialData)
          }
        ]);

      const blob = new Blob([JSON.stringify(financialData, null, 2)], { 
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport_financier.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

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

  const handlePrint = async () => {
    try {
      await supabase
        .from('financial_statements')
        .insert([
          {
            user_id: user?.id,
            type: 'print',
            periode: 'mensuel',
            annee: new Date().getFullYear(),
            mois: new Date().getMonth() + 1,
            data: convertToJson(financialData)
          }
        ]);

      window.print();

      toast({
        title: "Impression lancée",
        description: "Le rapport est envoyé à l'imprimante",
      });
    } catch (error) {
      console.error('Erreur lors de l\'impression:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'impression",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement des données financières...</div>;
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
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4" />
          Imprimer
        </Button>
      </div>

      <DonationReport />
      <ExpenseReport />
      <BudgetReport />
      <ProjectManagementReport />
      <TreasuryReport />
      <SocialAidReport />
      <AnnualReport />
    </div>
  );
};
