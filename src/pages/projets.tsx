import { useState } from "react";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ProjetsPage = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestion des Projets</h1>
          <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Projet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un nouveau projet</DialogTitle>
              </DialogHeader>
              <ProjectForm onSuccess={() => setIsNewProjectDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="space-y-6">
          <ProjectList onSelectProject={setSelectedProjectId} />
          
          {selectedProjectId && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6">Détails du Projet</h2>
              <ProjectDetails projectId={selectedProjectId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjetsPage;