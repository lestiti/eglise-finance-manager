import { Card } from "@/components/ui/card";

interface IncomeStatementData {
  chiffre_affaires: {
    total: number;
    par_segment: Record<string, number>;
  };
  cout_ventes: {
    total: number;
    details: Record<string, number>;
  };
  charges_exploitation: {
    charges_administratives: number;
    charges_vente: number;
    autres_charges: number;
  };
  resultat_financier: {
    produits_financiers: number;
    charges_financieres: number;
  };
  impots: number;
}

interface IncomeStatementProps {
  data: IncomeStatementData;
}

export const IncomeStatement = ({ data }: IncomeStatementProps) => {
  const formatAmount = (amount: number) => amount.toLocaleString() + " Ar";

  const calculateMarginBrute = () => {
    return data.chiffre_affaires.total - data.cout_ventes.total;
  };

  const calculateResultatExploitation = () => {
    const totalCharges = Object.values(data.charges_exploitation).reduce((a, b) => a + b, 0);
    return calculateMarginBrute() - totalCharges;
  };

  const calculateResultatFinancier = () => {
    return data.resultat_financier.produits_financiers - data.resultat_financier.charges_financieres;
  };

  const calculateResultatNet = () => {
    return calculateResultatExploitation() + calculateResultatFinancier() - data.impots;
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Compte de Résultat</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Chiffre d'Affaires</h4>
          <div className="space-y-2">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatAmount(data.chiffre_affaires.total)}</span>
            </div>
            <div className="pl-4 space-y-1">
              {Object.entries(data.chiffre_affaires.par_segment).map(([segment, montant]) => (
                <div key={segment} className="flex justify-between text-sm">
                  <span>{segment}</span>
                  <span>{formatAmount(montant)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Coût des Ventes</h4>
          <div className="space-y-2">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatAmount(data.cout_ventes.total)}</span>
            </div>
            <div className="pl-4 space-y-1">
              {Object.entries(data.cout_ventes.details).map(([type, montant]) => (
                <div key={type} className="flex justify-between text-sm">
                  <span>{type}</span>
                  <span>{formatAmount(montant)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Marge Brute</h4>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatAmount(calculateMarginBrute())}</span>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Charges d'Exploitation</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Charges Administratives</span>
              <span>{formatAmount(data.charges_exploitation.charges_administratives)}</span>
            </div>
            <div className="flex justify-between">
              <span>Charges de Vente</span>
              <span>{formatAmount(data.charges_exploitation.charges_vente)}</span>
            </div>
            <div className="flex justify-between">
              <span>Autres Charges</span>
              <span>{formatAmount(data.charges_exploitation.autres_charges)}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Résultat d'Exploitation</h4>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatAmount(calculateResultatExploitation())}</span>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Résultat Financier</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Produits Financiers</span>
              <span>{formatAmount(data.resultat_financier.produits_financiers)}</span>
            </div>
            <div className="flex justify-between">
              <span>Charges Financières</span>
              <span>{formatAmount(data.resultat_financier.charges_financieres)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatAmount(calculateResultatFinancier())}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Impôts sur le Résultat</h4>
          <div className="flex justify-between">
            <span>Total</span>
            <span>{formatAmount(data.impots)}</span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between font-semibold">
            <span>Résultat Net</span>
            <span>{formatAmount(calculateResultatNet())}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};