import { NavigationBar } from "@/components/layout/NavigationBar";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProjetsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Gestion des Projets</h1>
        
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">Liste des Projets</TabsTrigger>
            <TabsTrigger value="new">Nouveau Projet</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <ProjectList />
          </TabsContent>

          <TabsContent value="new">
            <ProjectForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjetsPage;