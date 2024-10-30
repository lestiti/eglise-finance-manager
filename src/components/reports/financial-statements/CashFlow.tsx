import { Card } from "@/components/ui/card";

interface CashFlowData {
  activites_operationnelles: {
    encaissements_clients: number;
    decaissements_fournisseurs: number;
    decaissements_salaires: number;
    autres_flux_operationnels: number;
  };
  activites_investissement: {
    acquisitions_immobilisations: number;
    cessions_immobilisations: number;
    investissements_financiers: number;
  };
  activites_financement: {
    emprunts_nouveaux: number;
    remboursements_emprunts: number;
    variations_capital: number;
  };
  tresorerie: {
    debut_periode: number;
    fin_periode: number;
  };
}

interface CashFlowProps {
  data: CashFlowData;
}

export const CashFlow = ({ data }: CashFlowProps) => {
  const formatAmount = (amount: number) => amount.toLocaleString() + " Ar";

  const calculateFluxOperationnel = () => {
    const { encaissements_clients, decaissements_fournisseurs, decaissements_salaires, autres_flux_operationnels } = data.activites_operationnelles;
    return encaissements_clients - decaissements_fournisseurs - decaissements_salaires + autres_flux_operationnels;
  };

  const calculateFluxInvestissement = () => {
    const { acquisitions_immobilisations, cessions_immobilisations, investissements_financiers } = data.activites_investissement;
    return -acquisitions_immobilisations + cessions_immobilisations - investissements_financiers;
  };

  const calculateFluxFinancement = () => {
    const { emprunts_nouveaux, remboursements_emprunts, variations_capital } = data.activites_financement;
    return emprunts_nouveaux - remboursements_emprunts + variations_capital;
  };

  const calculateVariationTresorerie = () => {
    return calculateFluxOperationnel() + calculateFluxInvestissement() + calculateFluxFinancement();
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Tableau des Flux de Trésorerie</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Flux de Trésorerie Opérationnels</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Encaissements Clients</span>
              <span>{formatAmount(data.activites_operationnelles.encaissements_clients)}</span>
            </div>
            <div className="flex justify-between">
              <span>Décaissements Fournisseurs</span>
              <span>-{formatAmount(data.activites_operationnelles.decaissements_fournisseurs)}</span>
            </div>
            <div className="flex justify-between">
              <span>Décaissements Salaires</span>
              <span>-{formatAmount(data.activites_operationnelles.decaissements_salaires)}</span>
            </div>
            <div className="flex justify-between">
              <span>Autres Flux Opérationnels</span>
              <span>{formatAmount(data.activites_operationnelles.autres_flux_operationnels)}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total Flux Opérationnels</span>
              <span>{formatAmount(calculateFluxOperationnel())}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Flux de Trésorerie d'Investissement</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Acquisitions d'Immobilisations</span>
              <span>-{formatAmount(data.activites_investissement.acquisitions_immobilisations)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cessions d'Immobilisations</span>
              <span>{formatAmount(data.activites_investissement.cessions_immobilisations)}</span>
            </div>
            <div className="flex justify-between">
              <span>Investissements Financiers</span>
              <span>-{formatAmount(data.activites_investissement.investissements_financiers)}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total Flux d'Investissement</span>
              <span>{formatAmount(calculateFluxInvestissement())}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Flux de Trésorerie de Financement</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Nouveaux Emprunts</span>
              <span>{formatAmount(data.activites_financement.emprunts_nouveaux)}</span>
            </div>
            <div className="flex justify-between">
              <span>Remboursements d'Emprunts</span>
              <span>-{formatAmount(data.activites_financement.remboursements_emprunts)}</span>
            </div>
            <div className="flex justify-between">
              <span>Variations de Capital</span>
              <span>{formatAmount(data.activites_financement.variations_capital)}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total Flux de Financement</span>
              <span>{formatAmount(calculateFluxFinancement())}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Trésorerie Début de Période</span>
              <span>{formatAmount(data.tresorerie.debut_periode)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Variation de Trésorerie</span>
              <span>{formatAmount(calculateVariationTresorerie())}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Trésorerie Fin de Période</span>
              <span>{formatAmount(data.tresorerie.fin_periode)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};