export const Footer = () => {
  return <footer style={{
    backgroundColor: '#9DD1F3'
  }} className="py-8 md:py-12 bg-sky-400">
      <div className="container mx-auto px-4">
        {/* Mobile: Collapsible sections */}
        <div className="block md:hidden space-y-4">
          <div className="text-center mb-6">
            <img src="https://images.yampi.me/assets/stores/coloriae/uploads/logo/686de9475b6c9.png" alt="Coloriaê" className="h-10 mx-auto mb-3" />
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
              Coloriaê é uma marca de pijamas infantis criativos que divertem e estimulam a 
              imaginação das crianças. Aqui, brincar e colorir fazem parte da hora de dormir!
            </p>
          </div>

          <details className="bg-white/20 rounded-lg">
            <summary className="p-4 font-semibold text-gray-700 cursor-pointer">
              Informações ▼
            </summary>
            <div className="px-4 pb-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-800 transition-colors">Dúvidas Frequentes</a></li>
                <li><a href="#" className="hover:text-gray-800 transition-colors">Entrega Segura</a></li>
                <li><a href="#" className="hover:text-gray-800 transition-colors">Políticas de Reembolso</a></li>
                <li><a href="#" className="hover:text-gray-800 transition-colors">Prazo de Entrega</a></li>
              </ul>
            </div>
          </details>

          <details className="bg-white/20 rounded-lg">
            <summary className="p-4 font-semibold text-gray-700 cursor-pointer">
              Atendimento ▼
            </summary>
            <div className="px-4 pb-4 space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <span className="text-green-600">📱</span> 71 999236841
              </p>
              <p className="flex items-center gap-2">
                <span className="text-blue-600">✉️</span> sac@coloriae.com
              </p>
            </div>
          </details>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img src="https://images.yampi.me/assets/stores/coloriae/uploads/logo/686de9475b6c9.png" alt="Coloriaê" className="h-12 mb-4" />
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
              Coloriaê é uma marca de pijamas infantis criativos que divertem e estimulam a 
              imaginação das crianças. Aqui, brincar e colorir fazem parte da hora de dormir!
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-gray-700">Informações</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-800 transition-colors">Dúvidas Frequentes</a></li>
              <li><a href="#" className="hover:text-gray-800 transition-colors">Entrega Segura</a></li>
              <li><a href="#" className="hover:text-gray-800 transition-colors">Políticas de Reembolso</a></li>
              <li><a href="#" className="hover:text-gray-800 transition-colors">Prazo de Entrega</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-gray-700">Atendimento</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <span className="text-green-600">📱</span> 71 999236841
              </p>
              <p className="flex items-center gap-2">
                <span className="text-blue-600">✉️</span> sac@coloriae.com
              </p>
            </div>
          </div>
        </div>

        {/* Security section */}
        <div className="mt-6 md:mt-8 pt-6 border-t border-blue-200/50">
          <div className="flex justify-center mb-4">
            <img src="https://cdn.yampi.io/rocket/img/global/icons/security-label.svg" alt="Loja Protegida - Compra 100% Segura" className="h-16 md:h-20" />
          </div>

          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>Rua Fernando Menezes de Goes 397 - Pituba - Salvador</p>
            <p>© 2025 VISÃO ONLINE CNPJ: 40.211.130/0001-98</p>
          </div>
        </div>
      </div>
    </footer>;
};