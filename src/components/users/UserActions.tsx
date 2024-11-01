import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Lock, History } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserActivityHistory } from "./UserActivityHistory";
import type { User } from "./types";

interface UserActionsProps {
  user: User;
  onDelete: (id: string) => void;
  onResetPassword: (email: string) => void;
}

export const UserActions = ({ user, onDelete, onResetPassword }: UserActionsProps) => {
  return (
    <div className="space-x-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <History className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Historique d'activité</DialogTitle>
          </DialogHeader>
          <UserActivityHistory userId={user.id} />
        </DialogContent>
      </Dialog>
      <Button variant="outline" size="icon">
        <Edit2 className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onDelete(user.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onResetPassword(user.email || '')}
      >
        <Lock className="h-4 w-4" />
      </Button>
    </div>
  );
};