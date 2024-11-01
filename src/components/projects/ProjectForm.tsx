import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  budget_total: z.string().min(1, "Le budget est requis"),
  date_debut: z.string().min(1, "La date de début est requise"),
  date_fin: z.string().optional(),
  statut: z.string().min(1, "Le statut est requis"),
});

export const ProjectForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      description: "",
      budget_total: "",
      date_debut: new Date().toISOString().split('T')[0],
      date_fin: "",
      statut: "en_cours",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Créer le projet
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert([{
          nom: values.nom,
          description: values.description,
          budget_total: parseFloat(values.budget_total),
          date_debut: values.date_debut,
          date_fin: values.date_fin || null,
          statut: values.statut,
        }])
        .select()
        .single();

      if (projectError) throw projectError;

      // Créer un rapport budgétaire initial
      const { error: reportError } = await supabase
        .from('budget_reports')
        .insert([{
          montant_prevu: parseFloat(values.budget_total),
          montant_realise: 0,
          periode: 'projet',
          annee: new Date().getFullYear(),
        }]);

      if (reportError) throw reportError;

      toast({
        title: "Projet créé",
        description: "Le projet a été créé avec succès",
      });

      // Invalider les requêtes pour forcer le rechargement des données
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['budget-reports'] });

      form.reset();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du projet",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du Projet</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Construction Centre Communautaire" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Description détaillée du projet" 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="budget_total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Total (Ar)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="statut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="en_pause">En pause</SelectItem>
                      <SelectItem value="termine">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_debut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de début</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_fin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de fin (optionnelle)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            Créer le Projet
          </Button>
        </form>
      </Form>
    </Card>
  );
};