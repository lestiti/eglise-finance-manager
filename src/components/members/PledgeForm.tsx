import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const PledgeForm = () => {
  const [membre, setMembre] = useState("");
  const [projet, setProjet] = useState("");
  const [montant, setMontant] = useState("");
  const [dateEcheance, setDateEcheance] = useState<Date>();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: members } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('id, nom, prenom');
      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateEcheance || !membre || !projet || !montant) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('donation_pledges')
      .insert([
        {
          member_id: membre,
          projet,
          montant: parseFloat(montant),
          date_echeance: dateEcheance.toISOString(),
          notes,
        }
      ]);

    setLoading(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la promesse",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "La promesse de don a été enregistrée",
    });

    // Reset form
    setMembre("");
    setProjet("");
    setMontant("");
    setDateEcheance(undefined);
    setNotes("");
    
    // Refresh pledges list
    queryClient.invalidateQueries({ queryKey: ['pledges'] });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Nouvelle Promesse de Don</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Membre</label>
            <Select value={membre} onValueChange={setMembre}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un membre" />
              </SelectTrigger>
              <SelectContent>
                {members?.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.prenom} {member.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Projet</label>
            <Input 
              placeholder="Nom du projet" 
              value={projet}
              onChange={(e) => setProjet(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Montant (Ar)</label>
            <Input 
              type="number" 
              placeholder="0 Ariary" 
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date d'échéance</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateEcheance ? format(dateEcheance, "PPP", { locale: fr }) : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateEcheance}
                  onSelect={setDateEcheance}
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <Input 
            placeholder="Notes additionnelles" 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={() => {
            setMembre("");
            setProjet("");
            setMontant("");
            setDateEcheance(undefined);
            setNotes("");
          }}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Card>
  );
};