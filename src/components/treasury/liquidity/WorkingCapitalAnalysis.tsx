import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface WorkingCapitalData {
  minimum_requis: number;
  actuel: number;
  reserve_urgence: number;
}

interface WorkingCapitalAnalysisProps {
  data: WorkingCapitalData;
  totalDepensesMensuelles: number;
}

export const WorkingCapitalAnalysis = ({ data, totalDepensesMensuelles }: WorkingCapitalAnalysisProps) => {
  const formatAmount = (amount: number) => amount.toLocaleString() + " Ar";
  const fondsRoulementRatio = (data.actuel / data.minimum_requis) * 100;
  const reserveUrgenceRatio = (data.reserve_urgence / (totalDepensesMensuelles * 0.10)) * 100;

  return (
    <div>
      <h4 className="font-medium mb-4">Fonds de Roulement</h4>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span>Fonds de Roulement Actuel</span>
            <span className="font-medium">{formatAmount(data.actuel)}</span>
          </div>
          <Progress value={fondsRoulementRatio} className="h-2" />
          {fondsRoulementRatio < 100 && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Attention</AlertTitle>
              <AlertDescription>
                Le fonds de roulement est inférieur au minimum requis de {formatAmount(data.minimum_requis)}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span>Réserve d'Urgence</span>
            <span className="font-medium">{formatAmount(data.reserve_urgence)}</span>
          </div>
          <Progress value={reserveUrgenceRatio} className="h-2" />
          {reserveUrgenceRatio < 100 && (
            <Alert variant="default" className="mt-2 border-orange-200 bg-orange-50 text-orange-900">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Recommandation</AlertTitle>
              <AlertDescription>
                La réserve d'urgence devrait être d'au moins {formatAmount(totalDepensesMensuelles * 0.10)} (10% des dépenses mensuelles)
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};