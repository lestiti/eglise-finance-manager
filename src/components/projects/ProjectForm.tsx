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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

const formSchema = z.object({
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  objectif: z.string().min(1, "Veuillez sélectionner un objectif"),
  responsable: z.string().min(3, "Le responsable doit être spécifié"),
  budget: z.string().min(1, "Le budget est requis"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
});

export const ProjectForm = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      objectif: "",
      responsable: "",
      budget: "",
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast({
      title: "Projet créé",
      description: "Le projet a été créé avec succès",
    });
    form.reset();
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
                  <Input placeholder="Ex: Rénovation de l'Église" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="objectif"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objectif</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner l'objectif" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="renovation">Rénovation</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="caritatif">Action Caritative</SelectItem>
                    <SelectItem value="evangelisation">Évangélisation</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="responsable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsable</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du responsable" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget (Ar)</FormLabel>
                  <FormControl>
                    <Input placeholder="0 Ariary" {...field} />
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

          <Button type="submit" className="w-full">Créer le Projet</Button>
        </form>
      </Form>
    </Card>
  );
};