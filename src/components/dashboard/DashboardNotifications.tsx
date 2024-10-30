import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";

export const DashboardNotifications = () => {
  const notifications = [
    {
      title: "Promesse de don à recevoir",
      description: "M. Dupont - 500€ pour le projet de rénovation",
      date: "Aujourd'hui",
    },
    {
      title: "Budget département Jeunesse",
      description: "80% du budget mensuel utilisé",
      date: "Hier",
    },
    {
      title: "Échéance de paiement",
      description: "Facture électricité à régler",
      date: "Dans 3 jours",
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Notifications</h3>
      </div>
      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
            <h4 className="font-medium">{notification.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
            <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};