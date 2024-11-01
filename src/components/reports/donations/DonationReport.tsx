import { Card } from "@/components/ui/card";
import { DonationSummary } from "./DonationSummary";
import { DonationsBySource } from "./DonationsBySource";
import { MonthlyAnalysis } from "./MonthlyAnalysis";
import { ActivityDistribution } from "./ActivityDistribution";

export const DonationReport = () => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Rapport des Dons et Offrandes</h3>
      <div className="space-y-8">
        <DonationSummary />
        <DonationsBySource />
        <MonthlyAnalysis />
        <ActivityDistribution />
      </div>
    </Card>
  );
};