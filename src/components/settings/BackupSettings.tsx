import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const BackupSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    retentionPeriod: "30",
    encryptBackups: true,
  });

  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Les paramètres de sauvegarde ont été mis à jour",
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Paramètres de Sauvegarde</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="autoBackup">Sauvegarde automatique</Label>
          <Switch
            id="autoBackup"
            checked={settings.autoBackup}
            onCheckedChange={(checked) => setSettings(prev => ({
              ...prev,
              autoBackup: checked
            }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency">Fréquence des sauvegardes</Label>
          <select
            id="frequency"
            className="w-full p-2 border rounded"
            value={settings.backupFrequency}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              backupFrequency: e.target.value
            }))}
          >
            <option value="hourly">Toutes les heures</option>
            <option value="daily">Quotidienne</option>
            <option value="weekly">Hebdomadaire</option>
            <option value="monthly">Mensuelle</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="retention">
            Période de rétention (jours)
          </Label>
          <Input
            id="retention"
            type="number"
            value={settings.retentionPeriod}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              retentionPeriod: e.target.value
            }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="encrypt">Chiffrer les sauvegardes</Label>
          <Switch
            id="encrypt"
            checked={settings.encryptBackups}
            onCheckedChange={(checked) => setSettings(prev => ({
              ...prev,
              encryptBackups: checked
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