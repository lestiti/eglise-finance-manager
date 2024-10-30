import { NavigationBar } from "@/components/layout/NavigationBar";
import { MemberForm } from "@/components/members/MemberForm";
import { MemberList } from "@/components/members/MemberList";
import { DonationHistory } from "@/components/members/DonationHistory";
import { DonationPledges } from "@/components/members/DonationPledges";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MembresPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Gestion des Fidèles et Donateurs</h1>
        
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">Liste des Membres</TabsTrigger>
            <TabsTrigger value="add">Ajouter un Membre</TabsTrigger>
            <TabsTrigger value="history">Historique des Dons</TabsTrigger>
            <TabsTrigger value="pledges">Promesses de Dons</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <MemberList />
          </TabsContent>

          <TabsContent value="add">
            <MemberForm />
          </TabsContent>

          <TabsContent value="history">
            <DonationHistory />
          </TabsContent>

          <TabsContent value="pledges">
            <DonationPledges />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MembresPage;