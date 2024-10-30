import { NavigationBar } from "@/components/layout/NavigationBar";
import { TresoreryOverview } from "@/components/treasury/TresoreryOverview";
import { TresoreryForecast } from "@/components/treasury/TresoreryForecast";
import { LiquidityManagement } from "@/components/treasury/LiquidityManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TresoreriePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Gestion de la Trésorerie</h1>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="forecast">Prévisions</TabsTrigger>
            <TabsTrigger value="liquidity">Liquidités</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <TresoreryOverview />
          </TabsContent>

          <TabsContent value="forecast">
            <TresoreryForecast />
          </TabsContent>

          <TabsContent value="liquidity">
            <LiquidityManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TresoreriePage;