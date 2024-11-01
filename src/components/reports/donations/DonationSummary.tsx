import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatAmount } from "@/lib/utils";

export const DonationSummary = () => {
  const { data: donations } = useQuery({
    queryKey: ['donations-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('type, montant')
        .gte('date_don', new Date(new Date().getFullYear(), 0, 1).toISOString());
      
      if (error) throw error;
      return data;
    }
  });

  const totals = donations?.reduce((acc, donation) => {
    acc[donation.type] = (acc[donation.type] || 0) + Number(donation.montant);
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Détail des Recettes</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Dîmes</div>
          <div className="text-2xl font-bold">{formatAmount(totals['dime'] || 0)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Offrandes Dominicales</div>
          <div className="text-2xl font-bold">{formatAmount(totals['offrande'] || 0)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Dons en Ligne</div>
          <div className="text-2xl font-bold">{formatAmount(totals['don_ligne'] || 0)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Collectes Spéciales</div>
          <div className="text-2xl font-bold">{formatAmount(totals['collecte_speciale'] || 0)}</div>
        </Card>
      </div>
    </div>
  );
};