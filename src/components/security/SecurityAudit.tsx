import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

export const SecurityAudit = () => {
  const { toast } = useToast();
  const [isAuditing, setIsAuditing] = useState(false);

  const { data: auditResults, refetch } = useQuery({
    queryKey: ['security-audit'],
    queryFn: async () => {
      const { data: logs, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Analyser les logs pour détecter des anomalies
      const suspiciousActivities = logs?.filter(log => {
        const hoursSinceActivity = (Date.now() - new Date(log.created_at).getTime()) / (1000 * 60 * 60);
        return hoursSinceActivity < 24 && (
          log.action.includes('failed_login') ||
          log.action.includes('unauthorized_access')
        );
      });

      return {
        totalActivities: logs?.length || 0,
        suspiciousActivities: suspiciousActivities?.length || 0,
        lastAuditDate: new Date().toISOString(),
      };
    },
    enabled: false,
  });

  const startAudit = async () => {
    setIsAuditing(true);
    try {
      await refetch();
      toast({
        title: "Audit terminé",
        description: "L'audit de sécurité a été effectué avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'effectuer l'audit de sécurité",
        variant: "destructive",
      });
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Audit de Sécurité</h2>
        </div>
        <Button onClick={startAudit} disabled={isAuditing}>
          {isAuditing ? "Audit en cours..." : "Lancer un audit"}
        </Button>
      </div>

      {auditResults && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Activités totales</h3>
              <p className="text-2xl">{auditResults.totalActivities}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Activités suspectes</h3>
              <div className="flex items-center space-x-2">
                <p className="text-2xl">{auditResults.suspiciousActivities}</p>
                {auditResults.suspiciousActivities > 0 && (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Dernier audit</h3>
              <p>{new Date(auditResults.lastAuditDate).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};