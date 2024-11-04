import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2, Search, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { formatAmount } from "@/lib/utils";

interface Transaction {
  id: string;
  date_transaction: string;
  type: string;
  montant: number;
  description: string;
  statut: string;
  methode_paiement: string;
  numero_facture?: string;
}

export const TransactionList = () => {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('transactions')
        .select('*')
        .order('date_transaction', { ascending: false });

      if (!isAdmin) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Transaction[];
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ statut: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le statut a été mis à jour avec succès",
      });

      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    } catch (error: any) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valide':
        return <Badge variant="default" className="bg-green-500">Validé</Badge>;
      case 'refuse':
        return <Badge variant="destructive">Refusé</Badge>;
      default:
        return <Badge variant="secondary">En attente</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'don':
        return 'Don';
      case 'dime':
        return 'Dîme';
      case 'depense':
        return 'Dépense';
      default:
        return 'Autre';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.description.toLowerCase().includes(searchLower) ||
      transaction.type.toLowerCase().includes(searchLower) ||
      transaction.methode_paiement.toLowerCase().includes(searchLower) ||
      (transaction.numero_facture && transaction.numero_facture.toLowerCase().includes(searchLower))
    );
  });

  if (isLoading) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Transactions Récentes</h2>
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {searchTerm ? "Aucune transaction trouvée pour cette recherche" : "Aucune transaction trouvée"}
          </p>
        ) : (
          filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{getTypeLabel(transaction.type)}</p>
                    {getStatusBadge(transaction.statut)}
                  </div>
                  <p className="text-sm text-muted-foreground">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.date_transaction).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Paiement: {transaction.methode_paiement}
                    {transaction.numero_facture && (
                      <span className="ml-2 flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Facture: {transaction.numero_facture}
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{formatAmount(transaction.montant)}</p>
                  {transaction.statut === 'en_attente' && isAdmin && (
                    <div className="flex gap-2 mt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleStatusUpdate(transaction.id, 'valide')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Valider
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleStatusUpdate(transaction.id, 'refuse')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Refuser
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};