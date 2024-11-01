import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProjectData {
  id: string;
  nom: string;
  budget_total: number;
  depenses_actuelles: number;
  statut: string;
  date_debut: string;
  date_fin: string | null;
}

export const ProjectManagementReport = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects-report'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('date_debut', { ascending: false });
      
      if (error) throw error;
      return data as ProjectData[];
    }
  });

  const formatAmount = (amount: number) => amount.toLocaleString() + " Ar";

  if (isLoading) {
    return <div>Chargement des données...</div>;
  }

  const calculateProgress = (spent: number, total: number) => {
    return (spent / total) * 100;
  };

  const getProgressColor = (progress: number) => {
    if (progress > 100) return "bg-destructive";
    if (progress > 80) return "bg-warning";
    return "bg-primary";
  };

  const chartData = projects?.map(project => ({
    name: project.nom,
    budget: project.budget_total,
    depenses: project.depenses_actuelles,
    restant: project.budget_total - project.depenses_actuelles
  }));

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Rapport de Gestion des Projets</h3>
      
      <div className="space-y-8">
        {/* Dépenses par Projet */}
        <div>
          <h4 className="font-medium mb-4">Dépenses par Projet</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatAmount(value)} />
                <Legend />
                <Bar dataKey="depenses" name="Dépenses" fill="#ef4444" />
                <Bar dataKey="restant" name="Budget Restant" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Avancement des Budgets Projet */}
        <div>
          <h4 className="font-medium mb-4">Avancement des Budgets Projet</h4>
          <div className="space-y-4">
            {projects?.map((project) => {
              const progress = calculateProgress(project.depenses_actuelles, project.budget_total);
              return (
                <div key={project.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{project.nom}</span>
                    <span className="text-sm text-gray-500">
                      {formatAmount(project.depenses_actuelles)} / {formatAmount(project.budget_total)}
                    </span>
                  </div>
                  <Progress 
                    value={progress} 
                    className={`h-2 ${getProgressColor(progress)}`}
                  />
                  {progress > 90 && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Attention: Budget presque épuisé
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* État des Recettes et Dépenses */}
        <div>
          <h4 className="font-medium mb-4">État des Recettes et Dépenses</h4>
          <div className="space-y-4">
            {projects?.map((project) => {
              const remaining = project.budget_total - project.depenses_actuelles;
              const isOverBudget = remaining < 0;
              
              return (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">{project.nom}</h5>
                      <p className="text-sm text-gray-500">
                        {new Date(project.date_debut).toLocaleDateString('fr-FR')} - 
                        {project.date_fin ? new Date(project.date_fin).toLocaleDateString('fr-FR') : 'En cours'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Budget: {formatAmount(project.budget_total)}</p>
                      <p className="text-sm">Dépenses: {formatAmount(project.depenses_actuelles)}</p>
                      <p className={`text-sm ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
                        {isOverBudget ? 'Dépassement:' : 'Restant:'} {formatAmount(Math.abs(remaining))}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};