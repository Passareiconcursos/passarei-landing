import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  FileText
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertContentSchema, type Content } from "@shared/schema";

type ContentFormData = z.infer<typeof insertContentSchema>;

// Matérias expandidas com as 34 matérias
const subjects = {
  'Direito': [
    { value: 'DIREITO_PENAL', label: 'Direito Penal' },
    { value: 'DIREITO_CONSTITUCIONAL', label: 'Direito Constitucional' },
    { value: 'DIREITO_ADMINISTRATIVO', label: 'Direito Administrativo' },
    { value: 'DIREITO_PROCESSUAL_PENAL', label: 'Direito Processual Penal' },
    { value: 'DIREITO_CIVIL', label: 'Direito Civil' },
    { value: 'DIREITO_PENAL_MILITAR', label: 'Direito Penal Militar' },
    { value: 'DIREITO_PROCESSUAL_PENAL_MILITAR', label: 'Direito Processual Penal Militar' },
    { value: 'DIREITOS_HUMANOS', label: 'Direitos Humanos' },
    { value: 'LEGISLACAO_ESPECIAL', label: 'Legislação Especial' },
  ],
  'Conhecimentos Básicos': [
    { value: 'PORTUGUES', label: 'Português' },
    { value: 'RACIOCINIO_LOGICO', label: 'Raciocínio Lógico' },
    { value: 'MATEMATICA', label: 'Matemática' },
    { value: 'INFORMATICA', label: 'Informática' },
    { value: 'ATUALIDADES', label: 'Atualidades' },
    { value: 'GEOGRAFIA', label: 'Geografia' },
    { value: 'HISTORIA', label: 'História' },
    { value: 'ETICA_SERVICO_PUBLICO', label: 'Ética no Serviço Público' },
    { value: 'INGLES', label: 'Inglês' },
    { value: 'ESPANHOL', label: 'Espanhol' },
  ],
  'Conhecimentos Técnicos': [
    { value: 'CRIMINOLOGIA', label: 'Criminologia' },
    { value: 'MEDICINA_LEGAL', label: 'Medicina Legal' },
    { value: 'LEGISLACAO_TRANSITO', label: 'Legislação de Trânsito' },
    { value: 'NOCOES_FISICA', label: 'Noções de Física' },
    { value: 'GEOPOLITICA', label: 'Geopolítica' },
    { value: 'PRIMEIROS_SOCORROS', label: 'Primeiros Socorros' },
    { value: 'ESTATISTICA', label: 'Estatística' },
    { value: 'CONTABILIDADE', label: 'Contabilidade' },
    { value: 'ARQUIVOLOGIA', label: 'Arquivologia' },
    { value: 'ADMINISTRACAO_PUBLICA', label: 'Administração Pública' },
  ],
  'Perícia': [
    { value: 'BIOLOGIA_FORENSE', label: 'Biologia Forense' },
    { value: 'QUIMICA_FORENSE', label: 'Química Forense' },
    { value: 'FISICA_FORENSE', label: 'Física Forense' },
    { value: 'INFORMATICA_FORENSE', label: 'Informática Forense' },
  ]
};

const examTypeLabels: Record<string, string> = {
  'PM': 'PM',
  'PC': 'PC',
  'PRF': 'PRF',
  'PF': 'PF',
  'OUTRO': 'Outro'
};

const statusLabels: Record<string, string> = {
  'DRAFT': 'Rascunho',
  'PUBLISHED': 'Publicado',
  'ARCHIVED': 'Arquivado'
};

function getSubjectLabel(value: string): string {
  for (const category of Object.values(subjects)) {
    const found = category.find(s => s.value === value);
    if (found) return found.label;
  }
  return value;
}

