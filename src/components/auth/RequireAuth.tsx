import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Loader2 } from "lucide-react";

interface RequireAuthProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const RequireAuth = ({ children, requireAdmin = false }: RequireAuthProps) => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth/login");
      } else if (requireAdmin && !isAdmin) {
        navigate("/");
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page",
          variant: "destructive",
        });
      }
    }
  }, [user, loading, navigate, requireAdmin, isAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
};