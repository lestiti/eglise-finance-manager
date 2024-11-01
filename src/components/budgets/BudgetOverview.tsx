import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const BudgetOverview = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptBudget, setNewDeptBudget] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: departments, isLoading } = useQuery({
    queryKey: ['department-budgets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('department_budgets')
        .select('*')
        .eq('annee', new Date().getFullYear());
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleAddDepartment = async () => {
    if (!newDeptName || !newDeptBudget) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const budget = parseFloat(newDeptBudget);
    if (isNaN(budget)) {
      toast({
        title: "Erreur",
        description: "Le budget doit être un nombre valide",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('department_budgets')
        .insert([{
          nom: newDeptName,
          budget_annuel: budget,
          budget_mensuel: budget / 12,
          annee: new Date().getFullYear()
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le département a été créé avec succès",
      });

      setNewDeptName("");
      setNewDeptBudget("");
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['department-budgets'] });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du département",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('department_budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le département a été supprimé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['department-budgets'] });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du département",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <label className="text-sm font-medium">Budget annuel (Ar)</label>
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
        const budget_tracking = dept.budget_tracking || { montant_utilise: 0 };
        const progress = (budget_tracking.montant_utilise / dept.budget_annuel) * 100;
        const remaining = dept.budget_annuel - (budget_tracking.montant_utilise || 0);
        
        return (
          <Card key={dept.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{dept.nom}</h3>
                <p className="text-sm text-muted-foreground">
                  Budget annuel: {dept.budget_annuel.toLocaleString()} Ariary
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-right">
                  <p className="font-medium">
                    Dépensé: {budget_tracking.montant_utilise?.toLocaleString() || "0"} Ariary
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Reste: {remaining.toLocaleString()} Ariary
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteDepartment(dept.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Progress value={progress} className="h-2" />
            
            {progress > 80 && (
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