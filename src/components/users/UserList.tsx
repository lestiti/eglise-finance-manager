import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Lock, UserCheck, History } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface User {
  id: string;
  nom: string | null;
  prenom: string | null;
  role: string | null;
  telephone: string | null;
  created_at: string;
  last_sign_in?: string;
  total_transactions?: number;
  total_activities?: number;
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

      return profiles?.map(profile => ({
        ...profile,
        total_transactions: profile.transactions?.[0]?.count || 0,
        total_activities: profile.activities?.[0]?.count || 0
      })) || [];
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
              <TableCell className="space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <History className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Historique d'activité</DialogTitle>
                    </DialogHeader>
                    <UserActivityHistory userId={user.id} />
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="icon">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleDelete(user.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleResetPassword(user.email || '')}
                >
                  <Lock className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

const UserActivityHistory = ({ userId }: { userId: string }) => {
  const { data: activities } = useQuery({
    queryKey: ['user-activities', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-4">
      {activities?.map((activity) => (
        <div key={activity.id} className="border-b pb-2">
          <div className="font-medium">{activity.action}</div>
          <div className="text-sm text-gray-500">
            {new Date(activity.created_at).toLocaleString()}
          </div>
          {activity.details && (
            <pre className="text-xs bg-gray-50 p-2 rounded mt-1">
              {JSON.stringify(activity.details, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
};