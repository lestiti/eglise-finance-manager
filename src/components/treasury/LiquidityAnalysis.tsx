import { Card } from "@/components/ui/card";
import { LiquidityHeader } from "./liquidity/LiquidityHeader";
import { EntriesFundsAnalysis } from "./liquidity/EntriesFundsAnalysis";
import { ExitFundsAnalysis } from "./liquidity/ExitFundsAnalysis";
import { WorkingCapitalAnalysis } from "./liquidity/WorkingCapitalAnalysis";
import { ForecastAnalysis } from "./liquidity/ForecastAnalysis";

interface LiquidityAnalysisData {
  entrees_fonds: {
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
  const calculateTotalDepensesMensuelles = () => {
    const fixes = Object.values(data.sorties_fonds.depenses_fixes).reduce((a, b) => a + b, 0);
    const variables = Object.values(data.sorties_fonds.depenses_variables).reduce((a, b) => a + b, 0);
    return fixes + variables;
  };

  const totalDepensesMensuelles = calculateTotalDepensesMensuelles();

  return (
    <Card className="p-6">
      <LiquidityHeader 
        title="Analyse des Besoins en Liquidités" 
      />
      
      <div className="space-y-8">
        <EntriesFundsAnalysis data={data.entrees_fonds} />
        <ExitFundsAnalysis data={data.sorties_fonds} />
        <WorkingCapitalAnalysis 
          data={data.fonds_roulement}
          totalDepensesMensuelles={totalDepensesMensuelles}
        />
        <ForecastAnalysis data={data.previsions} />
      </div>
    </Card>
  );
};