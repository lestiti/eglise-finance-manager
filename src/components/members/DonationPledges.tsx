import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Plus, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { PledgeForm } from "./PledgeForm";

export const DonationPledges = () => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: pledges, isLoading } = useQuery({
    queryKey: ['pledges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donation_pledges')
        .select(`
          *,
          member:members(nom, prenom)
        `)
        .order('date_echeance', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const handleReminder = async (memberId: string) => {
    toast({
      title: "Rappel envoyé",
      description: "Un rappel a été envoyé au membre",
    });
  };

  const handleValidatePayment = async (pledgeId: string) => {
    const { error } = await supabase
      .from('donation_pledges')
      .update({ statut: 'encaisse' })
      .eq('id', pledgeId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la validation de l'encaissement",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "La promesse de don a été marquée comme encaissée",
    });

    queryClient.invalidateQueries({ queryKey: ['pledges'] });
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const formatAmount = (amount: number) => 
    amount.toLocaleString('fr-FR') + " Ar";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Promesses de Dons</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Promesse
        </Button>
      </div>

      {showForm && (
        <PledgeForm />
      )}

      <Card className="p-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date promesse</TableHead>
                <TableHead>Membre</TableHead>
                <TableHead>Projet</TableHead>
                <TableHead>Montant promis</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pledges?.map((pledge) => (
                <TableRow key={pledge.id}>
                  <TableCell>
                    {format(new Date(pledge.date_promesse), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    {pledge.member.prenom} {pledge.member.nom}
                  </TableCell>
                  <TableCell>{pledge.projet}</TableCell>
                  <TableCell>{formatAmount(pledge.montant)}</TableCell>
                  <TableCell>
                    {format(new Date(pledge.date_echeance), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      pledge.statut === 'en_attente' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : pledge.statut === 'encaisse'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {pledge.statut}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {pledge.statut === 'en_attente' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReminder(pledge.member_id)}
                          >
                            <Bell className="h-4 w-4 mr-1" />
                            Rappel
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleValidatePayment(pledge.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Valider
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};