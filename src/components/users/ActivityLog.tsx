import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ActivityLogEntry {
  id: string;
  user_id: string;
  action: string;
  details: any;
  created_at: string;
  profiles: {
    nom: string;
    prenom: string;
  };
}

export const ActivityLog = () => {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        profiles (
          nom,
          prenom
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger le journal d'activité",
        variant: "destructive",
      });
      return;
    }

    setActivities(data || []);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <Card className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Détails</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>{formatDate(activity.created_at)}</TableCell>
              <TableCell>
                {activity.profiles ? 
                  `${activity.profiles.prenom} ${activity.profiles.nom}` : 
                  'Utilisateur inconnu'}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {activity.action}
                </Badge>
              </TableCell>
              <TableCell>
                {activity.details ? 
                  JSON.stringify(activity.details, null, 2) : 
                  '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};