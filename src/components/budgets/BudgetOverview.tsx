import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const BudgetOverview = () => {
  const departments = [
    {
      name: "Département Jeunesse",
      budget: 5000000,
      spent: 4000000,
      alert: true,
    },
    {
      name: "Département Événements",
      budget: 8000000,
      spent: 5000000,
      alert: false,
    },
    {
      name: "Département Maintenance",
      budget: 6000000,
      spent: 2000000,
      alert: false,
    },
  ];

  return (
    <div className="space-y-6">
      {departments.map((dept) => {
        const progress = (dept.spent / dept.budget) * 100;
        const remaining = dept.budget - dept.spent;
        
        return (
          <Card key={dept.name} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{dept.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Budget: {dept.budget.toLocaleString()} Ariary
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  Dépensé: {dept.spent.toLocaleString()} Ariary
                </p>
                <p className="text-sm text-muted-foreground">
                  Reste: {remaining.toLocaleString()} Ariary
                </p>
              </div>
            </div>
            
            <Progress value={progress} className="h-2" />
            
            {dept.alert && progress > 80 && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Attention</AlertTitle>
                <AlertDescription>
                  Le budget est presque épuisé. {progress.toFixed(1)}% utilisé.
                </AlertDescription>
              </Alert>
            )}
          </Card>
        );
      })}
    </div>
  );
};