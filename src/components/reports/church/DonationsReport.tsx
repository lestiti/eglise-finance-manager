import { Card } from "@/components/ui/card";
import { formatAmount } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DonationData {
  type: string;
  montant: number;
  source: string;
  activite?: string;
  date_don: string;
}

interface DonationsReportProps {
  donations?: DonationData[];
}

export const DonationsReport = ({ donations }: DonationsReportProps) => {
  if (!donations || donations.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6">Rapport des Dons et Offrandes</h3>
        <p className="text-gray-500">Aucune donnée disponible</p>
      </Card>
    );
  }

  const donsByType = donations.reduce((acc, don) => {
    acc[don.type] = (acc[don.type] || 0) + don.montant;
    return acc;
  }, {} as Record<string, number>);

  const donsBySource = donations.reduce((acc, don) => {
    acc[don.source] = (acc[don.source] || 0) + don.montant;
    return acc;
  }, {} as Record<string, number>);

  const donsByActivity = donations.reduce((acc, don) => {
    if (don.activite) {
      acc[don.activite] = (acc[don.activite] || 0) + don.montant;
    }
    return acc;
  }, {} as Record<string, number>);

  const monthlyData = donations.reduce((acc, don) => {
    const month = new Date(don.date_don).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    acc[month] = (acc[month] || 0) + don.montant;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(monthlyData).map(([month, montant]) => ({
    month,
    montant
  }));

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Rapport des Dons et Offrandes</h3>
      
      <div className="space-y-8">
        <div>
          <h4 className="font-medium mb-4">Détail des Recettes par Type</h4>
          <div className="space-y-2">
            {Object.entries(donsByType).map(([type, montant]) => (
              <div key={type} className="flex justify-between">
                <span className="capitalize">{type.replace('_', ' ')}</span>
                <span>{formatAmount(montant)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Répartition par Source</h4>
          <div className="space-y-2">
            {Object.entries(donsBySource).map(([source, montant]) => (
              <div key={source} className="flex justify-between">
                <span className="capitalize">{source.replace('_', ' ')}</span>
                <span>{formatAmount(montant)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Analyse Mensuelle</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatAmount(Number(value))} />
                <Bar dataKey="montant" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Répartition par Activité</h4>
          <div className="space-y-2">
            {Object.entries(donsByActivity).map(([activite, montant]) => {
              const percentage = (montant / donations.reduce((sum, don) => sum + don.montant, 0)) * 100;
              return (
                <div key={activite} className="flex justify-between">
                  <span className="capitalize">{activite.replace('_', ' ')}</span>
                  <div className="text-right">
                    <span className="mr-4">{formatAmount(montant)}</span>
                    <span className="text-gray-500">({percentage.toFixed(1)}%)</span>
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