import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Department {
  id: string;
  nom: string;
  budget_annuel: number;
  budget_tracking?: { montant_utilise: number }[];
}

interface DepartmentCardProps {
  department: Department;
  onDelete: (id: string) => Promise<void>;
}

export const DepartmentCard = ({ department, onDelete }: DepartmentCardProps) => {
  const montantUtilise = department.budget_tracking?.[0]?.montant_utilise || 0;
  const progress = (montantUtilise / department.budget_annuel) * 100;
  const remaining = department.budget_annuel - montantUtilise;

  return (
    <Card key={department.id} className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{department.nom}</h3>
          <p className="text-sm text-muted-foreground">
            Budget annuel: {department.budget_annuel.toLocaleString()} Ariary
          </p>
        </div>
        <div className="flex items-start gap-4">
          <div className="text-right">
            <p className="font-medium">
              Dépensé: {montantUtilise.toLocaleString()} Ariary
            </p>
            <p className="text-sm text-muted-foreground">
              Reste: {remaining.toLocaleString()} Ariary
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="text-red-600 hover:text-red-700"
            onClick={() => onDelete(department.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      {progress > 80 && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Le budget est presque épuisé. {progress.toFixed(1)}% utilisé.
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
};