export default function EducContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    subject: '',
    examType: '',
    sphere: '',
    state: '',
    status: '',
    generatedByAI: '',
    page: 1,
    limit: 20,
  });

  // Fetch content list
  const { data, isLoading: isLoadingContent } = useQuery<{
    success: boolean;
    content: Content[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>({
    queryKey: ['/api/admin/content', filters],
  });

  const form = useForm<ContentFormData>({
    resolver: zodResolver(insertContentSchema),
    defaultValues: {
      title: "",
      subject: "DIREITO_PENAL",
      examType: "PF",
      body: "",
      sphere: "FEDERAL",
      cargoTarget: [],
      materialId: "",
      definition: "",
      keyPoints: "",
      example: "",
      tip: "",
      tags: [],
      status: "DRAFT",
    },
  });

  const onSubmit = async (data: ContentFormData) => {
    setIsLoading(true);
    try {
      const method = editingContent ? "PUT" : "POST";
      const endpoint = editingContent 
        ? `/api/admin/content/${editingContent.id}` 
        : "/api/admin/content";
      
      const res = await apiRequest(method, endpoint, data);
      const response = await res.json();

      if (response.success) {
        toast({
          title: editingContent ? "Conteúdo atualizado!" : "Conteúdo criado!",
          description: `"${data.title}" foi ${editingContent ? 'atualizado' : 'adicionado'} com sucesso.`,
        });

        setIsDialogOpen(false);
        setEditingContent(null);
        form.reset();
        
        queryClient.invalidateQueries({ queryKey: ["/api/admin/content"] });
      } else {
        throw new Error(response.error || "Erro ao salvar conteúdo");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar conteúdo",
        description: error.message || "Ocorreu um erro inesperado.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (content: Content) => {
    setEditingContent(content);
    form.reset({
      title: content.title,
      subject: content.subject,
      examType: content.examType,
      body: content.body,
      sphere: content.sphere || undefined,
      state: content.state || "",
      cargoTarget: content.cargoTarget || [],
      materialId: content.materialId || "",
      definition: content.definition || "",
      keyPoints: content.keyPoints || "",
      example: content.example || "",
      tip: content.tip || "",
      tags: content.tags || [],
      status: content.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja deletar "${title}"?`)) return;

    try {
      const res = await apiRequest("DELETE", `/api/admin/content/${id}`);
      const response = await res.json();

      if (response.success) {
        toast({
          title: "Conteúdo deletado!",
          description: `"${title}" foi removido com sucesso.`,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/content"] });
      } else {
        throw new Error(response.error || "Erro ao deletar");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao deletar",
        description: error.message,
      });
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      subject: '',
      examType: '',
      sphere: '',
      state: '',
      status: '',
      generatedByAI: '',
      page: 1,
      limit: 20,
    });
  };

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => key !== 'page' && key !== 'limit' && value !== ''
  ).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold" data-testid="heading-content">Conteúdo</h1>
            <p className="text-muted-foreground">
              Gerencie o conteúdo educacional da plataforma
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingContent(null);
              form.reset();
              setIsDialogOpen(true);
            }}
            data-testid="button-create-content"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Conteúdo
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título ou conteúdo..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              data-testid="button-toggle-filters"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>

            {activeFiltersCount > 0 && (
              <Button variant="ghost" onClick={clearFilters}>
                Limpar
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div>
                <Label>Matéria</Label>
                <select
                  value={filters.subject}
                  onChange={(e) => handleFilterChange('subject', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Todas</option>
                  {Object.entries(subjects).map(([category, items]) => (
                    <optgroup key={category} label={category}>
                      {items.map(subject => (
                        <option key={subject.value} value={subject.value}>
                          {subject.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <Label>Tipo de Concurso</Label>
                <select
                  value={filters.examType}
                  onChange={(e) => handleFilterChange('examType', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Todos</option>
                  {Object.entries(examTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Status</Label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Todos</option>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Gerado por IA</Label>
                <select
                  value={filters.generatedByAI}
                  onChange={(e) => handleFilterChange('generatedByAI', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Todos</option>
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
              </div>
            </div>
          )}
        </Card>

        {/* Content List */}
        <Card className="p-6">
          {isLoadingContent ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando...
            </div>
          ) : data?.content && data.content.length > 0 ? (
            <div className="space-y-4">
              {data.content.map((content) => (
                <div
                  key={content.id}
                  className="flex items-start justify-between gap-4 p-4 border rounded-lg hover-elevate"
                  data-testid={`content-item-${content.id}`}
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-lg">{content.title}</h3>
                      {content.generatedByAI && (
                        <Badge variant="secondary" className="gap-1">
                          <Sparkles className="h-3 w-3" />
                          IA
                        </Badge>
                      )}
                      <Badge variant={content.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                        {statusLabels[content.status]}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <span>{getSubjectLabel(content.subject)}</span>
                      <span>•</span>
                      <span>{examTypeLabels[content.examType]}</span>
                      {content.sphere && (
                        <>
                          <span>•</span>
                          <span>{content.sphere}</span>
                        </>
                      )}
                      {content.state && (
                        <>
                          <span>•</span>
                          <span>{content.state}</span>
                        </>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {content.body}
                    </p>

                    {content.tags && content.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {content.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(content)}
                      data-testid={`button-edit-${content.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(content.id, content.title)}
                      data-testid={`button-delete-${content.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {data.pagination && data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {((data.pagination.page - 1) * data.pagination.limit) + 1} - {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} de {data.pagination.total} conteúdos
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={filters.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                    >
                      {data.pagination.page} / {data.pagination.totalPages}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={filters.page >= data.pagination.totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="font-medium">Nenhum conteúdo encontrado</p>
                <p className="text-sm text-muted-foreground">
                  {activeFiltersCount > 0 
                    ? 'Tente ajustar os filtros ou limpar a busca' 
                    : 'Clique em "Criar Conteúdo" para adicionar'}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setEditingContent(null);
          form.reset();
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingContent ? 'Editar Conteúdo' : 'Criar Novo Conteúdo'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                data-testid="input-title"
                {...form.register("title")}
                placeholder="Ex: Princípio da Legalidade"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subject">Matéria</Label>
                <select
                  id="subject"
                  data-testid="select-subject"
                  {...form.register("subject")}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {Object.entries(subjects).map(([category, items]) => (
                    <optgroup key={category} label={category}>
                      {items.map(subject => (
                        <option key={subject.value} value={subject.value}>{subject.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="examType">Tipo de Concurso</Label>
                <select
                  id="examType"
                  data-testid="select-exam-type"
                  {...form.register("examType")}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {Object.entries(examTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="body">Conteúdo Completo</Label>
              <Textarea
                id="body"
                data-testid="textarea-body"
                {...form.register("body")}
                placeholder="Texto completo do conteúdo..."
                className="min-h-[150px]"
              />
              {form.formState.errors.body && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.body.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                {...form.register("status")}
                className="w-full px-3 py-2 border rounded-md"
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
                data-testid="button-submit-content"
              >
                {isLoading ? 'Salvando...' : editingContent ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
