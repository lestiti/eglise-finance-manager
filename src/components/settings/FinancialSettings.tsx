import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const FinancialSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    budgetWarningThreshold: "20",
    autoReconciliation: true,
    defaultBudgetPeriod: "monthly",
    requireApproval: true,
  });

  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Les paramètres financiers ont été mis à jour",
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Paramètres Financiers</h3>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="threshold">Seuil d'alerte budget (%)</Label>
          <Input
            id="threshold"
            type="number"
            value={settings.budgetWarningThreshold}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              budgetWarningThreshold: e.target.value
            }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="autoReconciliation">Réconciliation automatique</Label>
          <Switch
            id="autoReconciliation"
            checked={settings.autoReconciliation}
            onCheckedChange={(checked) => setSettings(prev => ({
              ...prev,
              autoReconciliation: checked
            }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budgetPeriod">Période de budget par défaut</Label>
          <select
            id="budgetPeriod"
            className="w-full p-2 border rounded"
            value={settings.defaultBudgetPeriod}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              defaultBudgetPeriod: e.target.value
            }))}
          >
            <option value="monthly">Mensuel</option>
            <option value="quarterly">Trimestriel</option>
            <option value="yearly">Annuel</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="requireApproval">
            Approbation requise pour les transactions importantes
          </Label>
          <Switch
            id="requireApproval"
            checked={settings.requireApproval}
            onCheckedChange={(checked) => setSettings(prev => ({
              ...prev,
              requireApproval: checked
            }))}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Enregistrer les paramètres
        </Button>
      </div>
    </Card>
  );
};