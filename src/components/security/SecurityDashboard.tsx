import { TwoFactorAuth } from "./TwoFactorAuth";
import { BackupManager } from "./BackupManager";
import { SecurityAudit } from "./SecurityAudit";
import { AccessLogs } from "./AccessLogs";
import { DataEncryption } from "./DataEncryption";

export const SecurityDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sécurité et Sauvegardes</h1>
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