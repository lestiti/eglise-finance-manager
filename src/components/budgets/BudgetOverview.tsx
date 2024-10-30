import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const BudgetOverview = () => {
  const { toast } = useToast();
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptBudget, setNewDeptBudget] = useState("");
  const [departments, setDepartments] = useState([
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
  ]);

  const handleAddDepartment = () => {
    if (!newDeptName || !newDeptBudget) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const budget = parseInt(newDeptBudget);
    if (isNaN(budget)) {
      toast({
        title: "Erreur",
        description: "Le budget doit être un nombre valide",
        variant: "destructive",
      });
      return;
    }

    setDepartments([
      ...departments,
      {
        name: newDeptName,
        budget: budget,
        spent: 0,
        alert: false,
      },
    ]);

    setNewDeptName("");
    setNewDeptBudget("");

    toast({
      title: "Succès",
      description: "Le département a été créé avec succès",
    });
  };

  const handleDeleteDepartment = (deptName: string) => {
    setDepartments(departments.filter((dept) => dept.name !== deptName));
    toast({
      title: "Succès",
      description: "Le département a été supprimé avec succès",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouveau Département
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau département</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom du département</label>
                <Input
                  placeholder="Ex: Département Communication"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget initial (Ar)</label>
                <Input
                  type="number"
                  placeholder="Ex: 5000000"
                  value={newDeptBudget}
                  onChange={(e) => setNewDeptBudget(e.target.value)}
                />
              </div>
              <Button onClick={handleAddDepartment} className="w-full">
                Créer le département
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
              <div className="flex items-start gap-4">
                <div className="text-right">
                  <p className="font-medium">
                    Dépensé: {dept.spent.toLocaleString()} Ariary
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Reste: {remaining.toLocaleString()} Ariary
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteDepartment(dept.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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