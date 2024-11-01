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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const DepartmentExpenses = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("tous");

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('department_budgets')
        .select('*')
        .eq('annee', new Date().getFullYear());
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['department-transactions', selectedDepartment],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('type', 'depense')
        .order('date_transaction', { ascending: false });

      if (selectedDepartment !== "tous") {
        query = query.ilike('description', `${selectedDepartment}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Département" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les départements</SelectItem>
            {departments?.map((dept) => (
              <SelectItem key={dept.id} value={dept.nom}>
                {dept.nom}
              </SelectItem>
            ))}
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
            {transactions.map((transaction) => {
              const [department = ""] = transaction.description?.split('-') || [];
              return (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {new Date(transaction.date_transaction).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>{department.trim()}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.montant.toLocaleString()} Ar</TableCell>
                  <TableCell>{transaction.numero_facture || 'N/A'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};