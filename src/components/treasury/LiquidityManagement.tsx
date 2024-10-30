import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const LiquidityManagement = () => {
  const liquidityData = {
    disponible: 15000000,
    besoins_immediats: 12000000,
    reserve_securite: 5000000
  };

  const liquidityRatio = (liquidityData.disponible / liquidityData.besoins_immediats) * 100;
  const isLiquidityLow = liquidityRatio < 120; // Alerte si moins de 120% de couverture

  return (
    <div className="space-y-6">
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
    </div>
  );
};