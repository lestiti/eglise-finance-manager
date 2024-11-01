import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const GeneralSettings = () => {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [churchName, setChurchName] = useState("Mon Église");
  const [currency, setCurrency] = useState("Ar");

  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Les paramètres généraux ont été mis à jour avec succès",
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Paramètres Généraux</h3>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="churchName">Nom de l'église</Label>
          <Input
            id="churchName"
            value={churchName}
            onChange={(e) => setChurchName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Devise par défaut</Label>
          <Input
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="notifications">Notifications par email</Label>
          <Switch
            id="notifications"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Enregistrer les modifications
        </Button>
      </div>
    </Card>
  );
};