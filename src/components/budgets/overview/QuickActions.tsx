import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface QuickActionsProps {
  onAddDepartment: (name: string, budget: string) => Promise<void>;
}

export const QuickActions = ({ onAddDepartment }: QuickActionsProps) => {
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptBudget, setNewDeptBudget] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddDepartment = async () => {
    await onAddDepartment(newDeptName, newDeptBudget);
    setNewDeptName("");
    setNewDeptBudget("");
    setIsDialogOpen(false);
  };

  return (
    <div className="flex justify-end">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouveau Département
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouveau département</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom du département</label>
              <Input
                placeholder="Ex: Département Communication"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Budget annuel (Ar)</label>
              <Input
                type="number"
                placeholder="Ex: 5000000"
                value={newDeptBudget}
                onChange={(e) => setNewDeptBudget(e.target.value)}
              />
            </div>
            <Button onClick={handleAddDepartment} className="w-full">
              Créer le département
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};