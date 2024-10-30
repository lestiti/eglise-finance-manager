import { Card } from "@/components/ui/card";
import { Euro } from "lucide-react";

export const DashboardStats = () => {
  const stats = [
    { title: "Total des dons", amount: "25,650 €", change: "+12%" },
    { title: "Dépenses", amount: "18,230 €", change: "-5%" },
    { title: "Solde de caisse", amount: "7,420 €", change: "+15%" },
    { title: "Projets en cours", amount: "3", change: "0" },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <h3 className="text-2xl font-bold mt-2">{stat.amount}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Euro className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className={`text-sm mt-2 ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
            {stat.change} par rapport au mois dernier
          </p>
        </Card>
      ))}
    </div>
  );
};