import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductHeader } from "@/components/ProductHeader";
import { Footer } from "@/components/Footer";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PixGerado = () => {
  const [timeLeft, setTimeLeft] = useState(29 * 60 + 44); // 29:44 em segundos
  const { toast } = useToast();

  const pixCode = "00020126580014BR.GOV.BCB.PIX013636c77f9a-5a2a-4a5a-ba5a-9b7f8c7f6d5e5204000053039865802BR5925COLORIAE COMERCIO LTDA6009SAO PAULO610801310-1006221051212345678901234567890123456789016304";

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pixCode);
    toast({
      title: "Código copiado!",
      description: "O código PIX foi copiado para a área de transferência",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white rounded-lg p-6 shadow-sm text-center">
          <h1 className="text-xl font-semibold text-gray-800 mb-4">Quase lá...</h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              Pague seu Pix dentro de <span className="font-bold text-red-500">{formatTime(timeLeft)}</span>
            </p>
            <p className="text-gray-600">para garantir sua compra.</p>
          </div>

          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg mb-6 flex items-center justify-center gap-2">
            <span className="text-sm">Aguardando pagamento</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Valor do Pix:</p>
            <p className="text-2xl font-bold text-blue-500">R$ 167,00</p>
          </div>

          <Button
            onClick={handleCopyCode}
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

        <div className="mt-6 text-center text-xs text-gray-500 space-y-1">
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
};

export default PixGerado;