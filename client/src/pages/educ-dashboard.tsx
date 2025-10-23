import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function AdminDashboard() {
  const { data: statsData, isLoading, isError } = useQuery<{
    success: boolean;
    stats: {
      totalLeads: number;
      totalUsers: number;
      activeUsers: number;
      activeSubscriptions: number;
      conversionRate: string;
      mrr: number;
    };
  }>({
    queryKey: ["/api/admin/stats"],
  });

  const stats = statsData?.stats;
  
  const formattedMrr = stats?.mrr != null 
    ? `R$ ${stats.mrr.toFixed(2).replace('.', ',')}` 
    : "R$ 0,00";

  const statCards = [
    {
      title: "Total de Leads",
      value: stats?.totalLeads?.toString() || "0",
      description: "Total de leads cadastrados",
      icon: UserCheck,
    },
    {
      title: "Usuários Ativos",
      value: stats?.activeUsers?.toString() || "0",
      description: "Usuários com assinatura ativa",
      icon: Users,
    },
    {
      title: "Receita Mensal (MRR)",
      value: formattedMrr,
      description: "Receita recorrente mensal",
      icon: DollarSign,
    },
    {
      title: "Taxa de Conversão",
      value: stats?.conversionRate || "0%",
      description: "Leads convertidos em usuários",
      icon: TrendingUp,
    },
  ];

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema Passarei
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title} data-testid={`card-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>
                Últimas ações no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground text-center py-8">
                Nenhuma atividade recente
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leads Recentes</CardTitle>
              <CardDescription>
                Últimos leads cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground text-center py-8">
                Nenhum lead cadastrado
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
