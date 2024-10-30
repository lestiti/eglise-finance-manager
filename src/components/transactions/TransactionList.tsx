import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

export const TransactionList = () => {
  const transactions = [
    {
      id: 1,
      date: "2024-02-20",
      type: "Don",
      montant: 250000,
      description: "Don pour le projet de rénovation",
      status: "en_attente",
    },
    {
      id: 2,
      date: "2024-02-19",
      type: "Dîme",
      montant: 100000,
      description: "Dîme mensuelle",
      status: "validé",
    },
    {
      id: 3,
      date: "2024-02-18",
      type: "Dépense",
      montant: 500000,
      description: "Facture électricité",
      status: "en_attente",
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Transactions Récentes</h2>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{transaction.type}</p>
                <p className="text-sm text-muted-foreground">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{transaction.montant.toLocaleString()} Ar</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" className="text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Valider
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600">
                    <XCircle className="h-4 w-4 mr-1" />
                    Refuser
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};