import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Printer, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const FinancialReports = () => {
  const { toast } = useToast();

  const reports = [
    {
      id: 1,
      title: "Bilan Financier",
      period: "Janvier 2024",
      type: "Bilan",
      date_generation: "2024-02-01",
      status: "Validé",
    },
    {
      id: 2,
      title: "Compte de Résultat",
      period: "Q4 2023",
      type: "Compte de résultat",
      date_generation: "2024-01-15",
      status: "En attente de validation",
    },
    {
      id: 3,
      title: "Flux de Trésorerie",
      period: "2023",
      type: "Flux de trésorerie",
      date_generation: "2024-01-10",
      status: "Validé",
    },
  ];

  const handleExport = (format: string) => {
    toast({
      title: "Export en cours",
      description: `Le rapport sera exporté en format ${format}`,
    });
  };

  const handlePrint = () => {
    toast({
      title: "Impression",
      description: "Préparation de l'impression...",
    });
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
                onClick={() => handleExport("pdf")}
              >
                <Download className="h-4 w-4" />
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => handleExport("excel")}
              >
                <Download className="h-4 w-4" />
                Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4" />
                Imprimer
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Aperçu
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};