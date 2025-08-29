import { useEffect } from "react";
import { ProductHeader } from "@/components/ProductHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductInfo } from "@/components/ProductInfo";
import { ProductDescription } from "@/components/ProductDescription";
import { Reviews } from "@/components/Reviews";
import { Footer } from "@/components/Footer";
import { MobileFloatingBuy } from "@/components/MobileFloatingBuy";
import useFacebookPixel from "@/hooks/useFacebookPixel";

const Index = () => {
  const { trackPageView, trackViewContent, trackEngagement, trackCampaignInteraction } = useFacebookPixel();

  useEffect(() => {
    // Track page view
    trackPageView(window.location.href);
    
    // Track product view
    trackViewContent({
      content_ids: ['coloriae_livro_infantil'],
      content_name: 'COLORIAÊ - Livro Infantil para Melhor Sono',
      content_category: 'Livros Infantis',
      value: 43.00,
      currency: 'BRL'
    });

    // Track campaign interactions se houver UTM
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    
    if (utmSource && utmMedium && utmCampaign) {
      trackCampaignInteraction(utmSource, utmMedium, utmCampaign);
    }

    // Track engagement após 10 segundos na página
    const engagementTimer = setTimeout(() => {
      trackEngagement('page_engagement', {
        time_on_page: 10,
        page_type: 'landing'
      });
    }, 10000);

    return () => clearTimeout(engagementTimer);
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      <ProductHeader />
      <div className="hidden md:block">
        <Breadcrumb />
      </div>
      
      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          <ProductGallery />
          <ProductInfo />
        </div>
      </main>

      <ProductDescription />
      <Reviews />
      <Footer />
      <MobileFloatingBuy />
    </div>
  );
};

export default Index;
