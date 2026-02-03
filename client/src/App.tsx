import { Switch, Route } from "wouter";
import Checkout from "./pages/Checkout";
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
import EducLogin from "@/pages/educ-login";
import EducDashboard from "@/pages/educ-dashboard";
import EducLeads from "@/pages/educ-leads";
import Success from "./pages/Success";
import EducUsers from "@/pages/educ-users";
import EducRevenue from "@/pages/educ-revenue";
import EducSettings from "@/pages/educ-settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/obrigado" component={Obrigado} />
      <Route path="/success" component={Success} />
      <Route path="/termos" component={Termos} />
      <Route path="/privacidade" component={Privacidade} />
      <Route path="/cookies" component={Cookies} />
      <Route path="/reembolso" component={Reembolso} />
      <Route path="/educ" component={EducLogin} />
      <Route path="/educ/login" component={EducLogin} />
      <Route path="/educ/dashboard" component={EducDashboard} />
      <Route path="/educ/leads" component={EducLeads} />
      <Route path="/educ/users" component={EducUsers} />
      <Route path="/educ/revenue" component={EducRevenue} />
      <Route path="/educ/settings" component={EducSettings} />
      <Route path="/checkout" component={Checkout} />
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
