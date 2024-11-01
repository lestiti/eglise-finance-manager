import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const DataEncryption = () => {
  const [encryptionKey, setEncryptionKey] = useState("");
  const { toast } = useToast();

  const generateNewKey = () => {
    const newKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    setEncryptionKey(newKey);
  };

  const updateEncryptionKey = async () => {
    try {
      const { error } = await supabase
        .from('backup_metadata')
        .update({ 
          encryption_key_hash: encryptionKey,
          updated_at: new Date().toISOString()
        })
        .eq('status', 'active');

      if (error) throw error;

      toast({
        title: "Clé mise à jour",
        description: "La clé de chiffrement a été mise à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la clé de chiffrement",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Lock className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Chiffrement des Données</h2>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={encryptionKey}
            onChange={(e) => setEncryptionKey(e.target.value)}
            placeholder="Clé de chiffrement"
            className="font-mono"
          />
          <Button onClick={generateNewKey}>
            Générer une nouvelle clé
          </Button>
        </div>

        <Button onClick={updateEncryptionKey} className="w-full">
          Mettre à jour la clé de chiffrement
        </Button>

        <div className="mt-4 text-sm text-gray-500">
          <p>La clé de chiffrement est utilisée pour protéger :</p>
          <ul className="list-disc list-inside mt-2">
            <li>Les sauvegardes de données</li>
            <li>Les documents sensibles</li>
            <li>Les informations personnelles</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};