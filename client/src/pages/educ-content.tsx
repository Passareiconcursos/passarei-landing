import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, X, Eye, Link2, AlertCircle, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertContentSchema } from "@shared/schema";

type ContentFormData = z.infer<typeof insertContentSchema>;

// Estados brasileiros
const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

// Matérias organizadas
const subjects = {
  'Direito': [
    { value: 'DIREITO_PENAL', label: 'Direito Penal' },
    { value: 'DIREITO_CONSTITUCIONAL', label: 'Direito Constitucional' },
    { value: 'DIREITO_ADMINISTRATIVO', label: 'Direito Administrativo' },
  ],
  'Conhecimentos Gerais': [
    { value: 'PORTUGUES', label: 'Português' },
    { value: 'RACIOCINIO_LOGICO', label: 'Raciocínio Lógico' },
    { value: 'INFORMATICA', label: 'Informática' },
  ]
};

// Opções de tipo baseadas na esfera
const examTypeOptions: Record<string, Array<{ value: string; label: string }>> = {
  'FEDERAL': [
    { value: 'PRF', label: 'PRF - Polícia Rodoviária Federal' },
    { value: 'PF', label: 'PF - Polícia Federal' },
  ],
  'ESTADUAL': [
    { value: 'PM', label: 'PM - Polícia Militar' },
    { value: 'PC', label: 'PC - Polícia Civil' },
  ]
};

