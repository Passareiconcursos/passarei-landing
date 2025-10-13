import { useState } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

const estados = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

const concursos = [
  { value: 'PM', label: 'PM - Polícia Militar' },
  { value: 'PC', label: 'PC - Polícia Civil' },
  { value: 'PRF', label: 'PRF - Polícia Rodoviária Federal' },
  { value: 'PF', label: 'PF - Polícia Federal' },
  { value: 'OUTRO', label: 'Outro concurso policial' },
];

export function LeadForm() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    examType: '',
    state: '',
    acceptedWhatsApp: false,
  });

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === 'phone') {
      setFormData(prev => ({ ...prev, [name]: maskPhone(value) }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validações
      if (!formData.name || formData.name.length < 3) {
        throw new Error('Nome deve ter pelo menos 3 caracteres');
      }
      
      if (!formData.email.includes('@')) {
        throw new Error('Email inválido');
      }
      
      if (formData.phone.length < 15) {
        throw new Error('WhatsApp inválido. Use o formato (99) 99999-9999');
      }
      
      if (!formData.examType) {
        throw new Error('Selecione o tipo de concurso');
      }
      
      if (!formData.state) {
        throw new Error('Selecione o estado');
      }
      
      if (!formData.acceptedWhatsApp) {
        throw new Error('Você precisa aceitar receber conteúdo via WhatsApp');
      }

      // Enviar para API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao processar cadastro');
      }

      // Sucesso - redirecionar
      setLocation('/obrigado');

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="João Silva"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
            data-testid="input-name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="joao@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
            data-testid="input-email"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            WhatsApp *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(11) 99999-9999"
            maxLength={15}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
            data-testid="input-phone"
          />
        </div>

        {/* Concurso */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Tipo de Concurso *
          </label>
          <select
            name="examType"
            value={formData.examType}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
            data-testid="select-exam-type"
          >
            <option value="">Selecione o concurso</option>
            {concursos.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Estado *
          </label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
            data-testid="select-state"
          >
            <option value="">Selecione seu estado</option>
            {estados.map(estado => (
              <option key={estado.value} value={estado.value}>{estado.label}</option>
            ))}
          </select>
        </div>

        {/* Checkbox */}
        <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
          <input
            type="checkbox"
            name="acceptedWhatsApp"
            checked={formData.acceptedWhatsApp}
            onChange={handleChange}
            className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            required
            data-testid="checkbox-accept-whatsapp"
          />
          <label className="text-sm text-foreground">
            Aceito receber conteúdo educacional via WhatsApp *
          </label>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-submit-form"
        >
          {loading ? (
            <>
              <Loader2 className="inline mr-2 h-5 w-5 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <span className="text-2xl mr-2">💚</span>
              Eu Vou Passar!
            </>
          )}
        </button>

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
    </div>
  );
}
