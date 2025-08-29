import { useState } from "react";

const productImages = [
  "https://images.yampi.io/unsafe/fit-in/1000x1000/filters:background_color(white):upscale()/https://images.yampi.me/assets/stores/coloriae/uploads/images/pijama-coloriae-12-canetinhas-coloridas-que-saem-na-lavagem-2-anos-689cfbe065e80-large.jpg",
  "https://images.yampi.io/unsafe/fit-in/1000x1000/filters:background_color(white):upscale()/https://images.yampi.me/assets/stores/coloriae/uploads/images/pijama-coloriae-12-canetinhas-coloridas-que-saem-na-lavagem-2-anos-689cfbe10851b-large.jpg",
  "https://images.yampi.io/unsafe/fit-in/600x600/filters:background_color(white):upscale()/https://images.yampi.me/assets/stores/coloriae/uploads/images/pijama-coloriae-12-canetinhas-coloridas-que-saem-na-lavagem-2-anos-689cfbe144ebb-large.jpg",
  "https://images.yampi.io/unsafe/fit-in/1000x1000/filters:background_color(white):upscale()/https://images.yampi.me/assets/stores/coloriae/uploads/images/pijama-coloriae-12-canetinhas-coloridas-que-saem-na-lavagem-2-anos-689cfbe14966b-large.png",
  "https://images.yampi.io/unsafe/fit-in/1000x1000/filters:background_color(white):upscale()/https://images.yampi.me/assets/stores/coloriae/uploads/images/pijama-coloriae-12-canetinhas-coloridas-que-saem-na-lavagem-2-anos-689cfbe137598-large.jpg"
];

export const ProductGallery = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Mobile: Indicators */}
      <div className="flex justify-center gap-2 order-2 md:hidden">
        {productImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              selectedImage === index ? 'bg-coloriae-primary' : 'bg-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-gray-500 bg-gray-800 text-white px-2 py-1 rounded absolute top-4 right-4">
          {selectedImage + 1}/5
        </span>
      </div>

      {/* Desktop: Thumbnails */}
      <div className="hidden md:flex flex-col gap-2">
        {productImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-16 h-16 border-2 rounded overflow-hidden ${
              selectedImage === index ? 'border-coloriae-primary' : 'border-gray-200'
            }`}
          >
            <img
              src={image}
              alt={`Product view ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
      
      {/* Main Image */}
      <div className="flex-1 max-w-md mx-auto md:mx-0 order-1">
        <div className="aspect-square border rounded-lg overflow-hidden bg-white relative">
          <img
            src={productImages[selectedImage]}
            alt="Product main view"
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-2 py-1 rounded md:hidden">
            Clique para zoom
          </div>
        </div>
      </div>
    </div>
  );
};