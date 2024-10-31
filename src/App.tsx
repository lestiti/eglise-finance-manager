import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { RequireAuth } from "@/components/auth/RequireAuth";
import LoginPage from "./pages/auth/login";
import Index from "./pages/Index";
import TransactionsPage from "./pages/transactions";
import MembresPage from "./pages/membres";
import BudgetsPage from "./pages/budgets";
import TresoreriePage from "./pages/tresorerie";
import RapportsPage from "./pages/rapports";
import ProjetsPage from "./pages/projets";
import UtilisateursPage from "./pages/utilisateurs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
            <Route path="/utilisateurs" element={<RequireAuth><UtilisateursPage /></RequireAuth>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;