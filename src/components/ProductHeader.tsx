import { Search, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const ProductHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center flex-1">
            <img 
              src="https://images.yampi.me/assets/stores/coloriae/uploads/logo/686de9475b6c9.png" 
              alt="Coloriaê" 
              className="h-10"
            />
          </div>
          
          <Button variant="ghost" className="relative text-gray-600 hover:bg-gray-100">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-coloriae-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};