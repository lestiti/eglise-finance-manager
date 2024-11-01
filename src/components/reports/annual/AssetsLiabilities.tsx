import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface FinancialStatement {
  actifs_courants: {
    total: number;
    liquidites: number;
  };
  actifs_non_courants: {
    batiments: number;
    equipements: number;
  };
  passifs_courants: {
    total: number;
    dettes_court_terme: number;
  };
  passifs_non_courants: {
    engagements: number;
  };
}

export const AssetsLiabilities = () => {
  const { data: statements } = useQuery({
    queryKey: ['financial-statements-assets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_statements')
        .select('*')
        .eq('type', 'bilan')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data?.[0]?.data as FinancialStatement;
    }
  });

  const totalActifs = statements?.actifs_courants?.total || 0;
  const totalPassifs = statements?.passifs_courants?.total || 0;
  const ratio = (totalActifs / (totalPassifs || 1)) * 100;

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">État des Actifs et Passifs</h4>
      <Card className="p-4">
        <div className="space-y-6">
          <div>
            <h5 className="font-medium mb-4">Actifs</h5>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Liquidités</span>
                <span>{statements?.actifs_courants?.liquidites?.toLocaleString()} Ar</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Bâtiments</span>
                <span>{statements?.actifs_non_courants?.batiments?.toLocaleString()} Ar</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Équipements</span>
                <span>{statements?.actifs_non_courants?.equipements?.toLocaleString()} Ar</span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-4">Passifs</h5>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Dettes Court Terme</span>
                <span>{statements?.passifs_courants?.dettes_court_terme?.toLocaleString()} Ar</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Engagements Financiers</span>
                <span>{statements?.passifs_non_courants?.engagements?.toLocaleString()} Ar</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span>Ratio Actifs/Passifs</span>
              <span>{ratio.toFixed(2)}%</span>
            </div>
            <Progress value={ratio} className="h-2" />
          </div>
        </div>
      </Card>
    </div>
  );
};