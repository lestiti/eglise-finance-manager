import { Card } from "@/components/ui/card";
import { CashFlowMonitoring } from "./treasury/CashFlowMonitoring";
import { AvailableBalance } from "./treasury/AvailableBalance";
import { CashFlowForecast } from "./treasury/CashFlowForecast";
import { FlowTracker } from "./treasury/FlowTracker";

export const Notes = () => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Rapport de Trésorerie</h3>
      
      <div className="space-y-8">
        <CashFlowMonitoring />
        <AvailableBalance />
        <CashFlowForecast />
        <FlowTracker />
      </div>
    </Card>
  );
};