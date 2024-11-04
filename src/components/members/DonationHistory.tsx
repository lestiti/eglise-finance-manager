import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Donation {
  id: string;
  date_don: string;
  type: string;
  montant: number;
  source: string;
  member: {
    nom: string;
    prenom: string;
  };
}

export const DonationHistory = () => {
  const [typeFilter, setTypeFilter] = useState("tous");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select(`
          *,
          member:members(nom, prenom)
        `)
        .order('date_don', { ascending: false });

      if (error) throw error;
      return data as Donation[];
    }
  });

  const filteredDonations = donations.filter(donation => {
    const matchesType = typeFilter === "tous" || donation.type === typeFilter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      donation.member.nom.toLowerCase().includes(searchLower) ||
      donation.member.prenom.toLowerCase().includes(searchLower) ||
      donation.source.toLowerCase().includes(searchLower);
    
    return matchesType && matchesSearch;
  });

  const formatAmount = (amount: number) => 
    `${amount.toLocaleString()} Ar`;

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Type de don" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les types</SelectItem>
              <SelectItem value="dime">Dîme</SelectItem>
              <SelectItem value="offrande">Offrande</SelectItem>
              <SelectItem value="don">Don</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Membre</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDonations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Aucun don trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>
                    {format(new Date(donation.date_don), 'PPP', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    {donation.member.prenom} {donation.member.nom}
                  </TableCell>
                  <TableCell className="capitalize">{donation.type}</TableCell>
                  <TableCell>{donation.source}</TableCell>
                  <TableCell className="font-medium">
                    {formatAmount(donation.montant)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};