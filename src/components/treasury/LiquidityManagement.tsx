import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const LiquidityManagement = () => {
  const liquidityData = {
    disponible: 15000000,
    besoins_immediats: 12000000,
    reserve_securite: 5000000,
    fonds_roulement: 8000000,
    depenses_mensuelles: {
      salaires: 5000000,
      maintenance: 2000000,
      services: 1500000,
      aide_humanitaire: 2000000,
      autres: 1500000
    },
    previsions_encaissements: {
      dons_reguliers: 8000000,
      dimes: 4000000,
      promesses_dons: 3000000
    }
  };

  const liquidityRatio = (liquidityData.disponible / liquidityData.besoins_immediats) * 100;
  const isLiquidityLow = liquidityRatio < 120; // Alerte si moins de 120% de couverture
  
  const totalDepensesMensuelles = Object.values(liquidityData.depenses_mensuelles).reduce((a, b) => a + b, 0);
  const totalEncaissementsPrevus = Object.values(liquidityData.previsions_encaissements).reduce((a, b) => a + b, 0);
  const fondsUrgence = totalDepensesMensuelles * 0.15; // 15% des dépenses mensuelles

  return (
    <div className="space-y-6">
      <Tabs defaultValue="position" className="space-y-6">
        <TabsList>
          <TabsTrigger value="position">Position Actuelle</TabsTrigger>
          <TabsTrigger value="analysis">Analyse Détaillée</TabsTrigger>
        </TabsList>

        <TabsContent value="position">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Position de Liquidité</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Liquidités Disponibles</span>
                  <span className="text-sm font-medium">
                    {liquidityData.disponible.toLocaleString()} Ar
                  </span>
                </div>
                <Progress value={100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Besoins Immédiats</span>
                  <span className="text-sm font-medium">
                    {liquidityData.besoins_immediats.toLocaleString()} Ar
                  </span>
                </div>
                <Progress 
                  value={(liquidityData.besoins_immediats / liquidityData.disponible) * 100} 
                  className="h-2" 
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Fonds de Roulement</span>
                  <span className="text-sm font-medium">
                    {liquidityData.fonds_roulement.toLocaleString()} Ar
                  </span>
                </div>
                <Progress 
                  value={(liquidityData.fonds_roulement / liquidityData.disponible) * 100} 
                  className="h-2" 
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Réserve de Sécurité</span>
                  <span className="text-sm font-medium">
                    {liquidityData.reserve_securite.toLocaleString()} Ar
                  </span>
                </div>
                <Progress 
                  value={(liquidityData.reserve_securite / liquidityData.disponible) * 100} 
                  className="h-2" 
                />
              </div>

              {isLiquidityLow && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Attention</AlertTitle>
                  <AlertDescription>
                    Le niveau de liquidité est bas par rapport aux besoins immédiats.
                    Considérez de reporter certaines dépenses non-essentielles.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Dépenses Mensuelles</h3>
              <div className="space-y-4">
                {Object.entries(liquidityData.depenses_mensuelles).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium capitalize">{key.replace('_', ' ')}</span>
                      <span className="text-sm font-medium">
                        {value.toLocaleString()} Ar
                      </span>
                    </div>
                    <Progress 
                      value={(value / totalDepensesMensuelles) * 100} 
                      className="h-2" 
                    />
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">
                      {totalDepensesMensuelles.toLocaleString()} Ar
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Prévisions d'Encaissements</h3>
              <div className="space-y-4">
                {Object.entries(liquidityData.previsions_encaissements).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium capitalize">{key.replace('_', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {value.toLocaleString()} Ar
                        </span>
                        {value > liquidityData.previsions_encaissements.dons_reguliers ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <Progress 
                      value={(value / totalEncaissementsPrevus) * 100} 
                      className="h-2" 
                    />
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Prévu</span>
                    <span className="font-semibold">
                      {totalEncaissementsPrevus.toLocaleString()} Ar
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Fonds d'Urgence Recommandé</h4>
                <p className="text-sm text-muted-foreground">
                  15% des dépenses mensuelles : {fondsUrgence.toLocaleString()} Ar
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};