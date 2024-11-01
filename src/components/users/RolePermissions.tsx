import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Permission {
  id: string;
  label: string;
  description: string;
  defaultChecked: boolean;
}

interface Role {
  name: string;
  description: string;
  permissions: Permission[];
}

export const RolePermissions = () => {
  const { toast } = useToast();

  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      return [
        {
          name: "Administrateur",
          description: "Accès complet à toutes les fonctionnalités",
          permissions: [
            { id: "users", label: "Gestion des utilisateurs", description: "Créer, modifier et supprimer des utilisateurs", defaultChecked: true },
            { id: "finance", label: "Gestion financière", description: "Accès complet aux fonctions financières", defaultChecked: true },
            { id: "reports", label: "Rapports", description: "Générer et consulter tous les rapports", defaultChecked: true },
            { id: "settings", label: "Paramètres", description: "Modifier les paramètres système", defaultChecked: true },
          ],
        },
        {
          name: "Trésorier",
          description: "Gestion des finances et des rapports",
          permissions: [
            { id: "users", label: "Gestion des utilisateurs", description: "Voir les utilisateurs uniquement", defaultChecked: false },
            { id: "finance", label: "Gestion financière", description: "Gérer les transactions et budgets", defaultChecked: true },
            { id: "reports", label: "Rapports", description: "Générer des rapports financiers", defaultChecked: true },
            { id: "settings", label: "Paramètres", description: "Paramètres limités", defaultChecked: false },
          ],
        },
        {
          name: "Responsable",
          description: "Supervision des activités",
          permissions: [
            { id: "users", label: "Gestion des utilisateurs", description: "Lecture seule", defaultChecked: false },
            { id: "finance", label: "Gestion financière", description: "Lecture seule", defaultChecked: false },
            { id: "reports", label: "Rapports", description: "Consulter les rapports", defaultChecked: true },
            { id: "settings", label: "Paramètres", description: "Aucun accès", defaultChecked: false },
          ],
        },
      ];
    }
  });

  const handleSave = async () => {
    // Log l'activité
    const { error: logError } = await supabase
      .from('activity_logs')
      .insert({
        action: 'update_permissions',
        details: {
          roles: roles?.map(r => r.name),
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

  return (
    <div className="space-y-6">
      {roles?.map((role) => (
        <Card key={role.name} className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{role.name}</h3>
              <p className="text-sm text-gray-500">{role.description}</p>
            </div>
            <div className="space-y-4">
              {role.permissions.map((permission) => (
                <div key={permission.id} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor={`${role.name}-${permission.id}`}>
                      {permission.label}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {permission.description}
                    </p>
                  </div>
                  <Switch
                    id={`${role.name}-${permission.id}`}
                    defaultChecked={permission.defaultChecked}
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
      <Button onClick={handleSave} className="w-full">
        Enregistrer les modifications
      </Button>
    </div>
  );
};