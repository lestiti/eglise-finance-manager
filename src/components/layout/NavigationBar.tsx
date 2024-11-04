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
  LogOut,
  Shield,
  Menu
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export const NavigationBar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const isAdmin = user?.user_metadata?.role === 'admin';

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event && event.key) {
      const key = event.key.toLowerCase();
      // Ajouter ici la logique de raccourcis clavier si nécessaire
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const NavButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
    <Button variant="ghost" onClick={onClick} className="flex items-center gap-2 w-full justify-start">
      <Icon className="h-5 w-5" />
      {label}
    </Button>
  );

  const NavigationContent = () => (
    <>
      <NavButton icon={Home} label="Accueil" onClick={() => navigate("/")} />
      <NavButton icon={PlusCircle} label="Transactions" onClick={() => navigate("/transactions")} />
      <NavButton icon={FileText} label="Rapports" onClick={() => navigate("/rapports")} />
      <NavButton icon={Users} label="Membres" onClick={() => navigate("/membres")} />
      <NavButton icon={Wallet} label="Budgets" onClick={() => navigate("/budgets")} />
      <NavButton icon={Banknote} label="Trésorerie" onClick={() => navigate("/tresorerie")} />
      <NavButton icon={FolderKanban} label="Projets" onClick={() => navigate("/projets")} />
      {isAdmin && (
        <>
          <NavButton icon={UserCog} label="Utilisateurs" onClick={() => navigate("/utilisateurs")} />
          <NavButton icon={Shield} label="Sécurité" onClick={() => navigate("/securite")} />
        </>
      )}
      <NavButton icon={Settings} label="Paramètres" onClick={() => navigate("/parametres")} />
      <NavButton icon={LogOut} label="Déconnexion" onClick={signOut} />
    </>
  );

  return (
    <div className="bg-white border-b p-4 sticky top-0 z-50">
      <div className="container mx-auto">
        {/* Version mobile */}
        <div className="md:hidden flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Accueil
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-2 mt-6">
                <NavigationContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Version desktop */}
        <div className="hidden md:flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Accueil
          </Button>
          
          <div className="flex items-center gap-2">
            <NavButton icon={PlusCircle} label="Transactions" onClick={() => navigate("/transactions")} />
            <NavButton icon={FileText} label="Rapports" onClick={() => navigate("/rapports")} />
            <NavButton icon={Users} label="Membres" onClick={() => navigate("/membres")} />
            <NavButton icon={Wallet} label="Budgets" onClick={() => navigate("/budgets")} />
            <NavButton icon={Banknote} label="Trésorerie" onClick={() => navigate("/tresorerie")} />
            <NavButton icon={FolderKanban} label="Projets" onClick={() => navigate("/projets")} />
            {isAdmin && (
              <>
                <NavButton icon={UserCog} label="Utilisateurs" onClick={() => navigate("/utilisateurs")} />
                <NavButton icon={Shield} label="Sécurité" onClick={() => navigate("/securite")} />
              </>
            )}
            <NavButton icon={Settings} label="Paramètres" onClick={() => navigate("/parametres")} />
            <Button variant="destructive" onClick={signOut} className="flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};