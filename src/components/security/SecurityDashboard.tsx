import { TwoFactorAuth } from "./TwoFactorAuth";
import { BackupManager } from "./BackupManager";

export const SecurityDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sécurité et Sauvegardes</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <TwoFactorAuth />
        <BackupManager />
      </div>
    </div>
  );
};