import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const leadFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, "WhatsApp inválido. Use o formato (99) 99999-9999"),
  examType: z.enum(["PM", "PC", "PRF", "PF", "OUTRO"], {
    required_error: "Selecione o tipo de concurso"
  }),
  state: z.string().length(2, "Selecione um estado"),
  acceptedWhatsApp: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar receber conteúdo via WhatsApp",
  }),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

const brazilianStates = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

export function LeadForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      examType: undefined,
      state: "",
      acceptedWhatsApp: false,
    },
  });

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    form.setValue("phone", formatted);
  };

  const onSubmit = async (data: LeadFormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao processar cadastro");
      }

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Cadastro realizado!",
          description: "Você receberá uma mensagem no WhatsApp em breve.",
        });
        setLocation("/obrigado");
      } else {
        throw new Error(result.error || "Erro ao processar cadastro");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao processar cadastro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Comece Agora Gratuitamente
        </h3>
        <p className="text-muted-foreground">
          Preencha os dados abaixo e receba seu primeiro conteúdo hoje
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="João Silva" 
                    {...field} 
                    data-testid="input-name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="joao@email.com" 
                    {...field} 
                    data-testid="input-email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(11) 99999-9999"
                    {...field}
                    onChange={handlePhoneChange}
                    maxLength={15}
                    data-testid="input-phone"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="examType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Concurso *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-exam-type">
                      <SelectValue placeholder="Selecione o concurso" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PM">PM - Polícia Militar</SelectItem>
                    <SelectItem value="PC">PC - Polícia Civil</SelectItem>
                    <SelectItem value="PRF">PRF - Polícia Rodoviária Federal</SelectItem>
                    <SelectItem value="PF">PF - Polícia Federal</SelectItem>
                    <SelectItem value="OUTRO">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-state">
                      <SelectValue placeholder="Selecione seu estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brazilianStates.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acceptedWhatsApp"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    data-testid="checkbox-accept-whatsapp"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    Aceito receber conteúdo via WhatsApp *
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 text-lg font-semibold"
            disabled={isSubmitting}
            data-testid="button-submit-form"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <span className="text-2xl mr-2">💚</span>
                Eu Vou Passar!
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Ao preencher o formulário, você concorda com nossos{" "}
            <a href="#" className="text-primary hover:underline">
              Termos de Uso
            </a>{" "}
            e{" "}
            <a href="#" className="text-primary hover:underline">
              Política de Privacidade
            </a>
            .
          </p>
        </form>
      </Form>
    </div>
  );
}
