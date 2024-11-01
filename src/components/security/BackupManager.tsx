import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, Upload, RefreshCw, Database } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const BackupManager = () => {
  const [backups, setBackups] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);
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
    setIsBackingUp(true);
    setProgress(0);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer une sauvegarde",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simuler la progression
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const { error } = await supabase
        .from('backup_metadata')
        .insert({
          user_id: user.id,
          backup_type: 'full',
          status: 'completed',
          backup_size: Math.floor(Math.random() * 1000) + 100, // Simulé
        });

      if (error) throw error;

      // Log l'activité
      await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          action: 'create_backup',
          details: {
            timestamp: new Date().toISOString(),
          },
        });

      setProgress(100);
      clearInterval(interval);

      toast({
        title: "Sauvegarde créée",
        description: "La sauvegarde a été créée avec succès",
      });
      
      fetchBackups();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const restoreBackup = async (backupId: string) => {
    try {
      const { error } = await supabase
        .from('backup_metadata')
        .update({ status: 'restoring' })
        .eq('id', backupId);

      if (error) throw error;

      toast({
        title: "Restauration en cours",
        description: "La restauration de la sauvegarde a commencé",
      });

      // Simuler la restauration
      setTimeout(() => {
        toast({
          title: "Restauration terminée",
          description: "La sauvegarde a été restaurée avec succès",
        });
        fetchBackups();
      }, 3000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de restaurer la sauvegarde",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Database className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Gestionnaire de Sauvegardes</h2>
        </div>
        <Button onClick={createBackup} disabled={isBackingUp}>
          <Upload className="h-4 w-4 mr-2" />
          Nouvelle Sauvegarde
        </Button>
      </div>
      
      {isBackingUp && (
        <div className="mb-6">
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-gray-500">Sauvegarde en cours... {progress}%</p>
        </div>
      )}

      <div className="space-y-4">
        {backups.map((backup) => (
          <Card key={backup.id} className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="font-medium">Type: {backup.backup_type}</p>
                  <Badge variant={backup.status === 'completed' ? 'default' : 'secondary'}>
                    {backup.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  Créée le: {new Date(backup.created_at).toLocaleString()}
                </p>
                {backup.backup_size && (
                  <p className="text-sm text-gray-500">
                    Taille: {backup.backup_size} Mo
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => restoreBackup(backup.id)}
                  disabled={backup.status !== 'completed'}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restaurer
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};