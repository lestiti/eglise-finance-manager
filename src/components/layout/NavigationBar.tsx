import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, PlusCircle, LineChart, Users, Settings } from "lucide-react";

export const NavigationBar = () => {
  const navigate = useNavigate();

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
            <LineChart className="h-5 w-5" />
            Rapports
          </Button>
          <Button variant="outline" onClick={() => navigate("/membres")} className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Membres
          </Button>
          <Button variant="outline" onClick={() => navigate("/parametres")} className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Paramètres
          </Button>
        </div>
      </div>
    </div>
  );
};