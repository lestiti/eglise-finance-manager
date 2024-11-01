import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatAmount } from "@/lib/utils";

interface CharitableActivity {
  nom: string;
  description: string;
  budget_alloue: number;
  depenses_actuelles: number;
  nombre_beneficiaires: number;
  objectif_beneficiaires: number;
}

interface SocialReportProps {
  activities?: CharitableActivity[];
}

export const SocialReport = ({ activities }: SocialReportProps) => {
  if (!activities || activities.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6">Rapport d'Aide Sociale et de Mission</h3>
        <p className="text-gray-500">Aucune activité caritative en cours</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Rapport d'Aide Sociale et de Mission</h3>
      
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.nom} className="border rounded-lg p-4">
            <div className="mb-4">
              <h4 className="font-medium">{activity.nom}</h4>
              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Budget alloué</span>
                  <span>{formatAmount(activity.budget_alloue)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Dépenses actuelles</span>
                  <span>{formatAmount(activity.depenses_actuelles)}</span>
                </div>
                <Progress 
                  value={(activity.depenses_actuelles / activity.budget_alloue) * 100} 
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Bénéficiaires actuels</span>
                  <span>{activity.nombre_beneficiaires}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Objectif bénéficiaires</span>
                  <span>{activity.objectif_beneficiaires}</span>
                </div>
                <Progress 
                  value={(activity.nombre_beneficiaires / activity.objectif_beneficiaires) * 100} 
                  className="h-2"
                />
              </div>
              
              <div className="text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Coût par bénéficiaire</span>
                  <span>
                    {formatAmount(activity.depenses_actuelles / activity.nombre_beneficiaires)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};