import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useStudentAuth } from "@/contexts/StudentAuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GraduationCap, Loader2, Eye, EyeOff, Send, ArrowLeft } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
});

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Nome deve ter no mínimo 2 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    phone: z.string().optional(),
    password: z
      .string()
      .min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type ForgotStep = null | "request" | "verify";

function validateNewPassword(p: string): string | null {
  if (p.length < 6) return "Senha deve ter no mínimo 6 caracteres.";
  if (!/[a-zA-Z]/.test(p)) return "Senha deve conter pelo menos uma letra.";
  if (!/[0-9]/.test(p)) return "Senha deve conter pelo menos um número.";
  return null;
}

export default function SalaLogin() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const {
    login,
    register: registerStudent,
    refresh,
    isAuthenticated,
    student,
  } = useStudentAuth();
  const [, setLocation] = useLocation();

  // Esqueci minha senha — estados
  const [forgotStep, setForgotStep] = useState<ForgotStep>(null);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [forgotMethod, setForgotMethod] = useState<"telegram" | "email" | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);

  // Redirect if already authenticated
  if (isAuthenticated && student && forgotStep === null) {
    if (!student.onboardingDone) {
      setLocation("/sala/onboarding");
    } else {
      setLocation("/sala/aula");
    }
    return null;
  }

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        toast({ title: "Bem-vindo de volta!" });
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: result.error,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const result = await registerStudent({
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
      });
      if (result.success) {
        toast({ title: "Conta criada com sucesso!" });
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: result.error,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onForgotRequest = async () => {
    if (!forgotEmail) return;
    setForgotLoading(true);
    try {
      const res = await fetch("/api/sala/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setForgotMethod(data.method);
        setForgotStep("verify");
      } else {
        toast({ variant: "destructive", title: "Erro", description: data.error });
      }
    } catch {
      toast({ variant: "destructive", title: "Erro", description: "Falha de conexão." });
    } finally {
      setForgotLoading(false);
    }
  };

  const onForgotReset = async () => {
    const err = validateNewPassword(newPassword);
    if (err) { setNewPasswordError(err); return; }
    if (newPassword !== confirmNewPassword) {
      setNewPasswordError("As senhas não coincidem.");
      return;
    }
    setNewPasswordError(null);
    setForgotLoading(true);
    try {
      const res = await fetch("/api/sala/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, code: forgotCode, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("passarei_student_token", data.token);
        await refresh();
        toast({ title: "Senha redefinida com sucesso!" });
        setForgotStep(null);
        setForgotCode("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        toast({ variant: "destructive", title: "Erro", description: data.error });
      }
    } catch {
      toast({ variant: "destructive", title: "Erro", description: "Falha de conexão." });
    } finally {
      setForgotLoading(false);
    }
  };

  const TELEGRAM_BOT_URL = "https://t.me/PassareiBot";

  // ── Painel "Esqueci minha senha" ─────────────────────────────────────
  if (forgotStep !== null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-background to-blue-50/50 px-4 py-8">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <button
                type="button"
                onClick={() => { setForgotStep(null); setForgotCode(""); setNewPassword(""); setConfirmNewPassword(""); setNewPasswordError(null); }}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Voltar ao login
              </button>
              <CardTitle className="text-xl font-bold">Recuperar senha</CardTitle>
              <CardDescription>
                {forgotStep === "request"
                  ? "Informe seu e-mail para receber o código."
                  : forgotMethod === "telegram"
                    ? "📱 Enviamos um código para o seu Telegram vinculado."
                    : "📧 Enviamos um código para o seu e-mail."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {forgotStep === "request" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">E-mail cadastrado</label>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      disabled={forgotLoading}
                      onKeyDown={(e) => e.key === "Enter" && onForgotRequest()}
                    />
                  </div>
                  <Button className="w-full" onClick={onForgotRequest} disabled={forgotLoading || !forgotEmail}>
                    {forgotLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando...</> : "Enviar código"}
                  </Button>
                </>
              )}

              {forgotStep === "verify" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Código de 6 dígitos</label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="______"
                      value={forgotCode}
                      onChange={(e) => setForgotCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      disabled={forgotLoading}
                      className="text-center text-xl tracking-widest font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nova senha</label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setNewPasswordError(null); }}
                        disabled={forgotLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">Mínimo 6 caracteres com pelo menos uma letra e um número.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirmar nova senha</label>
                    <div className="relative">
                      <Input
                        type={showConfirmNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmNewPassword}
                        onChange={(e) => { setConfirmNewPassword(e.target.value); setNewPasswordError(null); }}
                        disabled={forgotLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {newPasswordError && (
                    <p className="text-sm text-destructive">{newPasswordError}</p>
                  )}

                  <Button
                    className="w-full"
                    onClick={onForgotReset}
                    disabled={forgotLoading || forgotCode.length < 6 || !newPassword || !confirmNewPassword}
                  >
                    {forgotLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Redefinindo...</> : "Confirmar nova senha"}
                  </Button>

                  <button
                    type="button"
                    onClick={() => { setForgotStep("request"); setForgotCode(""); }}
                    className="w-full text-sm text-muted-foreground underline underline-offset-2"
                  >
                    Não recebi o código — reenviar
                  </button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ── Tela principal (login / registro) ────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-background to-blue-50/50 px-4 py-8">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              Sala de Aula Passarei
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Entre com suas credenciais para estudar"
                : "Crie sua conta e ganhe 21 questões grátis"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Tab toggle */}
            <div className="flex rounded-lg bg-muted p-1 mb-6">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  mode === "login"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  mode === "register"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Criar conta
              </button>
            </div>

            {mode === "login" ? (
              <Form key="login-form" {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onLogin)}
                  className="space-y-4"
                >
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="seu@email.com"
                            type="email"
                            autoComplete="email"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="••••••••"
                              type={showPassword ? "text" : "password"}
                              autoComplete="current-password"
                              disabled={isLoading}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(loginForm.getValues("email"));
                        setForgotStep("request");
                      }}
                      className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                </form>
              </Form>
            ) : (
              <Form key="register-form" {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(onRegister)}
                  className="space-y-4"
                >
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Seu nome"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="seu@email.com"
                            type="email"
                            autoComplete="email"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone (opcional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="(11) 99999-9999"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="••••••••"
                              type={showPassword ? "text" : "password"}
                              autoComplete="new-password"
                              disabled={isLoading}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar senha</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            autoComplete="new-password"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Criando conta...
                      </>
                    ) : (
                      "Criar conta grátis"
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        {/* Telegram CTA */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-4 pb-4">
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-blue-700 hover:text-blue-900 font-medium transition-colors"
            >
              <Send className="h-4 w-4" />
              Se Preferir, Estude no Telegram!
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
