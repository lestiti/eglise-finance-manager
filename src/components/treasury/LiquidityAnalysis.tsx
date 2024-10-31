import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LiquidityAnalysisData {
  entrees_fonds: {
    dimes_offrandes: {
      mensuel: number;
      tendance: number; // pourcentage de variation
    };
    promesses_dons: {
      total: number;
      realise: number;
    };
    dons_ponctuels: {
      evenements: Record<string, number>;
      total: number;
    };
  };
  sorties_fonds: {
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
  };
  fonds_roulement: {
    minimum_requis: number;
    actuel: number;
    reserve_urgence: number;
  };
  previsions: {
    mois: string;
    entrees_prevues: number;
    sorties_prevues: number;
    solde_prevu: number;
  }[];
}

interface LiquidityAnalysisProps {
  data: LiquidityAnalysisData;
}

export const LiquidityAnalysis = ({ data }: LiquidityAnalysisProps) => {
  const formatAmount = (amount: number) => amount.toLocaleString() + " Ar";

  const calculateTotalDepensesMensuelles = () => {
    const fixes = Object.values(data.sorties_fonds.depenses_fixes).reduce((a, b) => a + b, 0);
    const variables = Object.values(data.sorties_fonds.depenses_variables).reduce((a, b) => a + b, 0);
    return fixes + variables;
  };

  const totalDepensesMensuelles = calculateTotalDepensesMensuelles();
  const fondsRoulementRatio = (data.fonds_roulement.actuel / data.fonds_roulement.minimum_requis) * 100;
  const reserveUrgenceRatio = (data.fonds_roulement.reserve_urgence / (totalDepensesMensuelles * 0.10)) * 100;

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Analyse des Besoins en Liquidités</h3>
      
      <div className="space-y-8">
        {/* Entrées de Fonds */}
        <div>
          <h4 className="font-medium mb-4">Entrées de Fonds</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Dîmes et Offrandes (mensuel)</span>
                <div>
                  <span className="font-medium">{formatAmount(data.entrees_fonds.dimes_offrandes.mensuel)}</span>
                  <span className={`ml-2 text-sm ${data.entrees_fonds.dimes_offrandes.tendance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ({data.entrees_fonds.dimes_offrandes.tendance}%)
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span>Promesses de Dons</span>
                <span className="font-medium">
                  {formatAmount(data.entrees_fonds.promesses_dons.realise)} / {formatAmount(data.entrees_fonds.promesses_dons.total)}
                </span>
              </div>
              <Progress 
                value={(data.entrees_fonds.promesses_dons.realise / data.entrees_fonds.promesses_dons.total) * 100} 
                className="h-2" 
              />
            </div>

            <div>
              <h5 className="text-sm font-medium mb-2">Dons Ponctuels par Événement</h5>
              <div className="space-y-2">
                {Object.entries(data.entrees_fonds.dons_ponctuels.evenements).map(([event, montant]) => (
                  <div key={event} className="flex justify-between text-sm">
                    <span>{event}</span>
                    <span>{formatAmount(montant)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sorties de Fonds */}
        <div>
          <h4 className="font-medium mb-4">Sorties de Fonds</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium mb-2">Dépenses Fixes</h5>
              <div className="space-y-2">
                {Object.entries(data.sorties_fonds.depenses_fixes).map(([type, montant]) => (
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
                {Object.entries(data.sorties_fonds.depenses_variables).map(([type, montant]) => (
                  <div key={type} className="flex justify-between">
                    <span className="capitalize">{type.replace('_', ' ')}</span>
                    <span>{formatAmount(montant)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fonds de Roulement */}
        <div>
          <h4 className="font-medium mb-4">Fonds de Roulement</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Fonds de Roulement Actuel</span>
                <span className="font-medium">{formatAmount(data.fonds_roulement.actuel)}</span>
              </div>
              <Progress value={fondsRoulementRatio} className="h-2" />
              {fondsRoulementRatio < 100 && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Attention</AlertTitle>
                  <AlertDescription>
                    Le fonds de roulement est inférieur au minimum requis de {formatAmount(data.fonds_roulement.minimum_requis)}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Réserve d'Urgence</span>
                <span className="font-medium">{formatAmount(data.fonds_roulement.reserve_urgence)}</span>
              </div>
              <Progress value={reserveUrgenceRatio} className="h-2" />
              {reserveUrgenceRatio < 100 && (
                <Alert variant="warning" className="mt-2">
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

        {/* Prévisions */}
        <div>
          <h4 className="font-medium mb-4">Prévisions sur 3 Mois</h4>
          <div className="space-y-4">
            {data.previsions.map((prevision) => (
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
      </div>
    </Card>
  );
};