import { Card } from "@/components/ui/card";
import { formatAmount } from "@/lib/utils";

interface BalanceSheetData {
  actifs_courants: {
    liquidites: number;
    comptes_clients: number;
    stocks: number;
  };
  actifs_non_courants: {
    immobilisations: number;
    investissements_long_terme: number;
  };
  passifs_courants: {
    dettes_court_terme: number;
    comptes_fournisseurs: number;
  };
  passifs_non_courants: {
    emprunts_long_terme: number;
    obligations: number;
  };
  capitaux_propres: {
    capital_social: number;
    reserves: number;
    resultat_net: number;
  };
}

interface BalanceSheetProps {
  data: BalanceSheetData;
}

export const BalanceSheet = ({ data }: BalanceSheetProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Bilan</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Actif</h4>
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-gray-600 mb-2">Actifs Courants</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Liquidités</span>
                  <span>{formatAmount(data.actifs_courants.liquidites)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Comptes Clients</span>
                  <span>{formatAmount(data.actifs_courants.comptes_clients)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stocks</span>
                  <span>{formatAmount(data.actifs_courants.stocks)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-600 mb-2">Actifs Non Courants</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Immobilisations</span>
                  <span>{formatAmount(data.actifs_non_courants.immobilisations)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Investissements Long Terme</span>
                  <span>{formatAmount(data.actifs_non_courants.investissements_long_terme)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Passif</h4>
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-gray-600 mb-2">Passifs Courants</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Dettes Court Terme</span>
                  <span>{formatAmount(data.passifs_courants.dettes_court_terme)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Comptes Fournisseurs</span>
                  <span>{formatAmount(data.passifs_courants.comptes_fournisseurs)}</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-600 mb-2">Passifs Non Courants</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Emprunts Long Terme</span>
                  <span>{formatAmount(data.passifs_non_courants.emprunts_long_terme)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Obligations</span>
                  <span>{formatAmount(data.passifs_non_courants.obligations)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Capitaux Propres</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Capital Social</span>
              <span>{formatAmount(data.capitaux_propres.capital_social)}</span>
            </div>
            <div className="flex justify-between">
              <span>Réserves</span>
              <span>{formatAmount(data.capitaux_propres.reserves)}</span>
            </div>
            <div className="flex justify-between">
              <span>Résultat Net</span>
              <span>{formatAmount(data.capitaux_propres.resultat_net)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};