import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLiquidityData = () => {
  return useQuery({
    queryKey: ['liquidity-data'],
    queryFn: async () => {
      const { data: treasuryData, error: treasuryError } = await supabase
        .from('treasury_movements')
        .select('*')
        .order('date_mouvement', { ascending: false });

      if (treasuryError) throw treasuryError;

      // Transformer les données pour correspondre au format attendu
      const formattedData = treasuryData.map(item => ({
        id: item.id,
        date: item.date_mouvement,
        type: item.type,
        categorie: item.categorie,
        montant: item.montant,
        description: item.description,
        solde_apres: item.solde_apres
      }));

      return formattedData;
    }
  });
};