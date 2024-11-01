import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity } from "lucide-react";

export const AccessLogs = () => {
  const { data: logs } = useQuery({
    queryKey: ['access-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Activity className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Journaux d'Accès</h2>
      </div>

      <div className="space-y-4">
        {logs?.map((log) => (
          <div key={log.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{log.action}</p>
                <p className="text-sm text-gray-500">
                  {new Date(log.created_at).toLocaleString()}
                </p>
              </div>
              {log.details && (
                <pre className="text-xs bg-gray-50 p-2 rounded">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};