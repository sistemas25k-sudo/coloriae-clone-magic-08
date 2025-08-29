export const ProductDescription = () => {
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8 uppercase">
          DESCRIÇÃO DO PRODUTO
        </h2>
        
        <div className="text-center space-y-2 mb-6 md:mb-8">
          <p className="text-base md:text-lg font-semibold">ATENÇÃO! Comprando hoje,</p>
          <p className="text-sm md:text-lg">você recebe as canetinhas de presente, kit com 12 canetas! Aproveite!</p>
        </div>

        <div className="flex justify-center">
          <img
            src="https://king-assets.yampi.me/dooki/689cfcaf20171/689cfcaf201aa.jpg"
            alt="Transforme o pijama em arte"
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};