import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AvailableBalance = () => {
  const { data: latestMovement } = useQuery({
    queryKey: ['latest-treasury-balance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('treasury_movements')
        .select('solde_apres')
        .order('date_mouvement', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data?.[0];
    }
  });

  const currentBalance = latestMovement?.solde_apres || 0;
  const minimumRequired = 5000000; // Example minimum balance
  const balanceRatio = (currentBalance / minimumRequired) * 100;

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Solde Disponible</h4>
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Solde Actuel</span>
            <span className="font-medium">{currentBalance.toLocaleString()} Ar</span>
          </div>
          <Progress value={balanceRatio} className="h-2" />
          {balanceRatio < 80 && (
            <Alert variant={balanceRatio < 50 ? "destructive" : "default"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {balanceRatio < 50 
                  ? "Attention: Niveau de trésorerie critique" 
                  : "Avertissement: Niveau de trésorerie bas"}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>
    </div>
  );
};