import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const BackupManager = () => {
  const [backups, setBackups] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    const { data, error } = await supabase
      .from('backup_metadata')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les sauvegardes",
        variant: "destructive",
      });
      return;
    }

    setBackups(data || []);
  };

  const createBackup = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer une sauvegarde",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('backup_metadata')
      .insert({
        user_id: user.id,
        backup_type: 'full',
        status: 'completed'
      });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la sauvegarde",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sauvegarde créée",
      description: "La sauvegarde a été créée avec succès",
    });
    
    fetchBackups();
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestionnaire de Sauvegardes</h2>
        <Button onClick={createBackup}>Nouvelle Sauvegarde</Button>
      </div>
      
      <div className="space-y-4">
        {backups.map((backup) => (
          <Card key={backup.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Type: {backup.backup_type}</p>
                <p className="text-sm text-gray-500">
                  Créée le: {new Date(backup.created_at).toLocaleString()}
                </p>
              </div>
              <Badge variant={backup.status === 'completed' ? 'success' : 'warning'}>
                {backup.status}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};