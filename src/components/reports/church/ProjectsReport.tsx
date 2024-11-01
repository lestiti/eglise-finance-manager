import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatAmount } from "@/lib/utils";

interface ProjectData {
  nom: string;
  budget: number;
  depenses: number;
  statut: string;
  description: string;
}

interface ProjectsReportProps {
  projets: ProjectData[];
}

export const ProjectsReport = ({ projets }: ProjectsReportProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Rapport des Projets</h3>
      
      <div className="space-y-6">
        {projets.map((projet) => (
          <div key={projet.nom} className="p-4 border rounded-lg">
            <div className="flex justify-between mb-2">
              <h4 className="font-medium">{projet.nom}</h4>
              <span className="text-sm px-2 py-1 rounded-full bg-gray-100">
                {projet.statut}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{projet.description}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Budget Total</span>
                <span>{formatAmount(projet.budget)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Dépenses</span>
                <span>{formatAmount(projet.depenses)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Reste à Dépenser</span>
                <span>{formatAmount(projet.budget - projet.depenses)}</span>
              </div>
              
              <Progress 
                value={(projet.depenses / projet.budget) * 100} 
                className="h-2 mt-2"
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};