import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const DonationHistory = () => {
  const donations = [
    {
      id: 1,
      date: "2024-02-20",
      membre: "RANDRIA Jean",
      type: "Dîme",
      montant: "150,000 Ariary",
    },
    {
      id: 2,
      date: "2024-02-19",
      membre: "RABE Marie",
      type: "Offrande",
      montant: "75,000 Ariary",
    },
    {
      id: 3,
      date: "2024-02-18",
      membre: "RANDRIA Jean",
      type: "Campagne",
      montant: "500,000 Ariary",
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Type de don" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les types</SelectItem>
            <SelectItem value="dime">Dîme</SelectItem>
            <SelectItem value="offrande">Offrande</SelectItem>
            <SelectItem value="campagne">Campagne</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Membre</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell>{donation.date}</TableCell>
                <TableCell>{donation.membre}</TableCell>
                <TableCell>{donation.type}</TableCell>
                <TableCell>{donation.montant}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};