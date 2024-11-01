import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const TwoFactorAuth = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const { toast } = useToast();

  const setupTwoFactor = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour activer la 2FA",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp'
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'activer la 2FA",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "2FA Activée",
      description: "L'authentification à deux facteurs a été activée avec succès",
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Authentification à Deux Facteurs</h2>
      <div className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Code de vérification"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
        </div>
        <Button onClick={setupTwoFactor} className="w-full">
          Activer la 2FA
        </Button>
      </div>
    </Card>
  );
};