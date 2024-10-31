import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const RolePermissions = () => {
  const { toast } = useToast();

  const handleSave = async () => {
    // Log the activity
    const { error: logError } = await supabase
      .from('activity_logs')
      .insert({
        action: 'update_permissions',
        details: {
          roles: ['admin', 'tresorier', 'responsable'],
          timestamp: new Date().toISOString(),
        },
      });

    if (logError) {
      console.error('Error logging activity:', logError);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Permissions mises à jour",
      description: "Les permissions ont été mises à jour avec succès",
    });
  };

  const roles = [
    {
      name: "Administrateur",
      permissions: [
        { id: "users", label: "Gestion des utilisateurs", defaultChecked: true },
        { id: "finance", label: "Gestion financière", defaultChecked: true },
        { id: "reports", label: "Rapports", defaultChecked: true },
        { id: "settings", label: "Paramètres", defaultChecked: true },
      ],
    },
    {
      name: "Trésorier",
      permissions: [
        { id: "users", label: "Gestion des utilisateurs", defaultChecked: false },
        { id: "finance", label: "Gestion financière", defaultChecked: true },
        { id: "reports", label: "Rapports", defaultChecked: true },
        { id: "settings", label: "Paramètres", defaultChecked: false },
      ],
    },
    {
      name: "Responsable",
      permissions: [
        { id: "users", label: "Gestion des utilisateurs", defaultChecked: false },
        { id: "finance", label: "Gestion financière", defaultChecked: false },
        { id: "reports", label: "Rapports", defaultChecked: true },
        { id: "settings", label: "Paramètres", defaultChecked: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {roles.map((role) => (
        <Card key={role.name} className="p-6">
          <h3 className="text-lg font-semibold mb-4">{role.name}</h3>
          <div className="space-y-4">
            {role.permissions.map((permission) => (
              <div key={permission.id} className="flex items-center justify-between">
                <Label htmlFor={`${role.name}-${permission.id}`}>
                  {permission.label}
                </Label>
                <Switch
                  id={`${role.name}-${permission.id}`}
                  defaultChecked={permission.defaultChecked}
                />
              </div>
            ))}
          </div>
        </Card>
      ))}
      <Button onClick={handleSave} className="w-full">
        Enregistrer les modifications
      </Button>
    </div>
  );
};