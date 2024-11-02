import { Card } from "@/components/ui/card";

interface ExitFundsData {
  depenses_fixes: {
    salaires: number;
    charges: number;
    fonctionnement: number;
  };
  depenses_variables: {
    evenements: number;
    aide_urgence: number;
    maintenance: number;
  };
}

interface ExitFundsAnalysisProps {
  data: ExitFundsData;
}

export const ExitFundsAnalysis = ({ data }: ExitFundsAnalysisProps) => {
  const formatAmount = (amount: number) => amount.toLocaleString() + " Ar";

  return (
    <div>
      <h4 className="font-medium mb-4">Sorties de Fonds</h4>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h5 className="text-sm font-medium mb-2">Dépenses Fixes</h5>
          <div className="space-y-2">
            {Object.entries(data.depenses_fixes).map(([type, montant]) => (
              <div key={type} className="flex justify-between">
                <span className="capitalize">{type.replace('_', ' ')}</span>
                <span>{formatAmount(montant)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h5 className="text-sm font-medium mb-2">Dépenses Variables</h5>
          <div className="space-y-2">
            {Object.entries(data.depenses_variables).map(([type, montant]) => (
              <div key={type} className="flex justify-between">
                <span className="capitalize">{type.replace('_', ' ')}</span>
                <span>{formatAmount(montant)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};