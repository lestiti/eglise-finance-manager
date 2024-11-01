import { Card } from "@/components/ui/card";
import { formatAmount } from "@/lib/utils";

interface DonationsData {
  dimes: number;
  offrandes_dominicales: number;
  dons_en_ligne: number;
  collectes_speciales: number;
  analyse_mensuelle: {
    mois: string;
    montant: number;
  }[];
  repartition_activites: {
    activite: string;
    montant: number;
    pourcentage: number;
  }[];
}

interface DonationsReportProps {
  data?: DonationsData;
}

export const DonationsReport = ({ data }: DonationsReportProps) => {
  if (!data) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6">Rapport des Dons et Offrandes</h3>
        <p className="text-gray-500">Aucune donnée disponible</p>
      </Card>
    );
  }

  const totalDons = data.dimes + data.offrandes_dominicales + data.dons_en_ligne + data.collectes_speciales;

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Rapport des Dons et Offrandes</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Récapitulatif des Dons</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Dîmes</span>
              <span>{formatAmount(data.dimes)}</span>
            </div>
            <div className="flex justify-between">
              <span>Offrandes Dominicales</span>
              <span>{formatAmount(data.offrandes_dominicales)}</span>
            </div>
            <div className="flex justify-between">
              <span>Dons en Ligne</span>
              <span>{formatAmount(data.dons_en_ligne)}</span>
            </div>
            <div className="flex justify-between">
              <span>Collectes Spéciales</span>
              <span>{formatAmount(data.collectes_speciales)}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total</span>
              <span>{formatAmount(totalDons)}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Répartition par Activité</h4>
          <div className="space-y-2">
            {data.repartition_activites.map((item) => (
              <div key={item.activite} className="flex justify-between">
                <span>{item.activite}</span>
                <div className="text-right">
                  <span className="mr-4">{formatAmount(item.montant)}</span>
                  <span className="text-gray-500">({item.pourcentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Analyse Mensuelle</h4>
          <div className="space-y-2">
            {data.analyse_mensuelle.map((mois) => (
              <div key={mois.mois} className="flex justify-between">
                <span>{mois.mois}</span>
                <span>{formatAmount(mois.montant)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};