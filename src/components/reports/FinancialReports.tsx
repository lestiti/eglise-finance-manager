import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Printer, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { BalanceSheet } from "./financial-statements/BalanceSheet";
import { IncomeStatement } from "./financial-statements/IncomeStatement";
import { CashFlow } from "./financial-statements/CashFlow";
import { Notes } from "./financial-statements/Notes";

export const FinancialReports = () => {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Exemple de données pour les états financiers
  const sampleData = {
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

  const handleExport = (format: string) => {
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { 
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
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Rapport Financier</title>');
      printWindow.document.write('</head><body>');
      printWindow.document.write('<pre>' + JSON.stringify(sampleData, null, 2) + '</pre>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }

    toast({
      title: "Impression lancée",
      description: "Le rapport est envoyé à l'imprimante",
    });
  };

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

      <BalanceSheet data={sampleData.bilan} />
      <IncomeStatement data={sampleData.compte_resultat} />
      <CashFlow data={sampleData.flux_tresorerie} />
      <Notes data={sampleData.notes} />
    </div>
  );
};