export default function EducContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<ContentFormData>({
    resolver: zodResolver(insertContentSchema),
    defaultValues: {
      title: "",
      subject: "DIREITO_PENAL",
      examType: "",
      body: "",
      editalUrl: "",
      sphere: undefined,
      state: "",
      definition: "",
      keyPoints: "",
      example: "",
      tip: "",
      tags: [],
      status: "DRAFT",
    },
  });

  const sphere = form.watch("sphere");
  const formData = form.watch();

  // Calcular estatísticas
  const fullContent = [
    formData.body || '',
    formData.definition || '',
    formData.keyPoints || '',
    formData.example || '',
    formData.tip || ''
  ].join(' ');
  const wordCount = fullContent.split(' ').filter(w => w.length > 0).length;
  const charCount = fullContent.length;

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      form.setValue('tags', updatedTags);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    const updatedTags = tags.filter(t => t !== tag);
    setTags(updatedTags);
    form.setValue('tags', updatedTags);
  };

  const generateContentId = () => {
    if (!formData.sphere || !formData.examType) return '';
    
    let id = formData.sphere === 'FEDERAL' 
      ? formData.examType 
      : `${formData.examType}-${formData.state}`;
    
    if (formData.subject) {
      const subjectLabel = [...subjects['Direito'], ...subjects['Conhecimentos Gerais']]
        .find(s => s.value === formData.subject)?.label || '';
      id += `_${subjectLabel.replace(/\s+/g, '-')}`;
    }
    
    return id;
  };

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
        setShowPreview(false);
        setTags([]);
        form.reset();
        
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

  const ContentPreview = () => (
    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
      <h3 className="text-2xl font-bold text-gray-900">{formData.title || 'Título do Conteúdo'}</h3>
      
      {formData.definition && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Definição</h4>
          <p className="text-gray-600">{formData.definition}</p>
        </div>
      )}
      
      {formData.keyPoints && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Pontos Principais</h4>
          <p className="text-gray-600 whitespace-pre-wrap">{formData.keyPoints}</p>
        </div>
      )}
      
      {formData.example && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Exemplo Prático</h4>
          <p className="text-gray-600">{formData.example}</p>
        </div>
      )}
      
      {formData.tip && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">Dica de Prova</h4>
          <p className="text-yellow-700">{formData.tip}</p>
        </div>
      )}
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );

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

        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            Nenhum conteúdo cadastrado ainda. Clique em "Criar Conteúdo" para adicionar.
          </p>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl">Criar Novo Conteúdo</DialogTitle>
                <p className="text-gray-600 text-sm mt-1">Organize o conteúdo em seções estruturadas</p>
              </div>
            </div>
          </DialogHeader>

          {/* Tabs: Formulário / Preview */}
          <div className="border-b">
            <div className="flex px-6">
              <button
                onClick={() => setShowPreview(false)}
                className={`px-4 py-3 font-medium ${!showPreview ? 'border-b-2 border-[#18cb96] text-[#18cb96]' : 'text-gray-600'}`}
              >
                Formulário
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className={`px-4 py-3 font-medium ${showPreview ? 'border-b-2 border-[#18cb96] text-[#18cb96]' : 'text-gray-600'}`}
              >
                <Eye size={18} className="inline mr-2" />
                Preview
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {showPreview ? (
              <ContentPreview />
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Título */}
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    data-testid="input-title"
                    {...form.register("title")}
                    placeholder="Ex: Princípio da Legalidade"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.title.message}</p>
                  )}
                </div>

                {/* Link do Edital */}
                <div>
                  <Label htmlFor="editalUrl">Link do Edital (Opcional)</Label>
                  <div className="relative">
                    <Link2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="editalUrl"
                      type="url"
                      {...form.register("editalUrl")}
                      placeholder="https://exemplo.com/edital.pdf"
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Cole o link do PDF do edital. Futuramente a IA extrairá matérias automaticamente.
                  </p>
                </div>

                {/* Grid: Esfera, Tipo, Estado */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Esfera */}
                  <div>
                    <Label htmlFor="sphere">Esfera</Label>
                    <select
                      id="sphere"
                      {...form.register("sphere", {
                        onChange: () => {
                          form.setValue('examType', '');
                          form.setValue('state', '');
                        }
                      })}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18cb96]"
                    >
                      <option value="">Selecione...</option>
                      <option value="FEDERAL">Federal</option>
                      <option value="ESTADUAL">Estadual</option>
                    </select>
                  </div>

                  {/* Tipo */}
                  <div>
                    <Label htmlFor="examType">Tipo</Label>
                    <select
                      id="examType"
                      data-testid="select-exam-type"
                      {...form.register("examType")}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18cb96] disabled:bg-gray-100"
                      disabled={!sphere}
                    >
                      <option value="">
                        {sphere ? 'Selecione...' : 'Escolha esfera primeiro'}
                      </option>
                      {sphere && examTypeOptions[sphere]?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Estado (só se ESTADUAL) */}
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <select
                      id="state"
                      {...form.register("state")}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18cb96] disabled:bg-gray-100"
                      disabled={sphere !== 'ESTADUAL'}
                    >
                      <option value="">
                        {sphere === 'ESTADUAL' ? 'Selecione...' : 'Não se aplica'}
                      </option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ID Preview */}
                {generateContentId() && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-blue-900">Identificador</p>
                    <code className="text-blue-700 font-mono text-sm">{generateContentId()}</code>
                  </div>
                )}

                {/* Matéria */}
                <div>
                  <Label htmlFor="subject">Matéria</Label>
                  <select
                    id="subject"
                    data-testid="select-subject"
                    {...form.register("subject")}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18cb96]"
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

                {/* Conteúdo Completo (body) - mantido para compatibilidade */}
                <div>
                  <Label htmlFor="body">Conteúdo Completo</Label>
                  <Textarea
                    id="body"
                    data-testid="textarea-body"
                    {...form.register("body")}
                    placeholder="Texto completo do conteúdo (200-500 palavras)..."
                    className="min-h-[100px]"
                  />
                  {form.formState.errors.body && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.body.message}</p>
                  )}
                </div>

                {/* Seções de Conteúdo */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Estrutura do Conteúdo (Opcional)</h3>
                  
                  {/* Definição */}
                  <div className="mb-4">
                    <Label htmlFor="definition">1. Definição Clara</Label>
                    <Textarea
                      id="definition"
                      {...form.register("definition")}
                      placeholder="Explique o conceito de forma clara e direta..."
                      className="min-h-[80px]"
                    />
                  </div>

                  {/* Pontos Principais */}
                  <div className="mb-4">
                    <Label htmlFor="keyPoints">2. Pontos Principais</Label>
                    <Textarea
                      id="keyPoints"
                      {...form.register("keyPoints")}
                      placeholder="Liste 2-3 pontos-chave (um por linha)"
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Exemplo */}
                  <div className="mb-4">
                    <Label htmlFor="example">3. Exemplo Prático</Label>
                    <Textarea
                      id="example"
                      {...form.register("example")}
                      placeholder="Descreva uma situação real que ilustre o conceito..."
                      className="min-h-[80px]"
                    />
                  </div>

                  {/* Dica */}
                  <div className="mb-4">
                    <Label htmlFor="tip">4. Dica de Prova</Label>
                    <Textarea
                      id="tip"
                      {...form.register("tip")}
                      placeholder="O que as bancas adoram cobrar sobre este tema..."
                      className="min-h-[80px]"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Label>Tags (Opcional)</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Ex: CESPE, Importantes, Difícil"
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      variant="secondary"
                    >
                      <Plus size={18} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-blue-900">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Estatísticas */}
                <div className="flex gap-6 text-sm text-gray-600">
                  <span>{charCount} caracteres</span>
                  <span>{wordCount} palavras</span>
                  {wordCount < 100 && (
                    <span className="text-orange-500 flex items-center gap-1">
                      <AlertCircle size={16} />
                      Mínimo 100 palavras
                    </span>
                  )}
                </div>

                {/* Status */}
                <div>
                  <Label>Status de Publicação</Label>
                  <RadioGroup
                    value={formData.status}
                    onValueChange={(value) => form.setValue('status', value as any)}
                    className="space-y-2 mt-3"
                  >
                    <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="DRAFT" data-testid="radio-status-DRAFT" />
                      <div>
                        <p className="font-medium">Rascunho</p>
                        <p className="text-xs text-gray-500">Não visível para usuários</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="PUBLISHED" data-testid="radio-status-PUBLISHED" />
                      <div>
                        <p className="font-medium">Publicado</p>
                        <p className="text-xs text-gray-500">Visível imediatamente</p>
                      </div>
                    </label>
                  </RadioGroup>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 bg-gray-50 flex gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsDialogOpen(false);
                setShowPreview(false);
                setTags([]);
                form.reset();
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading}
              className="flex-1 bg-[#18cb96] hover:bg-[#15b385]"
              data-testid="button-submit-content"
            >
              {isLoading ? (
                <>Salvando...</>
              ) : (
                <>
                  <Check size={20} className="mr-2" />
                  Salvar Conteúdo
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
