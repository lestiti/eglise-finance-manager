import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  mois: z.string().min(1, "Le mois est requis"),
  entrees_prevues: z.string().min(1, "Les entrées prévues sont requises"),
  sorties_prevues: z.string().min(1, "Les sorties prévues sont requises"),
});

export const ForecastForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mois: "",
      entrees_prevues: "",
      sorties_prevues: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase
        .from('treasury_movements')
        .insert([{
          type: 'prevision',
          categorie: 'forecast',
          montant: parseFloat(values.entrees_prevues) - parseFloat(values.sorties_prevues),
          description: `Prévision pour ${values.mois}`,
          solde_apres: 0, // Sera calculé automatiquement
        }]);

      if (error) throw error;

      toast({
        title: "Prévision enregistrée",
        description: "La prévision de trésorerie a été enregistrée avec succès",
      });

      queryClient.invalidateQueries({ queryKey: ['treasury-movements'] });
      form.reset();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-6">Nouvelle Prévision de Trésorerie</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="mois"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mois</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le mois" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {new Date(2024, i).toLocaleString('fr-FR', { month: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="entrees_prevues"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entrées Prévues (Ar)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sorties_prevues"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sorties Prévues (Ar)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            Enregistrer la prévision
          </Button>
        </form>
      </Form>
    </Card>
  );
};