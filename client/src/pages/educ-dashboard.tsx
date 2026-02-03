import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, UserCheck, DollarSign, TrendingUp, Loader2, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface DashboardStats {
  leads: { total: number; week: number };
  users: { total: number; active: number; week: number; free: number; calouro: number; veterano: number };
  mrr: number;
  conversion: string;
  funnel: { monthLeads: number; monthFree: number; monthPaid: number };
  alerts: { stalledLeads: number; inactiveUsers: number };
}

export default function AdminDashboard() {
  const { data, isLoading, isError } = useQuery<{ success: boolean; stats: DashboardStats }>({
    queryKey: ["/api/admin/dashboard-stats"],
  });

  const stats = data?.stats;

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const currentMonth = new Date().toLocaleDateString('pt-BR', { month: 'long' });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-destructive">Erro ao carregar estatísticas</h2>
            <p className="text-muted-foreground mt-2">Tente recarregar a página</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const funnelLeadToFree = stats?.funnel.monthLeads
    ? Math.round((stats.funnel.monthFree / stats.funnel.monthLeads) * 100)
    : 0;
  const funnelFreeToPaid = stats?.funnel.monthFree
    ? Math.round((stats.funnel.monthPaid / stats.funnel.monthFree) * 100)
    : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Painel Passarei</h1>
            <p className="text-muted-foreground capitalize">{currentMonth}</p>
          </div>
        </div>

        {/* Main KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.leads.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stats?.leads.week || 0}</span> esta semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.users.active || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stats?.users.week || 0}</span> esta semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">MRR</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats?.mrr || 0)}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.users.calouro || 0} Calouro · {stats?.users.veterano || 0} Veterano
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.conversion || "0%"}</div>
              <p className="text-xs text-muted-foreground">Lead → Pago (mês)</p>
            </CardContent>
          </Card>
        </div>

        {/* Funnel + Alerts Row */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Funil do Mês */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Funil do Mês</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Leads: {stats?.funnel.monthLeads || 0}</span>
                <span>→</span>
                <span>Free: {stats?.funnel.monthFree || 0} ({funnelLeadToFree}%)</span>
                <span>→</span>
                <span>Pagos: {stats?.funnel.monthPaid || 0} ({funnelFreeToPaid}%)</span>
              </div>
              <Progress value={funnelLeadToFree} className="h-2" />
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
                <div>
                  <div className="font-semibold text-foreground">{stats?.users.free || 0}</div>
                  <div>FREE</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">{stats?.users.calouro || 0}</div>
                  <div>CALOURO</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">{stats?.users.veterano || 0}</div>
                  <div>VETERANO</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alertas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alertas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(stats?.alerts.stalledLeads || 0) > 0 ? (
                <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{stats?.alerts.stalledLeads} leads parados</p>
                    <p className="text-xs text-muted-foreground">Sem interação há 7+ dias</p>
                  </div>
                  <Link href="/educ/leads?status=NOVO">
                    <Button variant="outline" size="sm">
                      Ver <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-sm">Todos os leads estão sendo trabalhados</p>
                </div>
              )}

              {(stats?.alerts.inactiveUsers || 0) > 0 ? (
                <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{stats?.alerts.inactiveUsers} alunos inativos</p>
                    <p className="text-xs text-muted-foreground">Sem atividade há 7+ dias</p>
                  </div>
                  <Link href="/educ/users?status=inactive">
                    <Button variant="outline" size="sm">
                      Ver <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-sm">Todos os alunos pagos estão ativos</p>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <p className="text-sm">Sistema operacional</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link href="/educ/leads">
                <Button variant="outline">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Ver Leads
                </Button>
              </Link>
              <Link href="/educ/users">
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Ver Alunos
                </Button>
              </Link>
              <Link href="/educ/revenue">
                <Button variant="outline">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Ver Financeiro
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Summary Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            Total Usuários: {stats?.users.total || 0}
          </Badge>
          <Badge variant="secondary">
            Free: {stats?.users.free || 0}
          </Badge>
          <Badge variant="secondary">
            Calouro: {stats?.users.calouro || 0}
          </Badge>
          <Badge variant="secondary">
            Veterano: {stats?.users.veterano || 0}
          </Badge>
        </div>
      </div>
    </AdminLayout>
  );
}
