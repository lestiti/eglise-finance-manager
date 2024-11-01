import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatAmount } from "@/lib/utils";

interface Project {
  nom: string;
  description: string;
  budget_total: number;
  depenses_actuelles: number;
  date_debut: string;
  date_fin?: string;
  statut: string;
}

interface ProjectsReportProps {
  projects?: Project[];
}

export const ProjectsReport = ({ projects }: ProjectsReportProps) => {
  if (!projects || projects.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6">Rapport des Projets</h3>
        <p className="text-gray-500">Aucun projet en cours</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Rapport des Projets</h3>
      
      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.nom} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-medium">{project.nom}</h4>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-sm ${
                project.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                project.statut === 'termine' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {project.statut.replace('_', ' ')}
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Budget total</span>
                  <span>{formatAmount(project.budget_total)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Dépenses actuelles</span>
                  <span>{formatAmount(project.depenses_actuelles)}</span>
                </div>
                <Progress 
                  value={(project.depenses_actuelles / project.budget_total) * 100} 
                  className="h-2"
                />
              </div>
              
              <div className="flex justify-between text-sm text-gray-500">
                <span>Début: {new Date(project.date_debut).toLocaleDateString('fr-FR')}</span>
                {project.date_fin && (
                  <span>Fin: {new Date(project.date_fin).toLocaleDateString('fr-FR')}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};