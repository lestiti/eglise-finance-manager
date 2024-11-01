import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  departement: z.string().min(1, "Veuillez sélectionner un département"),
  montant: z.string().min(1, "Le montant est requis"),
  description: z.string().min(5, "La description doit contenir au moins 5 caractères"),
  facture: z.string().min(1, "Le numéro de facture est requis"),
});

export const ExpenseForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('department_budgets')
        .select('*')
        .eq('annee', new Date().getFullYear());
      
      if (error) throw error;
      return data || [];
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departement: "",
      montant: "",
      description: "",
      facture: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Créer la transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          type: 'depense',
          montant: parseFloat(values.montant),
          description: `${values.departement} - ${values.description}`,
          numero_facture: values.facture,
          methode_paiement: 'virement',
        }]);

      if (transactionError) throw transactionError;

      // Mettre à jour le suivi budgétaire
      const { error: trackingError } = await supabase
        .from('budget_tracking')
        .upsert([{
          department_id: values.departement,
          montant_utilise: parseFloat(values.montant),
          mois: new Date().getMonth() + 1,
          annee: new Date().getFullYear(),
        }]);

      if (trackingError) throw trackingError;

      toast({
        title: "Dépense enregistrée",
        description: "La dépense a été enregistrée avec succès",
      });

      // Invalider les requêtes pour forcer le rechargement des données
      queryClient.invalidateQueries({ queryKey: ['department-budgets'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      form.reset();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la dépense",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="departement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Département</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un département" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments?.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="montant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant (Ar)</FormLabel>
                  <FormControl>
                    <Input placeholder="0 Ariary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° Facture</FormLabel>
                  <FormControl>
                    <Input placeholder="Numéro de facture" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description de la dépense" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Enregistrer la dépense</Button>
        </form>
      </Form>
    </Card>
  );
};