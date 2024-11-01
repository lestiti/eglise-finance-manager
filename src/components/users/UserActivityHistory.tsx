import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Activity } from "./types";

export const UserActivityHistory = ({ userId }: { userId: string }) => {
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
      return data as Activity[];
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