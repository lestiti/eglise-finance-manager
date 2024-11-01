import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Printer, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BalanceSheet } from "./financial-statements/BalanceSheet";
import { IncomeStatement } from "./financial-statements/IncomeStatement";
import { CashFlow } from "./financial-statements/CashFlow";
import { Notes } from "./financial-statements/Notes";
import { useAuth } from "@/components/auth/AuthProvider";
import { FinancialData, isFinancialData } from "@/types/financial";

export const FinancialReports = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data: financialData, isLoading } = useQuery({
    queryKey: ['financial-statements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_statements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      const rawData = data?.[0]?.data;
      if (rawData && isFinancialData(rawData)) {
        return rawData;
      }
      return defaultFinancialData;
    }
  });

  const defaultFinancialData: FinancialData = {
    bilan: {
      actifs_courants: {
        liquidites: 150000000,
        comptes_clients: 75000000,
        stocks: 50000000,
      },
      actifs_non_courants: {
        immobilisations: 300000000,
        investissements_long_terme: 100000000,
      },
      passifs_courants: {
        dettes_court_terme: 80000000,
        comptes_fournisseurs: 45000000,
      },
      passifs_non_courants: {
        emprunts_long_terme: 200000000,
        obligations: 100000000,
      },
      capitaux_propres: {
        capital_social: 150000000,
        reserves: 75000000,
        resultat_net: 25000000,
      },
    },
    compte_resultat: {
      chiffre_affaires: {
        total: 500000000,
        par_segment: {
          "Segment A": 300000000,
          "Segment B": 200000000,
        },
      },
      cout_ventes: {
        total: 300000000,
        details: {
          "Matières premières": 150000000,
          "Main d'œuvre": 100000000,
          "Frais généraux": 50000000,
        },
      },
      charges_exploitation: {
        charges_administratives: 50000000,
        charges_vente: 30000000,
        autres_charges: 20000000,
      },
      resultat_financier: {
        produits_financiers: 10000000,
        charges_financieres: 15000000,
      },
      impots: 25000000,
    },
    flux_tresorerie: {
      activites_operationnelles: {
        encaissements_clients: 480000000,
        decaissements_fournisseurs: 280000000,
        decaissements_salaires: 100000000,
        autres_flux_operationnels: -20000000,
      },
      activites_investissement: {
        acquisitions_immobilisations: 50000000,
        cessions_immobilisations: 10000000,
        investissements_financiers: 20000000,
      },
      activites_financement: {
        emprunts_nouveaux: 100000000,
        remboursements_emprunts: 60000000,
        variations_capital: 0,
      },
      tresorerie: {
        debut_periode: 100000000,
        fin_periode: 150000000,
      },
    },
    notes: {
      methodes_comptables: [
        "Les états financiers sont préparés selon les normes IFRS",
        "La méthode d'amortissement linéaire est utilisée pour les immobilisations",
        "Les stocks sont évalués au coût moyen pondéré",
      ],
      engagements_hors_bilan: [
        "Garanties données aux filiales: 50,000,000 Ar",
        "Engagements de retraite non provisionnés: 25,000,000 Ar",
      ],
      evenements_post_cloture: [
        "Acquisition d'une nouvelle filiale en mars 2024",
        "Obtention d'un nouveau financement de 100,000,000 Ar",
      ],
      risques_incertitudes: [
        "Risque de change sur les opérations internationales",
        "Risque de crédit sur certains clients majeurs",
        "Incertitudes liées aux évolutions réglementaires",
      ],
    },
  };

  const handleExport = async (format: string) => {
    try {
      const exportData = {
        user_id: user?.id,
        type: 'export',
        periode: 'mensuel',
        annee: new Date().getFullYear(),
        mois: new Date().getMonth() + 1,
        data: financialData as unknown as Json
      };

      const { data, error } = await supabase
        .from('financial_statements')
        .insert([exportData])
        .select()
        .single();

      if (error) throw error;

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
      const printData = {
        user_id: user?.id,
        type: 'print',
        periode: 'mensuel',
        annee: new Date().getFullYear(),
        mois: new Date().getMonth() + 1,
        data: financialData as unknown as Json
      };

      const { error } = await supabase
        .from('financial_statements')
        .insert([printData]);

      if (error) throw error;

      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Rapport Financier</title>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<pre>' + JSON.stringify(financialData, null, 2) + '</pre>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }

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

      <BalanceSheet data={financialData.bilan} />
      <IncomeStatement data={financialData.compte_resultat} />
      <CashFlow data={financialData.flux_tresorerie} />
      <Notes data={financialData.notes} />
    </div>
  );
};