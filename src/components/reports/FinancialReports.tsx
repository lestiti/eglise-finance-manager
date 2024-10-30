import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Printer, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export const FinancialReports = () => {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const reports = [
    {
      id: 1,
      title: "Bilan Financier",
      period: "Janvier 2024",
      type: "Bilan",
      date_generation: "2024-02-01",
      status: "Validé",
      content: {
        actif: 150000000,
        passif: 150000000,
        resultat: 25000000
      }
    },
    {
      id: 2,
      title: "Compte de Résultat",
      period: "Q4 2023",
      type: "Compte de résultat",
      date_generation: "2024-01-15",
      status: "En attente de validation",
      content: {
        produits: 75000000,
        charges: 50000000,
        resultat: 25000000
      }
    },
    {
      id: 3,
      title: "Flux de Trésorerie",
      period: "2023",
      type: "Flux de trésorerie",
      date_generation: "2024-01-10",
      status: "Validé",
      content: {
        entrees: 100000000,
        sorties: 80000000,
        solde: 20000000
      }
    },
  ];

  const handleExport = (format: string, report: any) => {
    // Création d'un objet avec les données du rapport
    const reportData = {
      title: report.title,
      period: report.period,
      type: report.type,
      date: report.date_generation,
      content: report.content
    };

    // Conversion en chaîne JSON
    const jsonString = JSON.stringify(reportData, null, 2);

    // Création du blob et du lien de téléchargement
    const blob = new Blob([jsonString], { type: format === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title}_${report.period}.${format}`;
    
    // Déclenchement du téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: `Le rapport a été exporté en format ${format}`,
    });
  };

  const handlePrint = (report: any) => {
    const printContent = `
      ${report.title}
      Période: ${report.period}
      Type: ${report.type}
      Date de génération: ${report.date_generation}
      
      Contenu:
      ${JSON.stringify(report.content, null, 2)}
    `;

    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Impression Rapport</title>');
      printWindow.document.write('</head><body >');
      printWindow.document.write('<pre>' + printContent + '</pre>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }

    toast({
      title: "Impression lancée",
      description: "Le rapport est envoyé à l'imprimante",
    });
  };

  const handlePreview = (report: any) => {
    setSelectedReport(report);
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      {reports.map((report) => (
        <Card key={report.id} className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold">{report.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Période: {report.period}</p>
              <p className="text-sm text-muted-foreground">Type: {report.type}</p>
              <p className="text-sm text-muted-foreground">
                Généré le: {report.date_generation}
              </p>
              <p className="text-sm mt-2">
                Status:{" "}
                <span
                  className={
                    report.status === "Validé"
                      ? "text-green-600 font-medium"
                      : "text-yellow-600 font-medium"
                  }
                >
                  {report.status}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => handleExport("pdf", report)}
              >
                <Download className="h-4 w-4" />
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => handleExport("excel", report)}
              >
                <Download className="h-4 w-4" />
                Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => handlePrint(report)}
              >
                <Printer className="h-4 w-4" />
                Imprimer
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => handlePreview(report)}
              >
                <Eye className="h-4 w-4" />
                Aperçu
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedReport?.title} - {selectedReport?.period}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Informations Générales</h4>
                <p className="text-sm">Type: {selectedReport?.type}</p>
                <p className="text-sm">Date de génération: {selectedReport?.date_generation}</p>
                <p className="text-sm">Statut: {selectedReport?.status}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Contenu du Rapport</h4>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm">
                  {selectedReport && JSON.stringify(selectedReport.content, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};