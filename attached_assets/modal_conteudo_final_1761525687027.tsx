import React, { useState } from 'react';
import { X, Plus, Check, AlertCircle, Link2, Eye } from 'lucide-react';

export default function ModalCriarConteudoFinal() {
  const [formData, setFormData] = useState({
    title: '',
    editalUrl: '',
    sphere: '',
    examType: '',
    state: '',
    subject: '',
    sections: {
      definition: '',
      keyPoints: '',
      example: '',
      tip: ''
    },
    tags: [],
    status: 'DRAFT'
  });

  const [showPreview, setShowPreview] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Estados brasileiros
  const states = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  // Matérias organizadas
  const subjects = {
    'Direito': [
      'Direito Penal',
      'Direito Constitucional',
      'Direito Administrativo',
      'Direito Processual Penal',
      'Legislação Especial',
      'Direitos Humanos'
    ],
    'Conhecimentos Gerais': [
      'Português',
      'Raciocínio Lógico',
      'Matemática',
      'Informática',
      'Atualidades',
      'Geografia',
      'História'
    ],
    'Específicas': [
      'Criminologia',
      'Ética Policial',
      'Legislação de Trânsito',
      'Primeiros Socorros'
    ]
  };

  // Opções de tipo baseadas na esfera
  const examTypeOptions = {
    'FEDERAL': [
      { value: 'PRF', label: 'PRF - Polícia Rodoviária Federal' },
      { value: 'PF', label: 'PF - Polícia Federal' },
      { value: 'PCDF', label: 'PC-DF - Polícia Civil DF' },
      { value: 'PMDF', label: 'PM-DF - Polícia Militar DF' }
    ],
    'ESTADUAL': [
      { value: 'PM', label: 'PM - Polícia Militar' },
      { value: 'PC', label: 'PC - Polícia Civil' }
    ]
  };

  // Calcular estatísticas
  const fullContent = Object.values(formData.sections).join(' ');
  const wordCount = fullContent.split(' ').filter(w => w.length > 0).length;
  const charCount = fullContent.length;

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const generateContentId = () => {
    if (!formData.sphere || !formData.examType) return '';
    
    let id = formData.sphere === 'FEDERAL' 
      ? formData.examType 
      : `${formData.examType}-${formData.state}`;
    
    if (formData.subject) {
      id += `_${formData.subject.replace(/\s+/g, '-')}`;
    }
    
    return id;
  };

  const ContentPreview = () => (
    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
      <h3 className="text-2xl font-bold text-gray-900">{formData.title || 'Título do Conteúdo'}</h3>
      
      {formData.sections.definition && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Definição</h4>
          <p className="text-gray-600">{formData.sections.definition}</p>
        </div>
      )}
      
      {formData.sections.keyPoints && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Pontos Principais</h4>
          <p className="text-gray-600 whitespace-pre-wrap">{formData.sections.keyPoints}</p>
        </div>
      )}
      
      {formData.sections.example && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Exemplo Prático</h4>
          <p className="text-gray-600">{formData.sections.example}</p>
        </div>
      )}
      
      {formData.sections.tip && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">Dica de Prova</h4>
          <p className="text-yellow-700">{formData.sections.tip}</p>
        </div>
      )}
      
      {formData.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {formData.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Criar Novo Conteúdo</h2>
            <p className="text-gray-600 text-sm">Organize o conteúdo em seções estruturadas</p>
          </div>
          <button 
            onClick={() => {}}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs: Formulário / Preview */}
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setShowPreview(false)}
              className={`px-6 py-3 font-medium ${!showPreview ? 'border-b-2 border-[#18cb96] text-[#18cb96]' : 'text-gray-600'}`}
            >
              Formulário
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className={`px-6 py-3 font-medium ${showPreview ? 'border-b-2 border-[#18cb96] text-[#18cb96]' : 'text-gray-600'}`}
            >
              <Eye size={18} className="inline mr-2" />
              Preview
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {showPreview ? (
            <ContentPreview />
          ) : (
            <div className="space-y-6">
              
              {/* Título */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Princípio da Legalidade"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18cb96] focus:border-transparent"
                />
              </div>

              {/* Link do Edital */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Link do Edital (Opcional)
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Link2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      value={formData.editalUrl}
                      onChange={(e) => setFormData({...formData, editalUrl: e.target.value})}
                      placeholder="https://exemplo.com/edital.pdf"
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18cb96] focus:border-transparent"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Cole o link do PDF do edital. Futuramente a IA extrairá matérias automaticamente.
                </p>
              </div>

              {/* Grid: Esfera, Tipo, Estado */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Esfera */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Esfera</label>
                  <select
                    value={formData.sphere}
                    onChange={(e) => setFormData({
                      ...formData, 
                      sphere: e.target.value,
                      examType: '',
                      state: ''
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
                  <label className="block text-sm font-semibold mb-2">Tipo</label>
                  <select
                    value={formData.examType}
                    onChange={(e) => setFormData({...formData, examType: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18cb96] disabled:bg-gray-100"
                    disabled={!formData.sphere}
                  >
                    <option value="">
                      {formData.sphere ? 'Selecione...' : 'Escolha esfera primeiro'}
                    </option>
                    {formData.sphere && examTypeOptions[formData.sphere]?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Estado (só se ESTADUAL) */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Estado</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18cb96] disabled:bg-gray-100"
                    disabled={formData.sphere !== 'ESTADUAL'}
                  >
                    <option value="">
                      {formData.sphere === 'ESTADUAL' ? 'Selecione...' : 'Não se aplica'}
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
                <label className="block text-sm font-semibold mb-2">Matéria</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18cb96]"
                >
                  <option value="">Selecione...</option>
                  {Object.entries(subjects).map(([category, items]) => (
                    <optgroup key={category} label={category}>
                      {items.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Seções de Conteúdo */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Estrutura do Conteúdo</h3>
                
                {/* Definição */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">
                    1. Definição Clara
                  </label>
                  <textarea
                    value={formData.sections.definition}
                    onChange={(e) => setFormData({
                      ...formData,
                      sections: {...formData.sections, definition: e.target.value}
                    })}
                    placeholder="Explique o conceito de forma clara e direta..."
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18cb96] min-h-[80px]"
                  />
                </div>

                {/* Pontos Principais */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">
                    2. Pontos Principais
                  </label>
                  <textarea
                    value={formData.sections.keyPoints}
                    onChange={(e) => setFormData({
                      ...formData,
                      sections: {...formData.sections, keyPoints: e.target.value}
                    })}
                    placeholder="Liste 2-3 pontos-chave (um por linha)"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18cb96] min-h-[100px]"
                  />
                </div>

                {/* Exemplo */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">
                    3. Exemplo Prático
                  </label>
                  <textarea
                    value={formData.sections.example}
                    onChange={(e) => setFormData({
                      ...formData,
                      sections: {...formData.sections, example: e.target.value}
                    })}
                    placeholder="Descreva uma situação real que ilustre o conceito..."
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18cb96] min-h-[80px]"
                  />
                </div>

                {/* Dica */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">
                    4. Dica de Prova
                  </label>
                  <textarea
                    value={formData.sections.tip}
                    onChange={(e) => setFormData({
                      ...formData,
                      sections: {...formData.sections, tip: e.target.value}
                    })}
                    placeholder="O que as bancas adoram cobrar sobre este tema..."
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18cb96] min-h-[80px]"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Tags (Opcional)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Ex: CESPE, Importantes, Difícil"
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#18cb96]"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-blue-900">
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
                <label className="block text-sm font-semibold mb-3">
                  Status de Publicação
                </label>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="DRAFT"
                      checked={formData.status === 'DRAFT'}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Rascunho</p>
                      <p className="text-xs text-gray-500">Não visível para usuários</p>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="PUBLISHED"
                      checked={formData.status === 'PUBLISHED'}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Publicado</p>
                      <p className="text-xs text-gray-500">Visível imediatamente</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 flex gap-4">
          <button
            type="button"
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
          >
            Cancelar
          </button>
          <button
            type="button"
            className="flex-1 px-6 py-3 bg-[#18cb96] text-white rounded-lg hover:bg-[#15b385] font-semibold flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Salvar Conteúdo
          </button>
        </div>
      </div>
    </div>
  );
}