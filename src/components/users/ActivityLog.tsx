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

export const ActivityLog = () => {
  const activities = [
    {
      id: 1,
      date: "2024-02-20 14:30",
      utilisateur: "RAKOTO Jean",
      action: "Création d'utilisateur",
      details: "Création du compte pour RABE Marie",
      type: "create",
    },
    {
      id: 2,
      date: "2024-02-20 14:15",
      utilisateur: "RABE Marie",
      action: "Modification de rôle",
      details: "Changement de rôle : Trésorier",
      type: "update",
    },
    {
      id: 3,
      date: "2024-02-20 14:00",
      utilisateur: "RAKOTO Jean",
      action: "Connexion",
      details: "Connexion au système",
      type: "info",
    },
  ];

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "create":
        return "default";
      case "update":
        return "secondary";
      case "delete":
        return "destructive";
      default:
        return "outline";
    }
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
              <TableCell>{activity.date}</TableCell>
              <TableCell>{activity.utilisateur}</TableCell>
              <TableCell>
                <Badge variant={getBadgeVariant(activity.type)}>
                  {activity.action}
                </Badge>
              </TableCell>
              <TableCell>{activity.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};