import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const NotificationSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    newDonations: true,
    lowBudgetAlert: true,
    monthlyReport: true,
    membershipUpdates: true,
    securityAlerts: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Les paramètres de notification ont été mis à jour",
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Paramètres de Notification</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="newDonations">Nouvelles donations</Label>
          <Switch
            id="newDonations"
            checked={settings.newDonations}
            onCheckedChange={() => handleToggle('newDonations')}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="lowBudgetAlert">Alertes de budget bas</Label>
          <Switch
            id="lowBudgetAlert"
            checked={settings.lowBudgetAlert}
            onCheckedChange={() => handleToggle('lowBudgetAlert')}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="monthlyReport">Rapports mensuels</Label>
          <Switch
            id="monthlyReport"
            checked={settings.monthlyReport}
            onCheckedChange={() => handleToggle('monthlyReport')}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="membershipUpdates">Mises à jour des membres</Label>
          <Switch
            id="membershipUpdates"
            checked={settings.membershipUpdates}
            onCheckedChange={() => handleToggle('membershipUpdates')}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="securityAlerts">Alertes de sécurité</Label>
          <Switch
            id="securityAlerts"
            checked={settings.securityAlerts}
            onCheckedChange={() => handleToggle('securityAlerts')}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Enregistrer les préférences
        </Button>
      </div>
    </Card>
  );
};