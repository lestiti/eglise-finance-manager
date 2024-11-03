import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";

export const TransactionForm = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [type, setType] = useState("");
  const [methodePaiement, setMethodePaiement] = useState("");
  const [montant, setMontant] = useState("");
  const [description, setDescription] = useState("");
  const [numeroFacture, setNumeroFacture] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer une transaction",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            type,
            montant: parseFloat(montant),
            methode_paiement: methodePaiement,
            description,
            numero_facture: numeroFacture,
            date_transaction: date.toISOString(),
            statut: 'en_attente'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La transaction a été enregistrée avec succès",
      });

      // Invalider le cache des transactions pour forcer un rechargement
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      // Reset form
      setType("");
      setMethodePaiement("");
      setMontant("");
      setDescription("");
      setNumeroFacture("");
      setDate(new Date());
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la transaction",
        variant: "destructive",
      });
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Nouvelle Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Type de Transaction</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="don">Don</SelectItem>
                <SelectItem value="dime">Dîme</SelectItem>
                <SelectItem value="depense">Dépense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Méthode de Paiement</label>
            <Select value={methodePaiement} onValueChange={setMethodePaiement}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner la méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="especes">Espèces</SelectItem>
                <SelectItem value="cheque">Chèque</SelectItem>
                <SelectItem value="virement">Virement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Montant (Ar)</label>
            <Input 
              type="number" 
              placeholder="0 Ariary" 
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">N° Facture (optionnel)</label>
          <Input 
            placeholder="Numéro de facture" 
            value={numeroFacture}
            onChange={(e) => setNumeroFacture(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Input 
            placeholder="Description de la transaction" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={() => {
            setType("");
            setMethodePaiement("");
            setMontant("");
            setDescription("");
            setNumeroFacture("");
            setDate(new Date());
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