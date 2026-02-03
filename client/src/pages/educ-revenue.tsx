import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DollarSign,
  Users,
  TrendingUp,
  RefreshCw,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  Undo2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  mp_payment_id: string;
  telegram_id: string | null;
  payer_email: string | null;
  package_id: string;
  amount: number;
  status: string;
  status_detail: string | null;
  payment_method_id: string | null;
  payment_type_id: string | null;
  mp_date_created: string | null;
  mp_date_approved: string | null;
  created_at: string;
  user_name: string | null;
  user_plan: string | null;
  refund_id: string | null;
  refund_status: string | null;
  refund_amount: number | null;
}

interface Refund {
  id: string;
  mp_payment_id: string;
  mp_refund_id: string | null;
  amount: number;
  reason: string;
  status: string;
  processed_by_name: string | null;
  payer_email: string | null;
  package_id: string | null;
  created_at: string;
}

interface FinancialMetrics {
  mrr: number;
  subscribers: {
    calouro: number;
    veterano: number;
    total: number;
  };
  monthRevenue: number;
  monthTransactions: number;
  monthRefunds: number;
  monthRefundCount: number;
}

export default function EducRevenue() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundNotes, setRefundNotes] = useState("");
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch metrics
  const { data: metricsData, isLoading: metricsLoading } = useQuery<{
    success: boolean;
    metrics: FinancialMetrics;
  }>({
    queryKey: ["/api/admin/financial/metrics"],
  });

  // Fetch transactions
  const { data: transactionsData, isLoading: transactionsLoading } = useQuery<{
    success: boolean;
    transactions: Transaction[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>({
    queryKey: ["/api/admin/financial/transactions"],
  });

  // Fetch refunds
  const { data: refundsData, isLoading: refundsLoading } = useQuery<{
    success: boolean;
    refunds: Refund[];
  }>({
    queryKey: ["/api/admin/financial/refunds"],
  });

  // Process refund mutation
  const refundMutation = useMutation({
    mutationFn: async (data: { mpPaymentId: string; reason: string; notes: string }) => {
      const response = await fetch("/api/admin/financial/refunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao processar estorno");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/financial/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/financial/refunds"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/financial/metrics"] });
      toast({
        title: "Estorno processado",
        description: "O estorno foi enviado para processamento.",
      });
      setIsRefundDialogOpen(false);
      setSelectedTransaction(null);
      setRefundReason("");
      setRefundNotes("");
    },
    onError: (error: Error) => {
      toast({
        title: "Erro no estorno",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const metrics = metricsData?.metrics;
  const transactions = transactionsData?.transactions || [];
  const refunds = refundsData?.refunds || [];

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return (
          <Badge className="bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" /> Aprovado
          </Badge>
        );
      case "PENDING":
      case "IN_PROCESS":
        return (
          <Badge className="bg-yellow-600">
            <Clock className="h-3 w-3 mr-1" /> Pendente
          </Badge>
        );
      case "REJECTED":
      case "CANCELLED":
        return (
          <Badge className="bg-red-600">
            <XCircle className="h-3 w-3 mr-1" /> Rejeitado
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPackageName = (packageId: string) => {
    if (packageId?.toLowerCase().includes("veterano")) return "Veterano";
    if (packageId?.toLowerCase().includes("calouro")) return "Calouro";
    return packageId || "-";
  };

  const handleRefundClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsRefundDialogOpen(true);
  };

  const handleRefundSubmit = () => {
    if (!selectedTransaction || !refundReason.trim()) {
      toast({
        title: "Erro",
        description: "Informe o motivo do estorno",
        variant: "destructive",
      });
      return;
    }

    refundMutation.mutate({
      mpPaymentId: selectedTransaction.mp_payment_id,
      reason: refundReason,
      notes: refundNotes,
    });
  };

  const currentMonth = new Date().toLocaleDateString("pt-BR", { month: "long" });

  if (metricsLoading || transactionsLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" data-testid="heading-revenue">
              Financeiro
            </h1>
            <p className="text-muted-foreground capitalize">{currentMonth}</p>
          </div>
        </div>

        {/* Main KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">MRR</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics?.mrr || 0)}</div>
              <p className="text-xs text-muted-foreground">
                Receita mensal recorrente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assinantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.subscribers.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                {metrics?.subscribers.calouro || 0} Calouro · {metrics?.subscribers.veterano || 0} Veterano
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(metrics?.monthRevenue || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {metrics?.monthTransactions || 0} transações
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estornos</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(metrics?.monthRefunds || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {metrics?.monthRefundCount || 0} este mês
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Transações Recentes</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {transactions.length} transações encontradas
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-sm">
                      {formatDate(transaction.created_at)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {transaction.user_name || transaction.telegram_id || "-"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.payer_email || "-"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getPackageName(transaction.package_id)}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(transaction.status)}
                        {transaction.refund_id && (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            <Undo2 className="h-3 w-3 mr-1" /> Estornado
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {transaction.status === "APPROVED" && !transaction.refund_id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRefundClick(transaction)}
                        >
                          <Undo2 className="h-4 w-4 mr-1" />
                          Estornar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">Nenhuma transação encontrada</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Refunds History */}
        {refunds.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-orange-100 p-2">
                  <Undo2 className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle>Histórico de Estornos</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {refunds.length} estornos processados
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Processado Por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refunds.map((refund) => (
                    <TableRow key={refund.id}>
                      <TableCell className="text-sm">
                        {formatDate(refund.created_at)}
                      </TableCell>
                      <TableCell>{refund.payer_email || "-"}</TableCell>
                      <TableCell className="font-medium text-orange-600">
                        -{formatCurrency(refund.amount)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {refund.reason}
                      </TableCell>
                      <TableCell>{getStatusBadge(refund.status)}</TableCell>
                      <TableCell>{refund.processed_by_name || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Refund Dialog */}
        <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Processar Estorno</DialogTitle>
              <DialogDescription>
                Você está prestes a estornar uma transação. Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>

            {selectedTransaction && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p>
                    <strong>Valor:</strong> {formatCurrency(selectedTransaction.amount)}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedTransaction.payer_email || "-"}
                  </p>
                  <p>
                    <strong>Plano:</strong> {getPackageName(selectedTransaction.package_id)}
                  </p>
                  <p>
                    <strong>ID MP:</strong> {selectedTransaction.mp_payment_id}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Motivo do Estorno *</label>
                  <Input
                    placeholder="Ex: Solicitação do cliente"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Observações (opcional)</label>
                  <Textarea
                    placeholder="Observações internas..."
                    value={refundNotes}
                    onChange={(e) => setRefundNotes(e.target.value)}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRefundDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleRefundSubmit}
                disabled={refundMutation.isPending || !refundReason.trim()}
              >
                {refundMutation.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Confirmar Estorno
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
