import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductHeader } from "@/components/ProductHeader";
import { Footer } from "@/components/Footer";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useFacebookPixel from "@/hooks/useFacebookPixel";

interface CEPData {
  viacep: {
    localidade: string;
    uf: string;
  };
}

const Carrinho = () => {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState<CEPData | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const { trackPageView, trackAddToCart, trackEngagement } = useFacebookPixel();

  useEffect(() => {
    // Track page view
    trackPageView(window.location.href);
    
    // Track AddToCart event
    trackAddToCart({
      content_ids: ['coloriae_pijama_12anos'],
      content_name: 'Pijama Coloriaê + 12 Canetinhas',
      content_category: 'Pijamas Infantis',
      value: 167.00,
      currency: 'BRL',
      num_items: quantity
    });
  }, [quantity]);

  const productPrice = 167.00;
  const totalPrice = productPrice * quantity;

  const handleCEPConsult = async () => {
    if (!cep.replace(/\D/g, '')) {
      toast({
        title: "CEP inválido",
        description: "Por favor, digite um CEP válido",
        variant: "destructive",
      });
      return;
    }

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
      
      setLocationData({
        viacep: {
          localidade: data.localidade,
          uf: data.uf
        }
      });
      
      // Track engagement com CEP
      trackEngagement('cep_calculated', {
        location: `${data.localidade} - ${data.uf}`,
        cep: cleanCep
      });
      
      toast({
        title: "CEP encontrado!",
        description: "Frete grátis para sua região",
      });
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

  const handleCheckout = () => {
    if (!locationData) {
      toast({
        title: "Consulte o CEP",
        description: "Por favor, consulte seu CEP antes de finalizar a compra",
        variant: "destructive",
      });
      return;
    }
    
    // Aqui será implementado o sistema de pagamento
    toast({
      title: "Redirecionando para pagamento...",
      description: "Aguarde um momento",
    });
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
        <h1 className="text-xl font-semibold text-gray-800 mb-6">Carrinho de compras</h1>
        
        {/* Produto */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex gap-4">
            <img 
              src="https://images.yampi.me/assets/stores/coloriae/uploads/images/6873b7c50fbcc.jpg" 
              alt="Pijama Coloriaê" 
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 mb-1">
                Pijama Coloriaê + 12 Canetinhas que Saem na Lavagem (De Presente Hoje!!)
              </h3>
              <p className="text-sm text-gray-600 mb-2">12 ANOS</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">R$ {productPrice.toFixed(2).replace('.', ',')}</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{quantity}</span>
                  <Button variant="ghost" size="sm" className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm space-y-3">
          <div className="flex justify-between">
            <span>Produtos</span>
            <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Frete</span>
            <div className="flex items-center gap-2">
              <Input
                placeholder="CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="w-24 h-8 text-sm"
                maxLength={9}
              />
              <Button 
                onClick={handleCEPConsult}
                disabled={loading}
                size="sm"
                className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-1 h-8"
              >
                {loading ? "..." : "Calcular"}
              </Button>
            </div>
          </div>

          {locationData && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded space-y-1">
              <div className="font-semibold">📍 FRETE GRÁTIS PARA SUA REGIÃO</div>
              <div className="text-xs text-green-700">ENTREGA EM 4 A 8 DIAS ÚTEIS</div>
              <div className="text-xs">{locationData.viacep.localidade} - {locationData.viacep.uf}</div>
            </div>
          )}
          
          <hr />
          
          <div className="flex justify-between font-bold text-lg text-blue-600">
            <span>Total</span>
            <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        {/* Botões */}
        <div className="space-y-3">
          <Button 
            onClick={() => window.location.href = '/checkout'}
            className="w-full bg-blue-400 hover:bg-blue-500 text-white"
          >
            Finalizar compra
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Carrinho;