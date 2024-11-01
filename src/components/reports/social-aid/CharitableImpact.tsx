import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

export const CharitableImpact = () => {
  const { data: activities } = useQuery({
    queryKey: ['charitable-activities-impact'],
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
      <h4 className="text-lg font-medium">Impact Financier des Activités</h4>
      <Card className="p-4">
        <div className="space-y-6">
          {activities?.map((activity) => {
            const costPerBeneficiary = activity.nombre_beneficiaires 
              ? Number(activity.depenses_actuelles) / activity.nombre_beneficiaires 
              : 0;

            return (
              <div key={activity.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{activity.nom}</span>
                  <span className="text-sm text-muted-foreground">
                    {costPerBeneficiary.toLocaleString()} Ar/bénéficiaire
                  </span>
                </div>
                <Progress 
                  value={(activity.nombre_beneficiaires / activity.objectif_beneficiaires) * 100} 
                  className="h-2" 
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{activity.nombre_beneficiaires} bénéficiaires</span>
                  <span>Objectif: {activity.objectif_beneficiaires}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};