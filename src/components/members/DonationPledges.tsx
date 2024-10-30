import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const DonationPledges = () => {
  const { toast } = useToast();
  
  const pledges = [
    {
      id: 1,
      date: "2024-02-20",
      membre: "RANDRIA Jean",
      projet: "Rénovation du toit",
      montant: "1,000,000 Ariary",
      statut: "En attente",
      echeance: "2024-03-20",
    },
    {
      id: 2,
      date: "2024-02-19",
      membre: "RABE Marie",
      projet: "Système sonore",
      montant: "500,000 Ariary",
      statut: "En attente",
      echeance: "2024-03-19",
    },
  ];

  const handleReminder = (membre: string) => {
    toast({
      title: "Rappel envoyé",
      description: `Un rappel a été envoyé à ${membre}`,
    });
  };

  return (
    <Card className="p-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Membre</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead>Montant promis</TableHead>
              <TableHead>Échéance</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pledges.map((pledge) => (
              <TableRow key={pledge.id}>
                <TableCell>{pledge.date}</TableCell>
                <TableCell>{pledge.membre}</TableCell>
                <TableCell>{pledge.projet}</TableCell>
                <TableCell>{pledge.montant}</TableCell>
                <TableCell>{pledge.echeance}</TableCell>
                <TableCell>{pledge.statut}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReminder(pledge.membre)}
                  >
                    <Bell className="h-4 w-4 mr-1" />
                    Rappel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};