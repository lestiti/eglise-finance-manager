import { Button } from "@/components/ui/button";
import { FileText, Download, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DonationReport } from "./donations/DonationReport";
import { ExpenseReport } from "./expenses/ExpenseReport";
import { CashFlow } from "./financial-statements/CashFlow";
import { Notes } from "./financial-statements/Notes";
import { useAuth } from "@/components/auth/AuthProvider";
import { convertToJson } from "@/lib/typeUtils";

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
      return data?.[0]?.data || {};
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
      <CashFlow data={financialData.flux_tresorerie} />
      <Notes data={financialData.notes} />
    </div>
  );
};