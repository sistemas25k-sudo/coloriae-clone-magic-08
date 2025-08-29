import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductHeader } from "@/components/ProductHeader";
import { Footer } from "@/components/Footer";
import { CheckCircle2, Package, MapPin, User, Calendar } from "lucide-react";
import useFacebookPixel from "@/hooks/useFacebookPixel";

interface ConfirmationData {
  nome: string;
  email: string;
  cpf: string;
  celular: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
  };
  produto: {
    nome: string;
    imagem: string;
    preco: number;
    quantidade: number;
    tamanho: string;
  };
  total: number;
}

const PagamentoConfirmado = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trackPageView, trackPurchase, trackEngagement } = useFacebookPixel();
  
  // Tentar pegar dados do state ou do sessionStorage
  let data = location.state as ConfirmationData;
  
  if (!data) {
    const storedData = sessionStorage.getItem('confirmationData');
    const transactionData = sessionStorage.getItem('transactionData');
    
    if (storedData) {
      data = JSON.parse(storedData);
      // Limpar dados após uso
      sessionStorage.removeItem('confirmationData');
    } else if (transactionData) {
      const txData = JSON.parse(transactionData);
      // Construir dados a partir da transação
      data = {
        nome: txData.customerName,
        email: txData.email,
        cpf: txData.cpf,
        celular: '',
        endereco: {
          cep: '',
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          localidade: '',
          uf: ''
        },
        produto: {
          nome: 'COLORIAÊ - Livro Infantil para Melhor Sono',
          imagem: 'https://images.yampi.me/assets/stores/coloriae/uploads/images/6873b7c50fbcc.jpg',
          preco: txData.amount,
          quantidade: 1,
          tamanho: ''
        },
        total: txData.amount
      };
      sessionStorage.removeItem('transactionData');
    }
  }

  // Se não há dados, usar dados de exemplo para visualização
  if (!data) {
    data = {
      nome: "Maria Silva",
      email: "maria@gmail.com",
      cpf: "123.456.789-00",
      celular: "(11) 99999-9999",
      endereco: {
        cep: "01234-567",
        logradouro: "Rua das Flores",
        numero: "123",
        complemento: "Apto 45",
        bairro: "Centro",
        localidade: "São Paulo",
        uf: "SP"
      },
      produto: {
        nome: 'Pijama Coloriaê + 12 Canetinhas que Saem na Lavagem (De Presente Hoje!!)',
        imagem: 'https://images.yampi.me/assets/stores/coloriae/uploads/images/pijama-coloriae-12-canetinhas-que-saem-na-lavagem-de-presente-hoje-12-anos-689d19ded223d-thumb.jpg',
        preco: 167.00,
        quantidade: 1,
        tamanho: '12 ANOS'
      },
      total: 167.00
    };
  }

  // Track Facebook Pixel events
  useEffect(() => {
    if (data) {
      // Track page view
      trackPageView(window.location.href);
      
      // Track Purchase event - O MAIS IMPORTANTE!
      trackPurchase({
        value: data.total,
        currency: 'BRL',
        content_ids: ['coloriae_livro_infantil', 'coloriae_pijama_12anos'],
        content_name: data.produto.nome,
        content_type: 'product',
        num_items: data.produto.quantidade,
        order_id: `order_${Date.now()}`,
        delivery_category: 'home_delivery'
      });

      // Track engagement - Conversão finalizada
      trackEngagement('purchase_completed', {
        customer_name: data.nome,
        order_value: data.total,
        product_name: data.produto.nome,
        city: data.endereco.localidade || 'Unknown'
      });
    }
  }, [data]);

  // Calcula data estimada de entrega (7 dias úteis)
  const getDeliveryDate = () => {
    const today = new Date();
    let deliveryDate = new Date(today);
    let daysAdded = 0;
    
    while (daysAdded < 7) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      // Se não for fim de semana, conta como dia útil
      if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
        daysAdded++;
      }
    }
    
    return deliveryDate.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrder = () => {
    // Aqui poderia redirecionar para uma página de acompanhamento do pedido
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header de Confirmação */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pagamento Confirmado!
          </h1>
          <p className="text-gray-600">
            Seu pedido foi processado com sucesso. Você receberá um e-mail de confirmação em breve.
          </p>
        </div>

        {/* Dados do Pedido */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">Resumo do Pedido</h2>
          </div>
          
          <div className="flex gap-4 mb-4">
            <img 
              src={data.produto.imagem}
              alt={data.produto.nome}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 mb-1">
                {data.produto.nome}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Tamanho: {data.produto.tamanho}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Quantidade: {data.produto.quantidade}
                </span>
                <span className="font-bold text-blue-600">
                  R$ {data.total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold text-blue-600">
              <span>Total Pago</span>
              <span>R$ {data.total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>

        {/* Dados Pessoais */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">Dados Pessoais</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Nome:</span>
              <span className="font-medium">{data.nome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">E-mail:</span>
              <span className="font-medium">{data.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">CPF:</span>
              <span className="font-medium">{data.cpf}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Celular:</span>
              <span className="font-medium">{data.celular}</span>
            </div>
          </div>
        </div>

        {/* Endereço de Entrega */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">Endereço de Entrega</h2>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium">
              {data.endereco.logradouro}, {data.endereco.numero}
              {data.endereco.complemento && ` - ${data.endereco.complemento}`}
            </p>
            <p className="text-gray-600">
              {data.endereco.bairro}
            </p>
            <p className="text-gray-600">
              {data.endereco.localidade} - {data.endereco.uf}
            </p>
            <p className="text-gray-600">
              CEP: {data.endereco.cep}
            </p>
          </div>
        </div>

        {/* Previsão de Entrega */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-semibold text-gray-900">Previsão de Entrega</h2>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 font-semibold">
              Entrega prevista para: {getDeliveryDate()}
            </p>
            <p className="text-green-600 text-sm mt-1">
              Frete grátis • 7 dias úteis
            </p>
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-3">
          <Button 
            onClick={handleViewOrder}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Acompanhar Pedido
          </Button>
          
          <Button 
            onClick={handleContinueShopping}
            variant="outline"
            className="w-full"
          >
            Continuar Comprando
          </Button>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-blue-50 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            📧 Próximos Passos
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Você receberá um e-mail de confirmação</li>
            <li>• Enviaremos o código de rastreamento quando o produto for despachado</li>
            <li>• Em caso de dúvidas, entre em contato conosco</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PagamentoConfirmado;