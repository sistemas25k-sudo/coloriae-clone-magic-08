import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useScrollVisibility } from "@/hooks/useScrollVisibility";
import useFacebookPixel from "@/hooks/useFacebookPixel";

export const MobileFloatingBuy = () => {
  const navigate = useNavigate();
  const isVisible = useScrollVisibility('product-buy-section');
  const { trackAddToCart, trackEngagement } = useFacebookPixel();

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 md:hidden shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-gray-500 line-through">R$ 300,00</span>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">-44%</span>
          </div>
          <div className="text-xl font-bold text-coloriae-price">R$ 167,00</div>
          <div className="text-xs text-gray-500">12x de R$ 20,58</div>
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
              num_items: 1
            });
            
            // Track engagement mobile
            trackEngagement('mobile_buy_clicked', {
              device_type: 'mobile',
              product_value: 167.00,
              button_location: 'floating_bottom'
            });
            
            navigate('/carrinho');
          }}
          className="bg-coloriae-button hover:bg-coloriae-dark-blue text-white px-8 py-3 text-base font-medium transition-colors"
        >
          COMPRAR
        </Button>
      </div>
    </div>
  );
};