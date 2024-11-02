import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EntriesFundsData {
  dimes_offrandes: {
    mensuel: number;
    tendance: number;
  };
  promesses_dons: {
    total: number;
    realise: number;
  };
  dons_ponctuels: {
    evenements: Record<string, number>;
    total: number;
  };
}

interface EntriesFundsAnalysisProps {
  data: EntriesFundsData;
}

export const EntriesFundsAnalysis = ({ data }: EntriesFundsAnalysisProps) => {
  const formatAmount = (amount: number) => amount.toLocaleString() + " Ar";

  return (
    <div>
      <h4 className="font-medium mb-4">Entrées de Fonds</h4>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span>Dîmes et Offrandes (mensuel)</span>
            <div>
              <span className="font-medium">{formatAmount(data.dimes_offrandes.mensuel)}</span>
              <span className={`ml-2 text-sm ${data.dimes_offrandes.tendance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ({data.dimes_offrandes.tendance}%)
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <span>Promesses de Dons</span>
            <span className="font-medium">
              {formatAmount(data.promesses_dons.realise)} / {formatAmount(data.promesses_dons.total)}
            </span>
          </div>
          <Progress 
            value={(data.promesses_dons.realise / data.promesses_dons.total) * 100} 
            className="h-2" 
          />
        </div>

        <div>
          <h5 className="text-sm font-medium mb-2">Dons Ponctuels par Événement</h5>
          <div className="space-y-2">
            {Object.entries(data.dons_ponctuels.evenements).map(([event, montant]) => (
              <div key={event} className="flex justify-between text-sm">
                <span>{event}</span>
                <span>{formatAmount(montant)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};