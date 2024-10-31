import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Connexion</h2>
          <p className="mt-2 text-gray-600">Accès réservé au personnel autorisé</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            className: {
              container: 'space-y-4',
              button: 'w-full',
              input: 'w-full',
            },
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email professionnel',
                password_label: 'Mot de passe',
                button_label: 'Se connecter',
                loading_button_label: 'Connexion en cours...',
                email_input_placeholder: 'Votre email professionnel',
                password_input_placeholder: 'Votre mot de passe',
              }
            }
          }}
          providers={[]}
          view="sign_in"
          showLinks={false}
        />
        <p className="text-sm text-center text-gray-500">
          Contactez l'administrateur système pour obtenir vos identifiants de connexion
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;