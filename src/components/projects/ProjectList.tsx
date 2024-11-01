import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface ProjectListProps {
  onSelectProject: (projectId: string) => void;
}

export const ProjectList = ({ onSelectProject }: ProjectListProps) => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      // Mise à jour de la requête pour utiliser la relation correcte
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          donation_pledges!project_id (
            montant,
            statut
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement des projets...</div>;
  }

  return (
    <Card className="p-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projet</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Dépenses</TableHead>
              <TableHead>Promesses de dons</TableHead>
              <TableHead>Progression</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.map((project) => {
              const depenseRatio = (project.depenses_actuelles / project.budget_total) * 100;
              const promessesDons = project.donation_pledges?.reduce((acc, pledge) => 
                pledge.statut === 'encaisse' ? acc + pledge.montant : acc, 0) || 0;
              const promessesRatio = (promessesDons / project.budget_total) * 100;
              
              return (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.nom}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.budget_total.toLocaleString()} Ar</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{project.depenses_actuelles.toLocaleString()} Ar</span>
                        <span>{depenseRatio.toFixed(0)}%</span>
                      </div>
                      <Progress value={depenseRatio} className="h-2" />
                      {depenseRatio > 90 && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Attention: Budget presque épuisé
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{promessesDons.toLocaleString()} Ar</span>
                        <span>{promessesRatio.toFixed(0)}%</span>
                      </div>
                      <Progress value={promessesRatio} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Progress 
                        value={project.statut === 'termine' ? 100 : 
                               project.statut === 'en_cours' ? 50 : 25} 
                        className="h-2" 
                      />
                      <span className="text-sm capitalize">
                        {project.statut?.replace('_', ' ')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      project.statut === 'termine' ? 'bg-green-100 text-green-800' :
                      project.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.statut}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onSelectProject(project.id)}
                    >
                      Voir détails
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};