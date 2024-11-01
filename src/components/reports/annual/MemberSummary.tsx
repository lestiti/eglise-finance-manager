import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FinancialSummary {
  recettes_totales: number;
  depenses_totales: number;
  nombre_projets: number;
  nombre_beneficiaires: number;
  realisations_majeures: string[];
  objectifs_futurs: string[];
}

const isFinancialSummary = (data: unknown): data is FinancialSummary => {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Partial<FinancialSummary>;
  return (
    typeof d.recettes_totales === 'number' &&
    typeof d.depenses_totales === 'number' &&
    typeof d.nombre_projets === 'number' &&
    typeof d.nombre_beneficiaires === 'number' &&
    Array.isArray(d.realisations_majeures) &&
    Array.isArray(d.objectifs_futurs)
  );
};

export const MemberSummary = () => {
  const { data: summary } = useQuery({
    queryKey: ['financial-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_statements')
        .select('*')
        .eq('type', 'synthese')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      const rawData = data?.[0]?.data;
      if (!rawData || !isFinancialSummary(rawData)) {
        return null;
      }
      return rawData;
    }
  });

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Synthèse pour les Fidèles et le Conseil</h4>
      <Card className="p-4">
        <div className="space-y-6">
          <div>
            <h5 className="font-medium mb-4">Points Clés</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-green-600 font-medium">Recettes Totales</div>
                <div className="text-2xl font-bold">{summary?.recettes_totales?.toLocaleString()} Ar</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-red-600 font-medium">Dépenses Totales</div>
                <div className="text-2xl font-bold">{summary?.depenses_totales?.toLocaleString()} Ar</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-blue-600 font-medium">Projets Réalisés</div>
                <div className="text-2xl font-bold">{summary?.nombre_projets || 0}</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-purple-600 font-medium">Bénéficiaires Aidés</div>
                <div className="text-2xl font-bold">{summary?.nombre_beneficiaires || 0}</div>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-4">Réalisations Majeures</h5>
            <ul className="list-disc list-inside space-y-2">
              {summary?.realisations_majeures?.map((realisation: string, index: number) => (
                <li key={index}>{realisation}</li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-medium mb-4">Objectifs pour l'Année Suivante</h5>
            <ul className="list-disc list-inside space-y-2">
              {summary?.objectifs_futurs?.map((objectif: string, index: number) => (
                <li key={index}>{objectif}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};