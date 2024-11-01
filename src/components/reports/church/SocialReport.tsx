import { Card } from "@/components/ui/card";
import { formatAmount } from "@/lib/utils";

interface ActivityData {
  nom: string;
  beneficiaires: number;
  cout_total: number;
  cout_par_beneficiaire: number;
  objectif_atteint: number;
}

interface SocialReportProps {
  activites: ActivityData[];
}

export const SocialReport = ({ activites }: SocialReportProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Rapport d'Aide Sociale et de Mission</h3>
      
      <div className="space-y-6">
        {activites.map((activite) => (
          <div key={activite.nom} className="p-4 border rounded-lg">
            <h4 className="font-medium mb-3">{activite.nom}</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Nombre de Bénéficiaires</span>
                <span>{activite.beneficiaires}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Coût Total</span>
                <span>{formatAmount(activite.cout_total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Coût par Bénéficiaire</span>
                <span>{formatAmount(activite.cout_par_beneficiaire)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Objectif Atteint</span>
                <span>{activite.objectif_atteint}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};