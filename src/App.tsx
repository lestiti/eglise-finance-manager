import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ThemeProvider } from "next-themes";
import LoginPage from "./pages/auth/login";
import Index from "./pages/Index";
import TransactionsPage from "./pages/transactions";
import MembresPage from "./pages/membres";
import BudgetsPage from "./pages/budgets";
import TresoreriePage from "./pages/tresorerie";
import RapportsPage from "./pages/rapports";
import ProjetsPage from "./pages/projets";
import UtilisateursPage from "./pages/utilisateurs";
import SecuritePage from "./pages/securite";
import ParametresPage from "./pages/parametres";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
                <Route path="/transactions" element={<RequireAuth><TransactionsPage /></RequireAuth>} />
                <Route path="/membres" element={<RequireAuth><MembresPage /></RequireAuth>} />
                <Route path="/budgets" element={<RequireAuth><BudgetsPage /></RequireAuth>} />
                <Route path="/tresorerie" element={<RequireAuth><TresoreriePage /></RequireAuth>} />
                <Route path="/rapports" element={<RequireAuth><RapportsPage /></RequireAuth>} />
                <Route path="/projets" element={<RequireAuth><ProjetsPage /></RequireAuth>} />
                <Route path="/utilisateurs" element={<RequireAuth requireAdmin={true}><UtilisateursPage /></RequireAuth>} />
                <Route path="/securite" element={<RequireAuth requireAdmin={true}><SecuritePage /></RequireAuth>} />
                <Route path="/parametres" element={<RequireAuth><ParametresPage /></RequireAuth>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster />
              <Sonner />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;