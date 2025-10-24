import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileText, Plus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertContentSchema } from "@shared/schema";

type ContentFormData = z.infer<typeof insertContentSchema>;

// Labels para exibição no frontend
const subjectLabels: Record<string, string> = {
  DIREITO_PENAL: "Direito Penal",
  DIREITO_CONSTITUCIONAL: "Direito Constitucional",
  DIREITO_ADMINISTRATIVO: "Direito Administrativo",
  PORTUGUES: "Português",
  RACIOCINIO_LOGICO: "Raciocínio Lógico",
  INFORMATICA: "Informática",
};

const examTypeLabels: Record<string, string> = {
  PM: "PM - Polícia Militar",
  PC: "PC - Polícia Civil",
  PRF: "PRF - Polícia Rodoviária Federal",
  PF: "PF - Polícia Federal",
  OUTRO: "Todos os Concursos",
};

export default function EducContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContentFormData>({
    resolver: zodResolver(insertContentSchema),
    defaultValues: {
      title: "",
      subject: "DIREITO_PENAL",
      examType: "PM",
      body: "",
      status: "DRAFT",
    },
  });

  const onSubmit = async (data: ContentFormData) => {
    setIsLoading(true);
    try {
      const res = await apiRequest("POST", "/api/admin/content", data);
      const response = await res.json();

      if (response.success) {
        toast({
          title: "Conteúdo criado com sucesso!",
          description: `"${data.title}" foi adicionado à plataforma.`,
        });

        setIsDialogOpen(false);
        form.reset();
        
        // Invalidar cache de conteúdos quando implementarmos a listagem
        queryClient.invalidateQueries({ queryKey: ["/api/admin/content"] });
      } else {
        throw new Error(response.error || "Erro ao criar conteúdo");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conteúdo",
        description: error.message || "Ocorreu um erro inesperado.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bodyLength = form.watch("body")?.length || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold" data-testid="heading-content">Conteúdo</h1>
            <p className="text-muted-foreground">
              Gerencie o conteúdo educacional da plataforma
            </p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            data-testid="button-create-content"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Conteúdo
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Gestão de Conteúdo</CardTitle>
                <CardDescription>
                  Crie e edite questões, materiais e conteúdos
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Lista de conteúdos será implementada em breve.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Modal de Criação */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Conteúdo</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para criar um novo conteúdo educacional
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Título */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título *</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-title"
                          placeholder="Ex: Princípio da Legalidade"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Matéria */}
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Matéria *</FormLabel>
                        <Select
                          disabled={isLoading}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-subject">
                              <SelectValue placeholder="Selecione a matéria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(subjectLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Concurso */}
                  <FormField
                    control={form.control}
                    name="examType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Concurso *</FormLabel>
                        <Select
                          disabled={isLoading}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-exam-type">
                              <SelectValue placeholder="Selecione o concurso" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(examTypeLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Conteúdo */}
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo *</FormLabel>
                      <FormControl>
                        <Textarea
                          data-testid="textarea-body"
                          placeholder="Escreva o conteúdo educacional aqui (200-500 palavras)..."
                          className="min-h-[300px] resize-none"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {bodyLength} caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                          disabled={isLoading}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="DRAFT" id="draft" data-testid="radio-draft" />
                            <Label htmlFor="draft" className="font-normal cursor-pointer">
                              Rascunho (não visível para usuários)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="PUBLISHED" id="published" data-testid="radio-published" />
                            <Label htmlFor="published" className="font-normal cursor-pointer">
                              Publicado (visível para usuários)
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      form.reset();
                    }}
                    disabled={isLoading}
                    data-testid="button-cancel"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    data-testid="button-submit"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? "Salvando..." : "Salvar Conteúdo"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
