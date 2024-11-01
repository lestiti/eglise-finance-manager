import { Card } from "@/components/ui/card";
import { CharitableActivitiesExpenses } from "./CharitableActivitiesExpenses";
import { CharitableImpact } from "./CharitableImpact";
import { CharitableFunding } from "./CharitableFunding";
import { ObjectivesComparison } from "./ObjectivesComparison";

export const SocialAidReport = () => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Rapport d'Aide Sociale et de Mission</h3>
      <div className="space-y-8">
        <CharitableActivitiesExpenses />
        <CharitableImpact />
        <CharitableFunding />
        <ObjectivesComparison />
      </div>
    </Card>
  );
};