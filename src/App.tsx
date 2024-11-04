import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";

// Lazy load pages
const LoginPage = lazy(() => import("./pages/auth/login"));
const Index = lazy(() => import("./pages/Index"));
const TransactionsPage = lazy(() => import("./pages/transactions"));
const MembresPage = lazy(() => import("./pages/membres"));
const BudgetsPage = lazy(() => import("./pages/budgets"));
const TresoreriePage = lazy(() => import("./pages/tresorerie"));
const RapportsPage = lazy(() => import("./pages/rapports"));
const ProjetsPage = lazy(() => import("./pages/projets"));
const UtilisateursPage = lazy(() => import("./pages/utilisateurs"));
const SecuritePage = lazy(() => import("./pages/securite"));
const ParametresPage = lazy(() => import("./pages/parametres"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      suspense: true,
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <Suspense fallback={<LoadingSpinner />}>
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
              </Suspense>
              <Toaster />
              <Sonner />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;