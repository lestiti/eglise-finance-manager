import { Card } from "@/components/ui/card";
import { AnnualOverview } from "./AnnualOverview";
import { AssetsLiabilities } from "./AssetsLiabilities";
import { MultiYearComparison } from "./MultiYearComparison";
import { MemberSummary } from "./MemberSummary";

export const AnnualReport = () => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Rapport Annuel de l'Église</h3>
      <div className="space-y-8">
        <AnnualOverview />
        <AssetsLiabilities />
        <MultiYearComparison />
        <MemberSummary />
      </div>
    </Card>
  );
};