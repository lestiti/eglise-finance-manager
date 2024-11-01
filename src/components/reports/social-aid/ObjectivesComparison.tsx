import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const ObjectivesComparison = () => {
  const { data: activities } = useQuery({
    queryKey: ['charitable-activities-objectives'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('charitable_activities')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Comparaison des Objectifs</h4>
      <Card className="p-4">
        <div className="space-y-6">
          {activities?.map((activity) => {
            const budgetProgress = (Number(activity.depenses_actuelles) / Number(activity.budget_alloue)) * 100;
            const beneficiaryProgress = (activity.nombre_beneficiaires / activity.objectif_beneficiaires) * 100;
            const isOverBudget = budgetProgress > 100;

            return (
              <div key={activity.id} className="space-y-4">
                <h5 className="font-medium">{activity.nom}</h5>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget</span>
                    <span>{activity.depenses_actuelles.toLocaleString()} Ar / {activity.budget_alloue.toLocaleString()} Ar</span>
                  </div>
                  <Progress value={budgetProgress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bénéficiaires</span>
                    <span>{activity.nombre_beneficiaires} / {activity.objectif_beneficiaires}</span>
                  </div>
                  <Progress value={beneficiaryProgress} className="h-2" />
                </div>

                {isOverBudget && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Le budget alloué a été dépassé de {(budgetProgress - 100).toFixed(1)}%
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};