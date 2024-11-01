import { TwoFactorAuth } from "./TwoFactorAuth";
import { BackupManager } from "./BackupManager";
import { SecurityAudit } from "./SecurityAudit";
import { AccessLogs } from "./AccessLogs";
import { DataEncryption } from "./DataEncryption";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export const SecurityDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sécurité et Sauvegardes</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Retour à l'accueil
        </Button>
      </div>
      <div className="grid gap-6">
        <TwoFactorAuth />
        <BackupManager />
        <SecurityAudit />
        <AccessLogs />
        <DataEncryption />
      </div>
    </div>
  );
};