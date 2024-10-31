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
import { Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const UserList = () => {
  const { toast } = useToast();

  const users = [
    {
      id: 1,
      nom: "RAKOTO",
      prenom: "Jean",
      email: "jean.rakoto@eglise.mg",
      role: "Administrateur",
      statut: "Actif",
    },
    {
      id: 2,
      nom: "RABE",
      prenom: "Marie",
      email: "marie.rabe@eglise.mg",
      role: "Trésorier",
      statut: "Actif",
    },
  ];

  const handleDelete = (id: number) => {
    if (!id) return;
    
    toast({
      title: "Utilisateur supprimé",
      description: "L'utilisateur a été supprimé avec succès",
    });
  };

  return (
    <Card className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.nom || '-'}</TableCell>
              <TableCell>{user.prenom || '-'}</TableCell>
              <TableCell>{user.email || '-'}</TableCell>
              <TableCell>
                <Badge variant="outline">{user.role || '-'}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.statut === "Actif" ? "default" : "destructive"}>
                  {user.statut || '-'}
                </Badge>
              </TableCell>
              <TableCell className="space-x-2">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};