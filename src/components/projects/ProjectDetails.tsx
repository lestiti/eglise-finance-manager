import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Users, DollarSign, Calendar } from "lucide-react";

interface ProjectDetailsProps {
  projectId: string;
}

export const ProjectDetails = ({ projectId }: ProjectDetailsProps) => {
  const { toast } = useToast();

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          donation_pledges (
            id,
            montant,
            statut,
            member:members (
              nom,
              prenom
            )
          ),
          budget_reports (
            montant_prevu,
            montant_realise
          )
        `)
        .eq('id', projectId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const handleExportReport = async () => {
    // Logique d'export à implémenter
    toast({
      title: "Export en cours",
      description: "Le rapport sera bientôt disponible",
    });
  };

  if (!project) return null;

  const totalPledges = project.donation_pledges?.reduce(
    (acc, pledge) => acc + (pledge.statut === 'confirmé' ? pledge.montant : 0), 
    0
  ) || 0;

  const progressPercentage = (project.depenses_actuelles / project.budget_total) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Budget Total</h3>
          </div>
          <p className="text-2xl font-bold mt-2">
            {project.budget_total.toLocaleString()} Ar
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Dépenses</h3>
          </div>
          <p className="text-2xl font-bold mt-2">
            {project.depenses_actuelles.toLocaleString()} Ar
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Promesses de dons</h3>
          </div>
          <p className="text-2xl font-bold mt-2">
            {totalPledges.toLocaleString()} Ar
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Durée</h3>
          </div>
          <p className="text-sm mt-2">
            {new Date(project.date_debut).toLocaleDateString('fr-FR')} - 
            {project.date_fin ? new Date(project.date_fin).toLocaleDateString('fr-FR') : 'En cours'}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Progression du Projet</h3>
        <Progress value={progressPercentage} className="h-2 mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{progressPercentage.toFixed(1)}% complété</span>
          <span>{project.statut}</span>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Promesses de Dons</h3>
        <div className="space-y-4">
          {project.donation_pledges?.map((pledge) => (
            <div key={pledge.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {pledge.member.prenom} {pledge.member.nom}
                </p>
                <p className="text-sm text-muted-foreground">
                  {pledge.montant.toLocaleString()} Ar
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                pledge.statut === 'confirmé' ? 'bg-green-100 text-green-800' :
                pledge.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {pledge.statut}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleExportReport}>
          <FileText className="h-4 w-4 mr-2" />
          Exporter le Rapport
        </Button>
      </div>
    </div>
  );
};