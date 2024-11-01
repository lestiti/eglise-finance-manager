import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const FlowTracker = () => {
  const { data: recentMovements } = useQuery({
    queryKey: ['recent-treasury-movements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('treasury_movements')
        .select('*')
        .order('date_mouvement', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Tableau de Suivi des Flux</h4>
      <Card className="p-4">
        <div className="space-y-4">
          {recentMovements?.map((movement) => (
            <div key={movement.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{movement.categorie}</p>
                <p className="text-sm text-gray-500">
                  {new Date(movement.date_mouvement).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <span className={`font-medium ${movement.montant >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {movement.montant >= 0 ? '+' : ''}{movement.montant.toLocaleString()} Ar
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};