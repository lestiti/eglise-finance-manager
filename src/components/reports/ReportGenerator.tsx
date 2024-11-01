import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

const formSchema = z.object({
  type: z.string().min(1, "Veuillez sélectionner un type de rapport"),
  periode: z.string().min(1, "Veuillez sélectionner une période"),
  format: z.string().min(1, "Veuillez sélectionner un format d'export"),
});

export const ReportGenerator = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      periode: "",
      format: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const currentDate = new Date();
      const { error } = await supabase
        .from('financial_statements')
        .insert([
          {
            user_id: user?.id,
            type: values.type,
            periode: values.periode,
            annee: currentDate.getFullYear(),
            mois: values.periode === 'mensuel' ? currentDate.getMonth() + 1 : null,
            trimestre: values.periode === 'trimestriel' ? Math.floor(currentDate.getMonth() / 3) + 1 : null,
            data: {
              generated: true,
              format: values.format,
              timestamp: currentDate.toISOString()
            }
          }
        ]);

      if (error) throw error;

      toast({
        title: "Génération du rapport",
        description: "Le rapport a été généré avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du rapport",
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de Rapport</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type de rapport" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="bilan">Bilan</SelectItem>
                    <SelectItem value="compte_resultat">
                      Compte de Résultat
                    </SelectItem>
                    <SelectItem value="flux_tresorerie">
                      Flux de Trésorerie
                    </SelectItem>
                    <SelectItem value="analytique">Rapport Analytique</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="periode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Période</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la période" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mensuel">Mensuel</SelectItem>
                    <SelectItem value="trimestriel">Trimestriel</SelectItem>
                    <SelectItem value="annuel">Annuel</SelectItem>
                    <SelectItem value="personnalise">Personnalisé</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Format d'Export</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="print">Impression Directe</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Générer le Rapport
          </Button>
        </form>
      </Form>
    </Card>
  );
};