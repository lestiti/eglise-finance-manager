import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const MemberList = () => {
  const members = [
    {
      id: 1,
      nom: "RANDRIA",
      prenom: "Jean",
      email: "jean.randria@email.com",
      telephone: "034 00 000 00",
      totalDons: "1 500 000 Ariary",
    },
    {
      id: 2,
      nom: "RABE",
      prenom: "Marie",
      email: "marie.rabe@email.com",
      telephone: "033 00 000 00",
      totalDons: "2 750 000 Ariary",
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un membre..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Total des dons</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.nom}</TableCell>
                <TableCell>{member.prenom}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.telephone}</TableCell>
                <TableCell>{member.totalDons}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};