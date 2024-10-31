import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  PlusCircle, 
  Users, 
  Settings, 
  Wallet, 
  Banknote, 
  FileText,
  FolderKanban,
  UserCog,
  LogOut
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";

export const NavigationBar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.user_metadata?.role === 'admin';

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      navigate("/auth/login");
    }
  };

  // Safe keyboard event handler
  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event?.key?.toLowerCase();
    if (!key) return;
    
    // Add keyboard shortcuts if needed
  };

  // Add event listener with safe handler
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="bg-white border-b p-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Accueil
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/transactions")} className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Transactions
          </Button>
          <Button variant="outline" onClick={() => navigate("/rapports")} className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Rapports
          </Button>
          <Button variant="outline" onClick={() => navigate("/membres")} className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Membres
          </Button>
          <Button variant="outline" onClick={() => navigate("/budgets")} className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Budgets
          </Button>
          <Button variant="outline" onClick={() => navigate("/tresorerie")} className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Trésorerie
          </Button>
          <Button variant="outline" onClick={() => navigate("/projets")} className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5" />
            Projets
          </Button>
          <Button variant="outline" onClick={() => navigate("/utilisateurs")} className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Utilisateurs
          </Button>
          <Button variant="outline" onClick={() => navigate("/parametres")} className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Paramètres
          </Button>
          <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  );
};