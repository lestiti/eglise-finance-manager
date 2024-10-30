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

export const DepartmentExpenses = () => {
  const expenses = [
    {
      id: 1,
      date: "2024-02-20",
      departement: "Jeunesse",
      description: "Matériel pour activité jeunes",
      montant: "250,000 Ariary",
      facture: "FAC-2024-001",
    },
    {
      id: 2,
      date: "2024-02-19",
      departement: "Maintenance",
      description: "Réparation climatisation",
      montant: "800,000 Ariary",
      facture: "FAC-2024-002",
    },
    {
      id: 3,
      date: "2024-02-18",
      departement: "Événements",
      description: "Location matériel sonorisation",
      montant: "500,000 Ariary",
      facture: "FAC-2024-003",
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Département" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les départements</SelectItem>
            <SelectItem value="jeunesse">Département Jeunesse</SelectItem>
            <SelectItem value="evenements">Département Événements</SelectItem>
            <SelectItem value="maintenance">Département Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Département</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>N° Facture</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.date}</TableCell>
                <TableCell>{expense.departement}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.montant}</TableCell>
                <TableCell>{expense.facture}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};