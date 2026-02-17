import { useState } from "react";
import { useStudentAuth } from "@/contexts/StudentAuthContext";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Loader2, ChevronRight, ChevronLeft, Check } from "lucide-react";

// Concursos disponíveis
const EXAM_TYPES = [
  { value: "PF", label: "Polícia Federal" },
  { value: "PRF", label: "Polícia Rodoviária Federal" },
  { value: "PM", label: "Polícia Militar" },
  { value: "PC", label: "Polícia Civil" },
  { value: "CBM", label: "Corpo de Bombeiros Militar" },
  { value: "PP_FEDERAL", label: "Polícia Penal Federal" },
  { value: "PP_ESTADUAL", label: "Polícia Penal Estadual" },
  { value: "PL_FEDERAL", label: "Polícia Legislativa Federal" },
  { value: "PF_FERROVIARIA", label: "Polícia Ferroviária Federal" },
  { value: "PJ_CNJ", label: "Polícia Judicial CNJ" },
  { value: "ABIN", label: "ABIN" },
  { value: "EXERCITO", label: "Exército" },
  { value: "MARINHA", label: "Marinha" },
  { value: "FAB", label: "Força Aérea" },
  { value: "GM", label: "Guarda Municipal" },
  { value: "ANAC", label: "ANAC" },
  { value: "CPNU", label: "Concurso Nacional Unificado" },
  { value: "OUTRO", label: "Outro" },
];

// Cargos por concurso (principais)
const CARGOS: Record<string, string[]> = {
  PF: ["Agente", "Escrivão", "Delegado", "Papiloscopista", "Perito Criminal"],
  PRF: ["Policial Rodoviário Federal"],
  PM: ["Soldado", "Cabo", "Sargento", "Oficial"],
  PC: ["Investigador", "Escrivão", "Delegado", "Papiloscopista", "Perito Criminal"],
  CBM: ["Soldado", "Cabo", "Sargento", "Oficial"],
  PP_FEDERAL: ["Policial Penal Federal"],
  PP_ESTADUAL: ["Agente de Execução Penal"],
  GM: ["Guarda Municipal"],
};

const STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

// Matérias para seleção de facilidades/dificuldades
const SUBJECTS = [
  "Direito Constitucional",
  "Direito Administrativo",
  "Direito Penal",
  "Direito Processual Penal",
  "Legislação Especial",
  "Português",
  "Raciocínio Lógico",
  "Informática",
  "Direitos Humanos",
  "Criminologia",
  "Medicina Legal",
  "Contabilidade",
  "Estatística",
  "Física",
  "Química",
];

export default function SalaOnboarding() {
  const { student, token, updateProfile, isAuthenticated } = useStudentAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [examType, setExamType] = useState(student?.examType || "");
  const [cargo, setCargo] = useState(student?.cargo || "");
  const [state, setState] = useState(student?.state || "");
  const [dificuldades, setDificuldades] = useState<string[]>([]);
  const [facilidades, setFacilidades] = useState<string[]>([]);

  if (!isAuthenticated) {
    setLocation("/sala");
    return null;
  }

  if (student?.onboardingDone) {
    setLocation("/sala/aula");
    return null;
  }

  const toggleSubject = (subject: string, list: "dificuldades" | "facilidades") => {
    const setter = list === "dificuldades" ? setDificuldades : setFacilidades;
    const other = list === "dificuldades" ? facilidades : dificuldades;
    const otherSetter = list === "dificuldades" ? setFacilidades : setDificuldades;
    const current = list === "dificuldades" ? dificuldades : facilidades;

    if (current.includes(subject)) {
      setter(current.filter((s) => s !== subject));
    } else {
      // Remove from opposite list if present
      if (other.includes(subject)) {
        otherSetter(other.filter((s) => s !== subject));
      }
      setter([...current, subject]);
    }
  };

  const handleSubmit = async () => {
    if (!examType) {
      toast({ variant: "destructive", title: "Selecione o concurso" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/sala/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          examType,
          cargo: cargo || undefined,
          state: state || undefined,
          dificuldades,
          facilidades,
        }),
      });
      const data = await res.json();

      if (data.success) {
        updateProfile(data.profile);
        toast({ title: "Perfil configurado!" });
        setLocation("/sala/aula");
      } else {
        toast({ variant: "destructive", title: "Erro", description: data.error });
      }
    } catch {
      toast({ variant: "destructive", title: "Erro ao salvar perfil" });
    } finally {
      setIsLoading(false);
    }
  };

  const totalSteps = 3;
  const availableCargos = CARGOS[examType] || [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-background to-blue-50/50 px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Bem-vindo, {student?.name?.split(" ")[0]}!
          </CardTitle>
          <CardDescription>
            Vamos personalizar sua experiência de estudo
          </CardDescription>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i + 1 === step
                    ? "w-8 bg-primary"
                    : i + 1 < step
                    ? "w-8 bg-primary/50"
                    : "w-8 bg-muted"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Concurso + Cargo + Estado */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Para qual concurso você estuda?</Label>
                <Select value={examType} onValueChange={(v) => { setExamType(v); setCargo(""); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o concurso" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXAM_TYPES.map((e) => (
                      <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {availableCargos.length > 0 && (
                <div className="space-y-2">
                  <Label>Cargo desejado</Label>
                  <Select value={cargo} onValueChange={setCargo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCargos.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Estado (UF)</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Dificuldades */}
          {step === 2 && (
            <div className="space-y-3">
              <Label>Quais matérias você tem mais dificuldade?</Label>
              <p className="text-sm text-muted-foreground">
                Selecione as matérias que precisa focar mais. Vamos priorizar elas no seu estudo.
              </p>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((s) => (
                  <Badge
                    key={s}
                    variant={dificuldades.includes(s) ? "destructive" : "outline"}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => toggleSubject(s, "dificuldades")}
                  >
                    {s}
                    {dificuldades.includes(s) && <Check className="ml-1 h-3 w-3" />}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Facilidades */}
          {step === 3 && (
            <div className="space-y-3">
              <Label>E quais você já domina?</Label>
              <p className="text-sm text-muted-foreground">
                Matérias que você tem facilidade. Usaremos para revisão leve e manutenção.
              </p>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((s) => (
                  <Badge
                    key={s}
                    variant={facilidades.includes(s) ? "default" : "outline"}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => toggleSubject(s, "facilidades")}
                  >
                    {s}
                    {facilidades.includes(s) && <Check className="ml-1 h-3 w-3" />}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ChevronLeft className="mr-1 h-4 w-4" /> Voltar
              </Button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !examType}
              >
                Próximo <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
                ) : (
                  <>Começar a estudar <ChevronRight className="ml-1 h-4 w-4" /></>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
