import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QrCode, Smartphone } from "lucide-react";

export const TwoFactorAuth = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
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

    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });

      if (error) throw error;

      if (data?.qr_code) {
        setQrCode(data.qr_code);
      }

      // Log l'activation de la 2FA
      await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          action: '2fa_setup',
          details: {
            timestamp: new Date().toISOString(),
          },
        });

      toast({
        title: "2FA Activée",
        description: "L'authentification à deux facteurs a été activée avec succès",
      });
      
      setIsEnabled(true);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'activer la 2FA",
        variant: "destructive",
      });
    }
  };

  const verifyCode = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.verify({
        factorId: 'totp',
        code: verificationCode
      });

      if (error) throw error;

      toast({
        title: "Code vérifié",
        description: "Le code a été vérifié avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Code invalide",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Smartphone className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Authentification à Deux Facteurs</h2>
      </div>

      <div className="space-y-4">
        {qrCode && (
          <div className="flex justify-center mb-4">
            <img src={qrCode} alt="QR Code pour 2FA" className="w-48 h-48" />
          </div>
        )}

        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Code de vérification"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <Button onClick={verifyCode} className="w-full">
            Vérifier le code
          </Button>
        </div>

        {!isEnabled && (
          <Button onClick={setupTwoFactor} className="w-full">
            Activer la 2FA
          </Button>
        )}

        <div className="mt-4 text-sm text-gray-500">
          <p>L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire à votre compte.</p>
          <ul className="list-disc list-inside mt-2">
            <li>Protection contre les accès non autorisés</li>
            <li>Vérification via une application d'authentification</li>
            <li>Codes de secours en cas de perte d'accès</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};