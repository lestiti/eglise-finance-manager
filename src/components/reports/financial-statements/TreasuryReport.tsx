import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TreasuryMovement {
  id: string;
  type: string;
  categorie: string;
  montant: number;
  date_mouvement: string;
  solde_apres: number;
  description: string | null;
}

export const TreasuryReport = () => {
  const { data: movements, isLoading } = useQuery({
    queryKey: ['treasury-movements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('treasury_movements')
        .select('*')
        .order('date_mouvement', { ascending: true });
      
      if (error) throw error;
      return data as TreasuryMovement[];
    }
  });

  const formatAmount = (amount: number) => amount.toLocaleString() + " Ar";

  if (isLoading) {
    return <div>Chargement des données...</div>;
  }

  const currentBalance = movements?.[movements.length - 1]?.solde_apres || 0;
  const minimumRequired = 5000000; // Example minimum required balance
  const balanceRatio = (currentBalance / minimumRequired) * 100;

  const chartData = movements?.map(movement => ({
    date: new Date(movement.date_mouvement).toLocaleDateString('fr-FR'),
    solde: movement.solde_apres,
    flux: movement.montant
  }));

  const getBalanceStatus = () => {
    if (balanceRatio < 50) return "destructive";
    if (balanceRatio < 80) return "warning";
    return "success";
  };

  const calculateMonthlyTrend = () => {
    if (!movements?.length) return 0;
    const lastMonth = movements.slice(-30);
    const totalFlux = lastMonth.reduce((sum, mov) => sum + mov.montant, 0);
    return totalFlux;
  };

  const monthlyTrend = calculateMonthlyTrend();

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Rapport de Trésorerie</h3>
      
      <div className="space-y-8">
        {/* Solde Disponible */}
        <div>
          <h4 className="font-medium mb-4">Solde Disponible</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Solde Actuel</span>
              <span className="font-medium">{formatAmount(currentBalance)}</span>
            </div>
            <Progress 
              value={balanceRatio} 
              className="h-2"
            />
            {balanceRatio < 80 && (
              <Alert variant={getBalanceStatus()}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {balanceRatio < 50 
                    ? "Attention: Niveau de trésorerie critique" 
                    : "Avertissement: Niveau de trésorerie bas"}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Flux de Trésorerie */}
        <div>
          <h4 className="font-medium mb-4">Flux de Trésorerie</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatAmount(value)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="solde" 
                  name="Solde" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="flux" 
                  name="Flux" 
                  stroke={monthlyTrend >= 0 ? "#22c55e" : "#ef4444"} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tendance Mensuelle */}
        <div>
          <h4 className="font-medium mb-4">Tendance Mensuelle</h4>
          <div className="p-4 rounded-lg bg-gray-50">
            <div className="flex justify-between items-center">
              <span>Variation nette</span>
              <span className={`font-medium ${monthlyTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {monthlyTrend >= 0 ? '+' : ''}{formatAmount(monthlyTrend)}
              </span>
            </div>
          </div>
        </div>

        {/* Derniers Mouvements */}
        <div>
          <h4 className="font-medium mb-4">Derniers Mouvements</h4>
          <div className="space-y-4">
            {movements?.slice(-5).reverse().map((movement) => (
              <div key={movement.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{movement.categorie}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(movement.date_mouvement).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <span className={`font-medium ${movement.montant >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {movement.montant >= 0 ? '+' : ''}{formatAmount(movement.montant)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};