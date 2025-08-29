import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductHeader } from "@/components/ProductHeader";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import useFacebookPixel from "@/hooks/useFacebookPixel";

interface AddressData {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const { toast } = useToast();
  const { trackPageView, trackInitiateCheckout, trackCompleteRegistration, trackEngagement } = useFacebookPixel();

  useEffect(() => {
    // Track page view
    trackPageView(window.location.href);
    
    // Track InitiateCheckout event
    trackInitiateCheckout({
      content_ids: ['coloriae_pijama_12anos'],
      content_name: 'Pijama Coloriaê + 12 Canetinhas',
      content_category: 'Pijamas Infantis',
      value: 167.00,
      currency: 'BRL',
      num_items: quantity
    });
  }, []);

  // Identificação
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    celular: "",
  });

  // Entrega
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [deliveryData, setDeliveryData] = useState({
    cep: "",
    numero: "",
    complemento: "",
  });

  const [errors, setErrors] = useState<{[key: string]: boolean}>({});

  const productPrice = 167.00;
  const totalPrice = productPrice * quantity;

  // Validação de CPF
  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
    
    return true;
  };

  // Validação de email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validação de telefone
  const validatePhone = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  };

  // Auto-complete de email
  const handleEmailChange = (value: string) => {
    handleInputChange('email', value);
    
    if (value.includes('@') && !value.includes('.')) {
      const [localPart, domain] = value.split('@');
      if (domain && domain.length > 0) {
        const domains = ['gmail.com', 'hotmail.com', 'icloud.com', 'yahoo.com', 'outlook.com'];
        const suggestions = domains
          .filter(d => d.startsWith(domain.toLowerCase()))
          .map(d => `${localPart}@${d}`);
        setEmailSuggestions(suggestions);
        setShowEmailSuggestions(suggestions.length > 0);
      } else {
        setShowEmailSuggestions(false);
      }
    } else {
      setShowEmailSuggestions(false);
    }
  };

  const selectEmailSuggestion = (suggestion: string) => {
    handleInputChange('email', suggestion);
    setShowEmailSuggestions(false);
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleDeliveryInputChange = (field: string, value: string) => {
    setDeliveryData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const validateStep1 = () => {
    const newErrors: {[key: string]: boolean} = {};
    
    if (!formData.nome.trim()) newErrors.nome = true;
    if (!formData.email.trim()) newErrors.email = true;
    else if (!validateEmail(formData.email)) newErrors.emailInvalid = true;
    if (!formData.cpf.trim()) newErrors.cpf = true;
    else if (!validateCPF(formData.cpf)) newErrors.cpfInvalid = true;
    if (!formData.celular.trim()) newErrors.celular = true;
    else if (!validatePhone(formData.celular)) newErrors.celularInvalid = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: {[key: string]: boolean} = {};
    
    if (!deliveryData.cep.trim()) newErrors.cep = true;
    if (!deliveryData.numero.trim()) newErrors.numero = true;
    if (!addressData) newErrors.cep = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCEPConsult = async (cep: string) => {
    if (!cep.replace(/\D/g, '')) return;

    setLoading(true);
    try {
      const cleanCep = cep.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Por favor, verifique o CEP digitado",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      setAddressData(data);
      setLoading(false);
      
    } catch (error) {
      toast({
        title: "Erro na consulta",
        description: "Não foi possível consultar o CEP. Tente novamente.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        // Track registration completion
        trackCompleteRegistration('form');
        trackEngagement('step_1_completed', {
          form_data: formData
        });
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        // Track engagement on step 2
        trackEngagement('step_2_completed', {
          address_data: addressData
        });
        setCurrentStep(3);
      }
    }
  };

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      // Preparar dados para a página de confirmação
      const confirmationData = {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        celular: formData.celular,
        endereco: {
          cep: deliveryData.cep,
          logradouro: addressData?.logradouro || '',
          numero: deliveryData.numero,
          complemento: deliveryData.complemento,
          bairro: addressData?.bairro || '',
          localidade: addressData?.localidade || '',
          uf: addressData?.uf || ''
        },
        produto: {
          nome: 'Pijama Coloriaê + 12 Canetinhas que Saem na Lavagem (De Presente Hoje!!)',
          imagem: 'https://images.yampi.me/assets/stores/coloriae/uploads/images/pijama-coloriae-12-canetinhas-que-saem-na-lavagem-de-presente-hoje-12-anos-689d19ded223d-thumb.jpg',
          preco: productPrice,
          quantidade: quantity,
          tamanho: '12 ANOS'
        },
        total: totalPrice
      };
      
      // Salvar dados no sessionStorage para recuperar na página de confirmação
      sessionStorage.setItem('confirmationData', JSON.stringify(confirmationData));
      
      // Navegar para página de pagamento com os dados
      navigate('/pagamento', { state: confirmationData });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductHeader />
      
      {/* Timer oferta */}
      <div className="bg-blue-400 text-white text-center py-3">
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm">⏰ Oferta termina em</span>
          <span className="font-bold">00:05:54</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-blue-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${currentStep >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="text-xs">Informações pessoais</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-blue-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="text-xs">Entrega</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-blue-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="text-xs">Pagamento</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-blue-500 h-1 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Resumo do produto */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-gray-900">RESUMO (1)</h2>
          </div>
          <div className="flex gap-4">
            <img 
              src="https://images.yampi.me/assets/stores/coloriae/uploads/images/pijama-coloriae-12-canetinhas-que-saem-na-lavagem-de-presente-hoje-12-anos-689d19ded223d-thumb.jpg" 
              alt="Pijama Coloriaê" 
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-800 mb-1">
                Pijama Coloriaê + 12 Canetinhas que Saem na Lavagem (De Presente Hoje!!)
              </h3>
              <p className="text-xs text-gray-600 mb-2">TAMANHO: 12 ANOS</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs">Qtd:</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-1 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 py-1 text-xs font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-1 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <span className="font-bold">R$ {(productPrice * quantity).toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Produtos</span>
              <span className="text-sm">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
            </div>
            {currentStep >= 2 && addressData && (
              <div className="flex justify-between">
                <span className="text-sm">Frete</span>
                <span className="text-sm text-green-600">Grátis</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-blue-600">
              <span>Total</span>
              <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>

        {/* Step 1: Identificação */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <h2 className="font-semibold text-gray-800">Identificação</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Utilizaremos seu e-mail para: identificar seu perfil, histórico de compra, notificação de pedidos e carrinho de compras.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                <Input
                  placeholder="ex.: Maria de Almeida Cruz"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className={errors.nome ? 'border-red-500' : ''}
                />
                {errors.nome && <p className="text-xs text-red-500 mt-1">Campo obrigatório</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <div className="relative">
                  <Input
                    placeholder="ex.: maria@gmail.com"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className={errors.email || errors.emailInvalid ? 'border-red-500' : ''}
                  />
                  {showEmailSuggestions && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
                      {emailSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectEmailSuggestion(suggestion)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">Campo obrigatório</p>}
                {errors.emailInvalid && <p className="text-xs text-red-500 mt-1">Email inválido</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                <Input
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  className={errors.cpf || errors.cpfInvalid ? 'border-red-500' : ''}
                />
                {errors.cpf && <p className="text-xs text-red-500 mt-1">Campo obrigatório</p>}
                {errors.cpfInvalid && <p className="text-xs text-red-500 mt-1">CPF inválido</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Celular / WhatsApp</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +55
                  </span>
                  <Input
                    placeholder="(00) 00000-0000"
                    value={formData.celular}
                    onChange={(e) => handleInputChange('celular', e.target.value)}
                    className={`rounded-l-none ${errors.celular || errors.celularInvalid ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.celular && <p className="text-xs text-red-500 mt-1">Campo obrigatório</p>}
                {errors.celularInvalid && <p className="text-xs text-red-500 mt-1">Telefone inválido</p>}
              </div>

              <Button 
                onClick={handleNext}
                className="w-full bg-blue-400 hover:bg-blue-500 text-white"
              >
                Ir para Entrega
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Entrega */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <button 
                onClick={() => setCurrentStep(1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <h2 className="font-semibold text-gray-800">Entrega</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Cadastre ou selecione um endereço
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                <Input
                  placeholder=""
                  value={deliveryData.cep}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleDeliveryInputChange('cep', value);
                    if (value.replace(/\D/g, '').length === 8) {
                      handleCEPConsult(value);
                    }
                  }}
                  className={errors.cep ? 'border-red-500' : ''}
                  maxLength={9}
                />
                {errors.cep && <p className="text-xs text-red-500 mt-1">Campo obrigatório</p>}
              </div>

              {addressData && (
                <>
                  <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
                    <div className="font-semibold">{addressData.localidade} / {addressData.uf}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                    <Input
                      value={addressData.logradouro}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                      <Input
                        value={deliveryData.numero}
                        onChange={(e) => handleDeliveryInputChange('numero', e.target.value)}
                        className={errors.numero ? 'border-red-500' : ''}
                      />
                      {errors.numero && <p className="text-xs text-red-500 mt-1">Campo obrigatório</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                      <Input
                        value={addressData.bairro}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Complemento (opcional)</label>
                    <Input
                      value={deliveryData.complemento}
                      onChange={(e) => handleDeliveryInputChange('complemento', e.target.value)}
                    />
                  </div>
                </>
              )}

              <Button 
                onClick={handleNext}
                disabled={!addressData || loading}
                className="w-full bg-blue-400 hover:bg-blue-500 text-white"
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Pagamento */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <button 
                onClick={() => setCurrentStep(2)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <h2 className="font-semibold text-gray-800">Pagamento</h2>
            </div>

            {addressData && (
              <div className="mb-6 p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">+ Novo endereço</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{addressData.logradouro}, {deliveryData.numero} - {addressData.bairro}</p>
                  <p>{addressData.localidade}-{addressData.uf} | CEP {deliveryData.cep}</p>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Escolha uma forma de entrega:</h3>
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">FRETE GRÁTIS Expresso + Rastreamento</p>
                    <p className="text-xs text-gray-600">(Estimativa: 5 a 9 dias úteis)</p>
                    <p className="text-xs text-gray-600">Entrega garantida</p>
                  </div>
                  <span className="text-sm font-medium text-green-600">Grátis</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-400 hover:bg-blue-500 text-white"
            >
              {loading ? "Processando..." : "Ir para Pagamento"}
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;