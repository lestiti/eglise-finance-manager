import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const CashFlowMonitoring = () => {
  const { data: movements } = useQuery({
    queryKey: ['treasury-movements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('treasury_movements')
        .select('*')
        .order('date_mouvement', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const chartData = movements?.map(movement => ({
    date: new Date(movement.date_mouvement).toLocaleDateString('fr-FR'),
    reel: movement.montant,
    prevu: movement.montant * 1.1 // Example calculation
  })) || [];

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Flux de Trésorerie Prévus et Réels</h4>
      <Card className="p-4">
        <div className="h-[300px]">
          <LineChart
            width={800}
            height={300}
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()} Ar`} />
            <Legend />
            <Line type="monotone" dataKey="reel" name="Flux Réel" stroke="#3b82f6" />
            <Line type="monotone" dataKey="prevu" name="Flux Prévu" stroke="#22c55e" strokeDasharray="5 5" />
          </LineChart>
        </div>
      </Card>
    </div>
  );
};