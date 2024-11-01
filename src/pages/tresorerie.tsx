import { NavigationBar } from "@/components/layout/NavigationBar";
import { TresoreryOverview } from "@/components/treasury/TresoreryOverview";
import { TresoreryForecast } from "@/components/treasury/TresoreryForecast";
import { LiquidityManagement } from "@/components/treasury/LiquidityManagement";
import { LiquidityAnalysis } from "@/components/treasury/LiquidityAnalysis";
import { TreasuryMovementForm } from "@/components/treasury/forms/TreasuryMovementForm";
import { ForecastForm } from "@/components/treasury/forms/ForecastForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Données d'exemple pour l'analyse des liquidités
const liquidityAnalysisData = {
  entrees_fonds: {
    dimes_offrandes: {
      mensuel: 75000000,
      tendance: 5.2,
    },
    promesses_dons: {
      total: 150000000,
      realise: 95000000,
    },
    dons_ponctuels: {
      evenements: {
        "Noël": 25000000,
        "Pâques": 20000000,
        "Campagne Mission": 15000000,
      },
      total: 60000000,
    },
  },
  sorties_fonds: {
    depenses_fixes: {
      salaires: 45000000,
      charges: 15000000,
      fonctionnement: 25000000,
    },
    depenses_variables: {
      evenements: 20000000,
      aide_urgence: 10000000,
      maintenance: 15000000,
    },
  },
  fonds_roulement: {
    minimum_requis: 130000000,
    actuel: 150000000,
    reserve_urgence: 15000000,
  },
  previsions: [
    {
      mois: "Juillet 2024",
      entrees_prevues: 85000000,
      sorties_prevues: 75000000,
      solde_prevu: 10000000,
    },
    {
      mois: "Août 2024",
      entrees_prevues: 80000000,
      sorties_prevues: 78000000,
      solde_prevu: 2000000,
    },
    {
      mois: "Septembre 2024",
      entrees_prevues: 90000000,
      sorties_prevues: 72000000,
      solde_prevu: 18000000,
    },
  ],
};

const TresoreriePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Gestion de la Trésorerie</h1>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="movements">Mouvements</TabsTrigger>
            <TabsTrigger value="forecast">Prévisions</TabsTrigger>
            <TabsTrigger value="liquidity">Liquidités</TabsTrigger>
            <TabsTrigger value="analysis">Analyse Détaillée</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <TresoreryOverview />
          </TabsContent>

          <TabsContent value="movements">
            <div className="space-y-6">
              <TreasuryMovementForm />
              <TresoreryOverview />
            </div>
          </TabsContent>

          <TabsContent value="forecast">
            <div className="space-y-6">
              <ForecastForm />
              <TresoreryForecast />
            </div>
          </TabsContent>

          <TabsContent value="liquidity">
            <LiquidityManagement />
          </TabsContent>

          <TabsContent value="analysis">
            <LiquidityAnalysis data={liquidityAnalysisData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TresoreriePage;