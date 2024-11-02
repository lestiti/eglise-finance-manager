import { Card } from "@/components/ui/card";
import { Bell, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Extraction des fonctions de requête
const fetchDonations = async () => {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .order('date_don', { ascending: false })
    .limit(1);
  
  if (error) throw error;
  return data?.[0];
};

const fetchBudgets = async () => {
  const { data, error } = await supabase
    .from('budget_tracking')
    .select('*, department_budgets(nom)')
    .order('created_at', { ascending: false })
    .limit(1);
  
  if (error) throw error;
  return data?.[0];
};

const fetchPledges = async () => {
  const { data, error } = await supabase
    .from('donation_pledges')
    .select('*, members(nom, prenom)')
    .eq('statut', 'en_attente')
    .order('date_promesse', { ascending: false })
    .limit(1);
  
  if (error) throw error;
  return data?.[0];
};

export const DashboardNotifications = () => {
  const navigate = useNavigate();
  
  const { data: lastDonation } = useQuery({
    queryKey: ['last-donation'],
    queryFn: fetchDonations,
    staleTime: 30000, // 30 secondes
    gcTime: 300000, // 5 minutes
  });

  const { data: budgetAlert } = useQuery({
    queryKey: ['budget-alert'],
    queryFn: fetchBudgets,
    staleTime: 30000,
    gcTime: 300000,
  });

  const { data: pendingPledge } = useQuery({
    queryKey: ['pending-pledge'],
    queryFn: fetchPledges,
    staleTime: 30000,
    gcTime: 300000,
  });

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
        {lastDonation && (
          <div className="border-b last:border-0 pb-4 last:pb-0">
            <h4 className="font-medium">Nouveau don reçu</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {lastDonation.montant.toLocaleString()} Ar - {lastDonation.type}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Nouveau</p>
          </div>
        )}

        {budgetAlert && (
          <div className="border-b last:border-0 pb-4 last:pb-0">
            <h4 className="font-medium">Alerte budget</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {budgetAlert.department_budgets?.nom} - 
              {Math.round((budgetAlert.montant_utilise / budgetAlert.montant_alloue) * 100)}% utilisé
            </p>
            <p className="text-xs text-muted-foreground mt-1">Nouveau</p>
          </div>
        )}

        {pendingPledge && (
          <div className="border-b last:border-0 pb-4 last:pb-0">
            <h4 className="font-medium">Promesse de don en attente</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {pendingPledge.members?.nom} {pendingPledge.members?.prenom} - 
              {pendingPledge.montant.toLocaleString()} Ar
            </p>
            <p className="text-xs text-muted-foreground mt-1">Nouveau</p>
          </div>
        )}

        {!lastDonation && !budgetAlert && !pendingPledge && (
          <p className="text-sm text-muted-foreground">Aucune notification récente</p>
        )}
      </div>
    </Card>
  );
};