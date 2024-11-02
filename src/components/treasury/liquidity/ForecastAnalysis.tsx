import { Card } from "@/components/ui/card";

interface ForecastData {
  mois: string;
  entrees_prevues: number;
  sorties_prevues: number;
  solde_prevu: number;
}

interface ForecastAnalysisProps {
  data: ForecastData[];
}

export const ForecastAnalysis = ({ data }: ForecastAnalysisProps) => {
  const formatAmount = (amount: number) => amount.toLocaleString() + " Ar";

  return (
    <div>
      <h4 className="font-medium mb-4">Prévisions sur 3 Mois</h4>
      <div className="space-y-4">
        {data.map((prevision) => (
          <div key={prevision.mois}>
            <h5 className="text-sm font-medium mb-2">{prevision.mois}</h5>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Entrées Prévues</span>
                <span className="text-green-600">{formatAmount(prevision.entrees_prevues)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Sorties Prévues</span>
                <span className="text-red-600">{formatAmount(prevision.sorties_prevues)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Solde Prévu</span>
                <span className={prevision.solde_prevu >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatAmount(prevision.solde_prevu)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};