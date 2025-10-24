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
import { FileText, Plus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const contentSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  type: z.enum(["QUESTAO", "MATERIAL", "VIDEO", "ARTIGO"]),
  category: z.string().min(1, "Selecione uma categoria"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  content: z.string().min(20, "Conteúdo deve ter no mínimo 20 caracteres"),
});

type ContentFormData = z.infer<typeof contentSchema>;

export default function EducContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: "",
      type: "QUESTAO",
      category: "",
      description: "",
      content: "",
    },
  });

  const onSubmit = async (data: ContentFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implementar chamada à API
      console.log("Criar conteúdo:", data);
      
      toast({
        title: "Conteúdo criado com sucesso!",
        description: `${data.title} foi adicionado à plataforma.`,
      });

      setIsDialogOpen(false);
      form.reset();
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
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
                Página em construção. Funcionalidade será implementada em breve.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
