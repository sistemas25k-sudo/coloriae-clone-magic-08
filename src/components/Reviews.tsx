import { useState } from "react";

export const Reviews = () => {
  const [activeTab, setActiveTab] = useState("avaliacoes");
  
  const reviews = [
    {
      name: "Camila",
      text: "Chegou muito bem embaladinho aqui, super legal. Recomendo a todos!",
      image: "https://cdn.yampi.io/rocket/uploads/reviews/coloriae/688046933ef8d.png"
    },
    {
      name: "Adriana", 
      text: "Muito legal. Meus filhos amaram! Só querem isso a noite agora kakaka bom que largaram um pouco o celular. Recomendo demais!",
      image: "https://cdn.yampi.io/rocket/uploads/reviews/coloriae/687fea305e1ec.png"
    },
    {
      name: "Mel",
      text: "Loja me encantou muito, ótimo preço e produto."
    },
    {
      name: "Bete",
      text: "Supriu todas as minhas expectativas sem contar da baita promoção que peguei. Além de tudo, veio super bem embalada. Um total de zero defeitos!!!"
    }
  ];

  return (
    <section className="py-8 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Company Info - Hidden on mobile to match design */}
        <div className="hidden md:block text-center mb-8">
          <p className="text-gray-600 mb-2">Coloriaê é uma marca registrada no Brasil,</p>
          <p className="text-gray-600 mb-2">nosso único canal de vendas é através do</p>
          <p className="text-gray-600 mb-6">nosso site <span className="font-semibold">(www.coloriae.com)</span></p>
          
          <div className="space-y-2 mb-6">
            <p className="font-bold text-lg">COMPRA SEGURA!</p>
            <p className="text-gray-600">Somos EMPRESA, temos CNPJ</p>
            <p className="text-gray-600 text-sm">GTM EMPREENDIMENTOS ONLINE LTDA</p>
            <p className="text-gray-600 text-sm">CNPJ: 40.211.130.0001/98</p>
          </div>

          <div className="space-y-2 mb-8">
            <p className="font-bold text-lg">CUIDADO COM GOLPES!</p>
            <p className="text-gray-600">Coloriaê é uma marca registrada no Brasil (INPI-TM)</p>
          </div>
        </div>

        {/* Tabs - Mobile responsive */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("avaliacoes")}
            className={`flex-1 md:flex-none md:px-6 py-3 text-sm md:text-base font-medium border-b-2 transition-colors ${
              activeTab === "avaliacoes"
                ? "border-gray-800 text-gray-800"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            AVALIAÇÕES (252)
          </button>
          <button
            onClick={() => setActiveTab("duvidas")}
            className={`flex-1 md:flex-none md:px-6 py-3 text-sm md:text-base font-medium border-b-2 transition-colors ${
              activeTab === "duvidas"
                ? "border-gray-800 text-gray-800"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            DÚVIDAS (0)
          </button>
        </div>

        {activeTab === "avaliacoes" && (
          <>
            {/* Rating Summary */}
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8 mb-8">
              <div className="text-center mx-auto md:mx-0">
                <div className="text-4xl md:text-5xl font-bold mb-2">5.0</div>
                <div className="flex text-yellow-400 text-xl mb-2 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm">baseada em 252 avaliações</p>
              </div>

              <div className="flex-1 space-y-2 w-full">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-sm w-3">{stars}</span>
                    <span className="text-yellow-400">★</span>
                    <div className="flex-1 bg-gray-200 h-2 rounded">
                      <div 
                        className={`h-full bg-gray-800 rounded ${stars === 5 ? 'w-full' : 'w-0'}`}
                      />
                    </div>
                    <span className="text-sm w-8">{stars === 5 ? '252' : '0'}</span>
                  </div>
                ))}
              </div>

              <div className="hidden md:block text-right text-sm text-gray-600">
                <p className="mb-2">ORDENAR POR:</p>
                <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                  <option>Mais Recentes</option>
                </select>
              </div>
            </div>

            {/* Mobile sort dropdown */}
            <div className="md:hidden mb-6">
              <label className="block text-sm text-gray-600 mb-2">ORDENAR POR:</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                <option>Mais Recentes</option>
              </select>
            </div>

            {/* Reviews */}
            <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
              {reviews.map((review, index) => (
                <div key={index} className="bg-white p-4 md:p-6 rounded-lg border">
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <h4 className="font-semibold mb-2">{review.name}</h4>
                  <p className="text-gray-700 mb-4 text-sm md:text-base">{review.text}</p>
                  {review.image && (
                    <img
                      src={review.image}
                      alt="Review image"
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-6 md:mt-8">
              <button className="border border-gray-300 px-4 md:px-6 py-2 rounded-md hover:bg-gray-50 text-sm md:text-base">
                + Ver mais avaliações
              </button>
            </div>
          </>
        )}

        {activeTab === "duvidas" && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhuma dúvida foi encontrada.</p>
          </div>
        )}
      </div>
    </section>
  );
};