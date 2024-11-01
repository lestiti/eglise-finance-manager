import { useToast } from "@/components/ui/use-toast";
import { PostgrestError } from "@supabase/supabase-js";

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = (error: unknown) => {
    console.error('Error:', error);

    if (error instanceof Error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } else if ((error as PostgrestError).code) {
      const pgError = error as PostgrestError;
      toast({
        title: "Erreur de base de données",
        description: pgError.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    }
  };

  return { handleError };
};