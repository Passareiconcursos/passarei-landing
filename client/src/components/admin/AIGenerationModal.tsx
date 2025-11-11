import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Wand2, Loader2, CheckCircle, Circle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Edital {
  id: string;
  examType: string;
  state: string | null;
  year: number;
  organization: string;
  subjects: EditalSubject[];
}

interface EditalSubject {
  name: string;
  weight: number;
  totalTopics?: number;
  topicsList?: string[];
  topics?: string[];
}

interface GeneratedContent {
  title: string;
  definition: string;
  keyPoints: string;
  example: string;
  tip: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AIGenerationModal({ open, onClose, onSuccess }: Props) {
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [editais, setEditais] = useState<Edital[]>([]);
  const [selectedEdital, setSelectedEdital] = useState<Edital | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<EditalSubject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [generatedTopics, setGeneratedTopics] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      loadEditais();
      loadGeneratedTopics();
    }
  }, [open]);

  const loadEditais = async () => {
    try {
      const res = await fetch("/api/admin/editals");
      const data = await res.json();
      if (data.success) {
        setEditais(data.editals);
      }
    } catch (error) {
      console.error("Erro ao carregar editais:", error);
    }
  };

  const loadGeneratedTopics = async () => {
    try {
      const res = await fetch("/api/admin/content/generated-topics");
      const data = await res.json();
      if (data.success) {
        setGeneratedTopics(data.topics);
      }
    } catch (error) {
      console.error("Erro ao carregar tópicos gerados:", error);
    }
  };

  const handleSelectEdital = (editalId: string) => {
    const edital = editais.find((e) => e.id === editalId);
    setSelectedEdital(edital || null);
    setSelectedSubject(null);
    setSelectedTopic("");
    if (edital) setStep(2);
  };

  const handleSelectSubject = (subjectName: string) => {
    const subject = selectedEdital?.subjects.find((s) => s.name === subjectName);
    setSelectedSubject(subject || null);
    setSelectedTopic("");
    if (subject) setStep(3);
  };

  const getTopicsList = (subject: EditalSubject | null): string[] => {
    if (!subject) return [];
    return subject.topicsList || subject.topics || [];
  };

  const getSuggestedTopic = () => {
    if (!selectedSubject) return null;
    const topicsList = getTopicsList(selectedSubject);
    const availableTopics = topicsList.filter(
      (t) => !generatedTopics.includes(`${selectedEdital?.examType}-${selectedSubject.name}-${t}`)
    );
    return availableTopics[0] || null;
  };

  const isTopicGenerated = (topic: string) => {
    return generatedTopics.includes(`${selectedEdital?.examType}-${selectedSubject?.name}-${topic}`);
  };

  const getProgressPercentage = () => {
    if (!selectedSubject) return 0;
    const topicsList = getTopicsList(selectedSubject);
    const total = topicsList.length;
    if (total === 0) return 0;
    const generated = topicsList.filter((t) => isTopicGenerated(t)).length;
    return Math.round((generated / total) * 100);
  };

  const handleGenerate = async () => {
    if (!selectedEdital || !selectedSubject || !selectedTopic) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/admin/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject.name,
          examType: selectedEdital.examType,
          topic: selectedTopic,
          editalContext: {
            organization: selectedEdital.organization,
            year: selectedEdital.year,
            weight: selectedSubject.weight,
          },
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Erro ao gerar");
      }

      setGeneratedContent(data.content);
      setStep(4);

      toast({
        title: "✅ Conteúdo gerado!",
        description: "Revise e edite antes de publicar.",
      });
    } catch (error: any) {
      toast({
        title: "❌ Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!adminNotes.trim()) {
      toast({
        title: "⚠️ Observações necessárias",
        description: "Digite suas observações para regenerar",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/admin/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject!.name,
          examType: selectedEdital!.examType,
          topic: selectedTopic,
          adminNotes: adminNotes,
          editalContext: {
            organization: selectedEdital!.organization,
            year: selectedEdital!.year,
            weight: selectedSubject!.weight,
          },
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      setGeneratedContent(data.content);
      setAdminNotes("");

      toast({
        title: "🔄 Regenerado!",
        description: "Conteúdo atualizado com suas observações.",
      });
    } catch (error: any) {
      toast({
        title: "❌ Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedContent || !selectedEdital || !selectedSubject) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...generatedContent,
          subject: selectedSubject.name,
          examType: selectedEdital.examType,
          status: "PUBLISHED",
          generatedByAI: true,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      await fetch("/api/admin/content/log-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examType: selectedEdital.examType,
          subject: selectedSubject.name,
          topic: selectedTopic,
          contentId: data.content.id,
        }),
      });

      toast({
        title: "✅ Publicado!",
        description: "Conteúdo salvo com sucesso.",
      });

      onSuccess();
      handleClose();
    } catch (error: any) {
      toast({
        title: "❌ Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedEdital(null);
    setSelectedSubject(null);
    setSelectedTopic("");
    setGeneratedContent(null);
    setAdminNotes("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-purple-600" />
            Gerar Conteúdo Inteligente
          </DialogTitle>
        </DialogHeader>

        {step >= 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-purple-600 text-white" : "bg-gray-200"}`}>
                1
              </div>
              <Label className="text-lg font-semibold">Escolha o Concurso</Label>
            </div>

            <div className="grid grid-cols-1 gap-3 pl-10">
              {editais.map((edital) => (
                <button
                  key={edital.id}
                  onClick={() => handleSelectEdital(edital.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedEdital?.id === edital.id
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="font-semibold">
                    {edital.examType} {edital.year}
                  </div>
                  <div className="text-sm text-gray-600">
                    {edital.organization} • {edital.subjects.length} matérias •{" "}
                    {edital.state || "Federal"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step >= 2 && selectedEdital && (
          <div className="space-y-4 mt-6">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-purple-600 text-white" : "bg-gray-200"}`}>
                2
              </div>
              <Label className="text-lg font-semibold">Escolha a Matéria</Label>
            </div>

            <div className="grid grid-cols-1 gap-3 pl-10">
              {selectedEdital.subjects.map((subject) => {
                const topicsList = getTopicsList(subject);
                const progress = topicsList.length > 0 
                  ? Math.round((topicsList.filter((t) => isTopicGenerated(t)).length / topicsList.length) * 100)
                  : 0;
                
                return (
                  <button
                    key={subject.name}
                    onClick={() => handleSelectSubject(subject.name)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedSubject?.name === subject.name
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold">{subject.name.replace(/_/g, " ")}</div>
                      <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        Peso: {subject.weight}%
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-xs">{progress}%</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {topicsList.filter((t) => isTopicGenerated(t)).length}/{topicsList.length} tópicos gerados
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step >= 3 && selectedSubject && (
          <div className="space-y-4 mt-6">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-purple-600 text-white" : "bg-gray-200"}`}>
                3
              </div>
              <Label className="text-lg font-semibold">Escolha o Tópico</Label>
            </div>

            <div className="pl-10 space-y-3">
              {getSuggestedTopic() && (
                <div className="p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-yellow-600" />
                    <span className="font-semibold text-yellow-900">Sugestão Inteligente</span>
                  </div>
                  <button
                    onClick={() => setSelectedTopic(getSuggestedTopic()!)}
                    className={`w-full text-left p-3 rounded border-2 transition-all ${
                      selectedTopic === getSuggestedTopic()
                        ? "border-purple-600 bg-white"
                        : "border-yellow-200 bg-white hover:border-yellow-400"
                    }`}
                  >
                    {getSuggestedTopic()}
                  </button>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">Ou escolha outro:</div>
                {getTopicsList(selectedSubject).map((topic) => {
                  const isGenerated = isTopicGenerated(topic);
                  const isSuggested = topic === getSuggestedTopic();

                  return (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      disabled={isGenerated}
                      className={`w-full text-left p-3 rounded border-2 transition-all flex items-center gap-2 ${
                        isGenerated
                          ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                          : selectedTopic === topic
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      {isGenerated ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : isSuggested ? (
                        <Sparkles className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-400" />
                      )}
                      <span>{topic}</span>
                      {isGenerated && (
                        <span className="ml-auto text-xs text-green-600 font-medium">✓ Gerado</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>← Voltar</Button>
                <Button
                  onClick={handleGenerate}
                  disabled={!selectedTopic || isGenerating}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Gerar Conteúdo
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && generatedContent && (
          <div className="space-y-4 mt-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900">
                ✅ Conteúdo gerado com sucesso! Revise e edite se necessário.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={generatedContent.title}
                  onChange={(e) => setGeneratedContent({ ...generatedContent, title: e.target.value })}
                />
              </div>

              <div>
                <Label>Definição</Label>
                <Textarea
                  value={generatedContent.definition}
                  onChange={(e) => setGeneratedContent({ ...generatedContent, definition: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label>Pontos-Chave</Label>
                <Textarea
                  value={generatedContent.keyPoints}
                  onChange={(e) => setGeneratedContent({ ...generatedContent, keyPoints: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label>Exemplo Prático</Label>
                <Textarea
                  value={generatedContent.example}
                  onChange={(e) => setGeneratedContent({ ...generatedContent, example: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label>Dica para Prova</Label>
                <Textarea
                  value={generatedContent.tip}
                  onChange={(e) => setGeneratedContent({ ...generatedContent, tip: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div className="border-t pt-4">
                <Label>💬 Observações para melhorar (opcional)</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Ex: Adicione mais exemplos práticos de jurisprudência do STF"
                  className="min-h-[80px]"
                />
                {adminNotes && (
                  <Button
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    variant="outline"
                    className="mt-2 w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Regenerando...
                      </>
                    ) : (
                      "🔄 Regenerar com Observações"
                    )}
                  </Button>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep(3)}>← Voltar</Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "✅ Salvar e Publicar"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
