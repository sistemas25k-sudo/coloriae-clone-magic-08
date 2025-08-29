import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductHeader } from "@/components/ProductHeader";
import { Footer } from "@/components/Footer";
import { Copy, Loader2, Smartphone, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import QRCode from "qrcode";
import useFacebookPixel from "@/hooks/useFacebookPixel";
import { supabase } from "@/lib/supabase";

interface ApiResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    id: number;
    status: string;
    amount: number;
    customer: {
      name: string;
      email: string;
      phone: string;
      document: {
        number: string;
        type: string;
      };
    };
    pix: {
      qrcode: string;
      expirationDate: string;
    };
  };
}

const Pagamento = () => {
  const [loading, setLoading] = useState(true);
  const [pixData, setPixData] = useState<ApiResponse | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { trackPageView, trackAddPaymentInfo, trackEngagement } = useFacebookPixel();

  useEffect(() => {
    // Track page view
    trackPageView(window.location.href);
    
    // Track AddPaymentInfo event
    trackAddPaymentInfo({
      content_ids: ['coloriae_pijama_12anos'],
      content_name: 'Pijama Coloriaê + 12 Canetinhas',
      content_category: 'Pijamas Infantis',
      value: 167.00,
      currency: 'BRL'
    });
  }, []);

  // Carregar dados do checkout e gerar PIX automaticamente
  useEffect(() => {
    const loadCheckoutData = async () => {
      let data = null;
      
      // Tentar pegar dados do state primeiro
      if (location.state) {
        data = location.state;
      } else {
        // Se não tiver no state, pegar do sessionStorage
        const savedData = sessionStorage.getItem('confirmationData');
        if (savedData) {
          data = JSON.parse(savedData);
        }
      }

      if (!data) {
        // Se não tiver dados, redirecionar para checkout
        navigate('/checkout');
        return;
      }

      setCheckoutData(data);
      
      // Gerar PIX automaticamente com os dados do checkout
      try {
        const cpf = data.cpf.replace(/\D/g, '');
        const customerName = data.nome || 'Usuário Desconhecido';

        // Chamar edge function para criar pagamento PIX
        const { data: paymentData, error } = await supabase.functions.invoke('create-pix-payment', {
          body: {
            customerData: {
              nome: customerName,
              cpf: data.cpf,
              celular: data.celular,
              email: data.email
            },
            total: data.total
          }
        });

        if (error) {
          throw new Error(error.message || 'Erro ao criar pagamento');
        }

        if (!paymentData.success) {
          throw new Error(paymentData.message || 'Erro ao processar pagamento');
        }

        const apiResponse: ApiResponse = paymentData;

        // Gerar QR Code
        const qrUrl = await QRCode.toDataURL(apiResponse.data.pix.qrcode);
        setQrCodeUrl(qrUrl);
        setPixData(apiResponse);

        // Track engagement - PIX gerado
        trackEngagement('pix_generated', {
          transaction_id: apiResponse.data.id,
          amount: apiResponse.data.amount / 100,
          customer_name: customerName
        });

      } catch (error) {
        console.error('Erro ao gerar PIX:', error);
        toast({
          title: "Erro",
          description: "Erro ao gerar PIX. Tente novamente.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [location.state, navigate, toast]);

  // Função para verificar status do pagamento
  const checkPaymentStatus = async (transactionId: number, cpf: string) => {
    try {
      const { data: statusData, error } = await supabase.functions.invoke('check-payment-status', {
        body: { transactionId }
      });

      if (error) {
        console.error('Erro ao verificar status:', error);
        return 'pending';
      }

      return statusData?.status || 'pending';
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      return 'pending';
    }
  };

  // Polling para verificar pagamento
  useEffect(() => {
    if (!pixData || !checkoutData) return;

    const interval = setInterval(async () => {
      setIsCheckingPayment(true);
      const status = await checkPaymentStatus(pixData.data.id, checkoutData.cpf.replace(/\D/g, ''));
      setIsCheckingPayment(false);

      if (status === 'paid') {
        // Salvar dados da transação
        sessionStorage.setItem('transactionData', JSON.stringify({
          transactionId: pixData.data.id,
          amount: pixData.data.amount / 100,
          customerName: pixData.data.customer.name,
          cpf: checkoutData.cpf,
          email: checkoutData.email
        }));

        toast({
          title: "Pagamento confirmado!",
          description: "Seu pagamento foi processado com sucesso.",
        });

        // Redirecionar para página de confirmação
        navigate('/pagamento-confirmado');
        clearInterval(interval);
      }
    }, 5000); // Verifica a cada 5 segundos

    // Limpar interval após 30 minutos
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 30 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pixData, checkoutData, navigate, toast]);

  const copiarCodigo = () => {
    if (pixData?.data.pix.qrcode) {
      navigator.clipboard.writeText(pixData.data.pix.qrcode);
      
      // Track engagement - código copiado
      trackEngagement('pix_code_copied', {
        transaction_id: pixData.data.id,
        amount: pixData.data.amount / 100
      });
      
      toast({
        title: "Código copiado!",
        description: "O código PIX foi copiado para a área de transferência",
      });
    }
  };

  // Mostrar loading enquanto gera o PIX
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProductHeader />
        
        <div className="container mx-auto px-4 py-8 max-w-md">
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Processando pagamento...</h2>
            <p className="text-gray-600">Gerando seu código PIX, aguarde um momento.</p>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (pixData && checkoutData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProductHeader />
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Coluna esquerda - Informações do pagamento */}
            <div className="bg-white rounded-lg p-6 shadow-sm text-center h-fit">
              <h1 className="text-xl font-semibold text-gray-800 mb-4">Quase lá...</h1>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-2">
                  Pague seu Pix dentro de <span className="font-bold text-red-500">29:44</span>
                </p>
                <p className="text-gray-600">para garantir sua compra.</p>
              </div>

              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg mb-6 flex items-center justify-center gap-2">
                <span className="text-sm">
                  {isCheckingPayment ? 'Verificando pagamento...' : 'Aguardando pagamento'}
                </span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                {isCheckingPayment && <CheckCircle className="w-4 h-4 animate-spin" />}
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Valor do Pix:</p>
                <p className="text-2xl font-bold text-blue-500">R$ {checkoutData.total.toFixed(2).replace('.', ',')}</p>
              </div>

              <Button
                onClick={copiarCodigo}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white mb-4 flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copiar código
              </Button>

              <div className="text-sm text-gray-600 mb-6">
                <p className="mb-2">Após copiar o código, abra seu</p>
                <p className="mb-2">aplicativo de pagamento onde</p>
                <p className="mb-4">você utiliza o Pix.</p>
                
                <div className="mb-4">
                  <p>Escolha a opção <span className="font-semibold text-blue-600">Pix Copia e Cola</span></p>
                  <p>e insira o código copiado</p>
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center mb-4">
                <p>Pix processado por</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="font-semibold">Appmax</span>
                </div>
              </div>
            </div>

            {/* Coluna direita - QR Code (Desktop) */}
            <div className="hidden lg:block bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="mb-6">
                <p className="text-gray-800 font-medium mb-2">Abra seu aplicativo de pagamento onde você</p>
                <p className="text-gray-800 font-medium mb-2">utiliza o Pix e escolha a opção <span className="text-blue-600 font-semibold">Ler QR Code</span></p>
              </div>

              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Smartphone className="w-5 h-5" />
                  <span className="text-sm">Aponte a câmera do seu celular</span>
                </div>
              </div>

              {qrCodeUrl && (
                <div className="mb-6 flex justify-center">
                  <img src={qrCodeUrl} alt="QR Code PIX" className="w-64 h-64 border rounded-lg" />
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Valor do Pix:</p>
                <p className="text-2xl font-bold text-blue-500">R$ {checkoutData.total.toFixed(2).replace('.', ',')}</p>
              </div>

              <div className="text-xs text-gray-500 text-center mb-4">
                <p>Pix processado por</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="font-semibold">Appmax</span>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                <p>Você também pode pagar escolhendo a opção</p>
                <p><span className="font-semibold text-blue-600">Pix Copia e Cola</span> no seu aplicativo de pagamento ou</p>
                <p>Internet Banking (banco online). Neste caso, copie o</p>
                <p>código clicando no botão abaixo:</p>
              </div>

              <Button
                onClick={copiarCodigo}
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copiar código
              </Button>
            </div>
          </div>

          {/* QR Code mobile */}
          <div className="lg:hidden mt-6 bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="mb-4">
              <p className="text-gray-800 font-medium mb-2">Ou use o QR Code:</p>
            </div>

            {qrCodeUrl && (
              <div className="mb-4 flex justify-center">
                <img src={qrCodeUrl} alt="QR Code PIX" className="w-48 h-48 border rounded-lg" />
              </div>
            )}

            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Smartphone className="w-5 h-5" />
                <span className="text-sm">Aponte a câmera do seu celular</span>
              </div>
            </div>
          </div>

          {/* Footer com informações da empresa */}
          <div className="mt-6 text-center text-xs text-gray-500 space-y-1 max-w-lg mx-auto">
            <p>COLORIAÊ TM - Menos telas na hora de dormir: coloriae.com</p>
            <p>Rua Fernando Menezes de Goes, 397 - Pituba - Salvador - BA</p>
            <p>© 2025 VISÃO ONLINE - CNPJ: 40.271.150/0001-98</p>
            
            <div className="flex items-center justify-center gap-1 mt-4 text-gray-600">
              <span className="text-xs">🔒</span>
              <span className="text-xs font-medium">PAGAMENTO</span>
            </div>
            <p className="text-xs">100% SEGURO</p>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Se não tiver dados, redirecionar
  return (
    <div className="min-h-screen bg-gray-50">
      <ProductHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white rounded-lg p-6 shadow-sm text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Redirecionando...</h2>
          <p className="text-gray-600">Você será redirecionado para o checkout.</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pagamento;