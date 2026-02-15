import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ticket, Loader2, Plus, ToggleLeft, ToggleRight } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PromoCode {
  id: string;
  code: string;
  description: string;
  type: string;
  granted_plan: string;
  granted_days: number;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  created_at: string;
  redemption_count: string;
}

interface BetaTester {
  id: string;
  name: string;
  email: string;
  telegramId: string;
  plan: string;
  planStatus: string;
  planStartDate: string | null;
  planEndDate: string | null;
  last_active_at: string | null;
  totalQuestionsAnswered: number;
  promo_code: string;
  redeemed_at: string;
}

const formatDate = (d: string | null) => {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("pt-BR");
};

const formatDays = (days: number) => {
  if (days >= 365) return `${Math.round(days / 365)} anos`;
  return `${days} dias`;
};

export default function EducBeta() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPlan, setNewPlan] = useState("VETERANO");
  const [newDays, setNewDays] = useState("30");
  const [newMaxUses, setNewMaxUses] = useState("1");

  const { data: codesData, isLoading: codesLoading } = useQuery<{ success: boolean; codes: PromoCode[] }>({
    queryKey: ["/api/admin/promo-codes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/promo-codes", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: testersData, isLoading: testersLoading } = useQuery<{ success: boolean; testers: BetaTester[] }>({
    queryKey: ["/api/admin/beta-testers"],
    queryFn: async () => {
      const res = await fetch("/api/admin/beta-testers", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => apiRequest("POST", "/api/admin/promo-codes", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promo-codes"] });
      toast({ title: "Codigo criado", description: "O codigo promocional foi criado com sucesso." });
      setShowForm(false);
      setNewCode("");
      setNewDescription("");
      setNewDays("30");
      setNewMaxUses("1");
    },
    onError: (err: any) => {
      toast({ title: "Erro", description: err?.message || "Erro ao criar codigo", variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiRequest("PATCH", `/api/admin/promo-codes/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promo-codes"] });
      toast({ title: "Atualizado" });
    },
  });

  const handleCreate = () => {
    if (!newCode.trim()) {
      toast({ title: "Erro", description: "Informe o codigo", variant: "destructive" });
      return;
    }
    createMutation.mutate({
      code: newCode.trim(),
      description: newDescription.trim(),
      type: "beta",
      grantedPlan: newPlan,
      grantedDays: Number(newDays),
      maxUses: Number(newMaxUses),
    });
  };

  if (codesLoading || testersLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const codes = codesData?.codes || [];
  const testers = testersData?.testers || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Beta Testers</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie codigos promocionais e acompanhe beta testers
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Codigo
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Criar Codigo Promocional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Input
                  placeholder="CODIGO (ex: BETA011)"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                />
                <Input
                  placeholder="Descricao (opcional)"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
                <Select value={newPlan} onValueChange={setNewPlan}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VETERANO">Veterano</SelectItem>
                    <SelectItem value="CALOURO">Calouro</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Dias"
                  value={newDays}
                  onChange={(e) => setNewDays(e.target.value)}
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Max usos"
                    value={newMaxUses}
                    onChange={(e) => setNewMaxUses(e.target.value)}
                  />
                  <Button onClick={handleCreate} disabled={createMutation.isPending}>
                    {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <Ticket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Codigos Promocionais</CardTitle>
                <CardDescription>{codes.length} codigos cadastrados</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Codigo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Duracao</TableHead>
                  <TableHead>Usos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Acao</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className="font-mono font-bold">{code.code}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{code.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={code.granted_plan === "VETERANO" ? "bg-purple-600" : "bg-blue-600"}>
                        {code.granted_plan}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDays(code.granted_days)}</TableCell>
                    <TableCell>
                      <span className="font-medium">{code.current_uses}</span>
                      <span className="text-muted-foreground">/{code.max_uses}</span>
                    </TableCell>
                    <TableCell>
                      {code.is_active ? (
                        <Badge className="bg-green-600">Ativo</Badge>
                      ) : (
                        <Badge variant="secondary">Inativo</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleMutation.mutate({ id: code.id, isActive: !code.is_active })}
                        disabled={toggleMutation.isPending}
                      >
                        {code.is_active ? (
                          <ToggleRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {codes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Nenhum codigo cadastrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Beta Testers ({testers.length})</CardTitle>
            <CardDescription>Usuarios que resgataram codigos promocionais</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Telegram</TableHead>
                  <TableHead>Codigo</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Expira</TableHead>
                  <TableHead>Questoes</TableHead>
                  <TableHead>Ultimo Acesso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testers.map((tester) => {
                  const isExpired = tester.planEndDate && new Date(tester.planEndDate) < new Date();
                  return (
                    <TableRow key={`${tester.id}-${tester.promo_code}`}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{tester.name || "-"}</p>
                          <p className="text-xs text-muted-foreground">{tester.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm">@{tester.telegramId}</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">{tester.promo_code}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={tester.plan === "VETERANO" ? "bg-purple-600" : "bg-blue-600"}>
                          {tester.plan}
                        </Badge>
                        {tester.planStatus !== "active" && (
                          <Badge variant="secondary" className="ml-1">{tester.planStatus}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={isExpired ? "text-red-600" : ""}>
                          {formatDate(tester.planEndDate)}
                        </span>
                        {isExpired && <span className="text-xs text-red-600 block">Expirado</span>}
                      </TableCell>
                      <TableCell className="font-medium">{tester.totalQuestionsAnswered || 0}</TableCell>
                      <TableCell>{formatDate(tester.last_active_at)}</TableCell>
                    </TableRow>
                  );
                })}
                {testers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Nenhum beta tester encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
