import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@/components/Analytics";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import Landing from "@/pages/landing";
import Obrigado from "@/pages/obrigado";
import Termos from "@/pages/termos";
import Privacidade from "@/pages/privacidade";
import Cookies from "@/pages/cookies";
import Reembolso from "@/pages/reembolso";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminLeads from "@/pages/admin-leads";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/obrigado" component={Obrigado} />
      <Route path="/termos" component={Termos} />
      <Route path="/privacidade" component={Privacidade} />
      <Route path="/cookies" component={Cookies} />
      <Route path="/reembolso" component={Reembolso} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/leads" component={AdminLeads} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminAuthProvider>
          <Analytics />
          <Toaster />
          <Router />
        </AdminAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
