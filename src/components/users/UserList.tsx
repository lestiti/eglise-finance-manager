import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { UserActions } from "./UserActions";
import type { User } from "./types";

interface ProfileWithCounts {
  id: string;
  nom: string | null;
  prenom: string | null;
  role: string | null;
  telephone: string | null;
  email: string | null;
  created_at: string;
  transactions: { count: number }[] | null;
  activities: { count: number }[] | null;
}

export const UserList = () => {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          email,
          transactions:transactions(count),
          activities:activity_logs(count)
        `);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des utilisateurs",
          variant: "destructive",
        });
        throw error;
      }

      return (profiles as ProfileWithCounts[]).map(profile => ({
        ...profile,
        total_transactions: profile.transactions?.[0]?.count || 0,
        total_activities: profile.activities?.[0]?.count || 0
      })) as User[];
    }
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur",
        variant: "destructive",
      });
      return;
    }

    await supabase
      .from('activity_logs')
      .insert({
        action: 'delete_user',
        details: { user_id: id },
      });

    toast({
      title: "Succès",
      description: "L'utilisateur a été supprimé",
    });
    refetch();
  };

  const handleResetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le lien de réinitialisation",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Email envoyé",
      description: "Un email de réinitialisation a été envoyé",
    });
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center h-32">
          Chargement...
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Activité</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.nom || '-'}</TableCell>
              <TableCell>{user.prenom || '-'}</TableCell>
              <TableCell>{user.telephone || '-'}</TableCell>
              <TableCell>
                <Badge variant="outline">{user.role || 'utilisateur'}</Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>Transactions: {user.total_transactions}</div>
                  <div>Activités: {user.total_activities}</div>
                </div>
              </TableCell>
              <TableCell>
                <UserActions 
                  user={user}
                  onDelete={handleDelete}
                  onResetPassword={handleResetPassword}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};