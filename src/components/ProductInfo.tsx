import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useFacebookPixel from "@/hooks/useFacebookPixel";

const sizes = ["2 ANOS", "4 ANOS", "6 ANOS", "8 ANOS", "10 ANOS", "12 ANOS"];

export const ProductInfo = () => {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { trackAddToCart, trackEngagement } = useFacebookPixel();

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full">
          FRETE GRÁTIS
        </span>
        <span className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
          SENSAÇÃO DO MOMENTO
        </span>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-2">Disponibilidade: Imediata</p>
        <h1 style={{
          color: 'var(--section-title-color)',
          fontFamily: 'var(--fonts-titles-family)',
          fontSize: 'var(--font-30)',
          fontWeight: 'var(--fonts-titles-weight)',
          lineHeight: '33px',
          textTransform: 'uppercase'
        }} className="leading-tight text-xl md:text-2xl">
          PIJAMA COLORIAÊ + 12 CANETINHAS QUE SAEM NA LAVAGEM (DE PRESENTE HOJE!!)
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <span key={i}>★</span>
          ))}
        </div>
        <span className="text-sm text-gray-600">(252 avaliações)</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 line-through">R$ 300,00</span>
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">-44%</span>
        </div>
        <div className="text-3xl font-bold text-coloriae-price">R$ 167,00</div>
        <p className="text-sm text-blue-600 underline cursor-pointer">Ver opções de parcelamento</p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-900 mb-3">Selecione uma opção</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase">TAMANHO</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => {
                setSelectedSize(size);
                // Track engagement com seleção de tamanho
                trackEngagement('size_selected', {
                  size_selected: size,
                  product_name: 'Pijama Coloriaê'
                });
              }}
              className={`px-3 py-3 text-sm border rounded-lg transition-colors ${
                selectedSize === size
                  ? 'border-coloriae-primary bg-coloriae-primary/10 text-coloriae-primary font-medium'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div id="product-buy-section" className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex items-center border border-gray-300 rounded-lg w-fit">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="p-3 hover:bg-gray-100 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-3 min-w-[3rem] text-center font-medium">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="p-3 hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <Button 
          onClick={() => {
            // Track AddToCart antes de navegar
            trackAddToCart({
              content_ids: ['coloriae_pijama_12anos'],
              content_name: 'Pijama Coloriaê + 12 Canetinhas',
              content_category: 'Pijamas Infantis',
              value: 167.00,
              currency: 'BRL',
              num_items: quantity
            });
            
            // Track engagement
            trackEngagement('buy_button_clicked', {
              selected_size: selectedSize,
              quantity: quantity,
              product_value: 167.00
            });
            
            navigate('/checkout');
          }}
          className="flex-1 bg-coloriae-button hover:bg-coloriae-dark-blue text-white py-4 rounded-lg text-base font-medium transition-colors"
          size="lg"
        >
          Comprar
        </Button>
      </div>
    </div>
  );
};