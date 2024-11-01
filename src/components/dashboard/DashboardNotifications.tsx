import { Card } from "@/components/ui/card";
import { Bell, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const DashboardNotifications = () => {
  const navigate = useNavigate();
  
  const { data: notifications } = useQuery({
    queryKey: ['dashboard-notifications'],
    queryFn: async () => {
      const [donationsPromise, budgetsPromise, pledgesPromise] = await Promise.all([
        supabase
          .from('donations')
          .select('*')
          .order('date_don', { ascending: false })
          .limit(1),
        supabase
          .from('budget_tracking')
          .select('*, department_budgets(nom)')
          .order('created_at', { ascending: false })
          .limit(1),
        supabase
          .from('donation_pledges')
          .select('*, members(nom, prenom)')
          .eq('statut', 'en_attente')
          .order('date_promesse', { ascending: false })
          .limit(1)
      ]);

      return {
        lastDonation: donationsPromise.data?.[0],
        budgetAlert: budgetsPromise.data?.[0],
        pendingPledge: pledgesPromise.data?.[0]
      };
    }
  });

  const getStatus = () => "Nouveau";

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/parametres")}>
          Gérer
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {notifications?.lastDonation && (
          <div className="border-b last:border-0 pb-4 last:pb-0">
            <h4 className="font-medium">Nouveau don reçu</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {notifications.lastDonation.montant.toLocaleString()} Ar - {notifications.lastDonation.type}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {getStatus()}
            </p>
          </div>
        )}

        {notifications?.budgetAlert && (
          <div className="border-b last:border-0 pb-4 last:pb-0">
            <h4 className="font-medium">Alerte budget</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {notifications.budgetAlert.department_budgets?.nom} - 
              {Math.round((notifications.budgetAlert.montant_utilise / notifications.budgetAlert.montant_alloue) * 100)}% utilisé
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {getStatus()}
            </p>
          </div>
        )}

        {notifications?.pendingPledge && (
          <div className="border-b last:border-0 pb-4 last:pb-0">
            <h4 className="font-medium">Promesse de don en attente</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {notifications.pendingPledge.members?.nom} {notifications.pendingPledge.members?.prenom} - 
              {notifications.pendingPledge.montant.toLocaleString()} Ar
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {getStatus()}
            </p>
          </div>
        )}

        {!notifications?.lastDonation && !notifications?.budgetAlert && !notifications?.pendingPledge && (
          <p className="text-sm text-muted-foreground">Aucune notification récente</p>
        )}
      </div>
    </Card>
  );
};