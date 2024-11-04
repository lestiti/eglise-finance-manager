import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QuickActions } from "./QuickActions";
import { DepartmentCard } from "./DepartmentCard";

export const BudgetOverview = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: departments, isLoading } = useQuery({
    queryKey: ['department-budgets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('department_budgets')
        .select(`
          *,
          budget_tracking (
            montant_utilise
          )
        `)
        .eq('annee', new Date().getFullYear());
      
      if (error) throw error;
      return data;
    }
  });

  const handleAddDepartment = async (name: string, budget: string) => {
    if (!name || !budget) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('department_budgets')
        .insert([{
          nom: name,
          budget_annuel: parseFloat(budget),
          budget_mensuel: parseFloat(budget) / 12,
          annee: new Date().getFullYear()
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le département a été créé avec succès",
      });

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
      <QuickActions onAddDepartment={handleAddDepartment} />
      {departments?.map((dept) => (
        <DepartmentCard
          key={dept.id}
          department={dept}
          onDelete={handleDeleteDepartment}
        />
      ))}
    </div>
  );
};