import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Carrinho from "./pages/Carrinho";
import Checkout from "./pages/Checkout";
import Pagamento from "./pages/Pagamento";
import PixGerado from "./pages/PixGerado";
import PagamentoConfirmado from "./pages/PagamentoConfirmado";
import ElonInstall from "./pages/ElonInstall";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pagamento" element={<Pagamento />} />
          <Route path="/pixgerado" element={<PixGerado />} />
          <Route path="/pagamento-confirmado" element={<PagamentoConfirmado />} />
          <Route path="/eloninstall" element={<ElonInstall />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
