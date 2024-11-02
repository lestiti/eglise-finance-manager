import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date_transaction', { ascending: false });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les transactions",
        variant: "destructive",
      });
      console.error('Erreur:', error);
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();

    // Souscrire aux changements en temps réel
    const subscription = supabase
      .channel('transactions-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions' 
        }, 
        (payload) => {
          console.log('Changement détecté:', payload);
          fetchTransactions(); // Recharger les données
        }
      )
      .subscribe();

    // Nettoyer la souscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('transactions')
      .update({ statut: newStatus })
      .eq('id', id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
      console.error('Erreur:', error);
      return;
    }

    toast({
      title: "Succès",
      description: "Le statut a été mis à jour avec succès",
    });
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

  if (loading) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Transactions Récentes</h2>
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <p className="text-center text-muted-foreground">Aucune transaction trouvée</p>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{transaction.type}</p>
                    {getStatusBadge(transaction.statut)}
                  </div>
                  <p className="text-sm text-muted-foreground">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.date_transaction).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Paiement: {transaction.methode_paiement}
                    {transaction.numero_facture && ` - Facture: ${transaction.numero_facture}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{transaction.montant.toLocaleString()} Ariary</p>
                  {transaction.statut === 'en_attente' && (
                    <div className="flex gap-2 mt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-green-600"
                        onClick={() => handleStatusUpdate(transaction.id, 'valide')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Valider
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600"
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