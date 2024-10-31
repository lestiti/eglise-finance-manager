import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TransactionsPage from "./pages/transactions";
import MembresPage from "./pages/membres";
import BudgetsPage from "./pages/budgets";
import TresoreriePage from "./pages/tresorerie";
import RapportsPage from "./pages/rapports";
import ProjetsPage from "./pages/projets";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/membres" element={<MembresPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/tresorerie" element={<TresoreriePage />} />
          <Route path="/rapports" element={<RapportsPage />} />
          <Route path="/projets" element={<ProjetsPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;