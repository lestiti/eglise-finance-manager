import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatAmount } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const DepartmentExpenses = () => {
  const { data: transactions } = useQuery({
    queryKey: ['department-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', 'depense')
        .order('date_transaction', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Dépenses par Département</h4>
      <Card className="p-4">
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
            {transactions?.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.date_transaction).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>
                  {transaction.description?.split('-')[0]?.trim() || 'N/A'}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{formatAmount(Number(transaction.montant))}</TableCell>
                <TableCell>{transaction.numero_facture || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};