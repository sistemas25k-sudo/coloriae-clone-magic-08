import { useEffect } from 'react';

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export interface FBPixelEvent {
  event: string;
  parameters?: Record<string, any>;
  customData?: Record<string, any>;
}

export interface ProductData {
  content_ids: string[];
  content_name?: string;
  content_category?: string;
  content_type?: string;
  value?: number;
  currency?: string;
  num_items?: number;
}

export interface PurchaseData {
  value: number;
  currency: string;
  content_ids: string[];
  content_name?: string;
  content_type?: string;
  num_items?: number;
  order_id?: string;
  delivery_category?: string;
}

const FACEBOOK_PIXEL_ID = '1165399562134853';

export const useFacebookPixel = () => {
  useEffect(() => {
    // Instalar o Facebook Pixel
    if (typeof window !== 'undefined' && !window.fbq) {
      // Função fbq base
      window.fbq = function() {
        if (window.fbq.callMethod) {
          window.fbq.callMethod.apply(window.fbq, arguments);
        } else {
          window.fbq.queue.push(arguments);
        }
      };
      
      if (!window._fbq) window._fbq = window.fbq;
      window.fbq.push = window.fbq;
      window.fbq.loaded = true;
      window.fbq.version = '2.0';
      window.fbq.queue = [];
      
      // Carregar script do Facebook Pixel
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);
      
      // Inicializar pixel
      window.fbq('init', FACEBOOK_PIXEL_ID);
      
      // Adicionar noscript fallback
      const noscript = document.createElement('noscript');
      const img = document.createElement('img');
      img.height = 1;
      img.width = 1;
      img.style.display = 'none';
      img.src = `https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`;
      noscript.appendChild(img);
      document.head.appendChild(noscript);
    }
  }, []);

  // Função para disparar eventos
  const trackEvent = (eventName: string, parameters?: Record<string, any>, customData?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      if (parameters || customData) {
        const eventData = { ...parameters };
        if (customData) {
          eventData.custom_data = customData;
        }
        window.fbq('track', eventName, eventData);
      } else {
        window.fbq('track', eventName);
      }
      
      console.log(`FB Pixel Event: ${eventName}`, parameters, customData);
    }
  };

  // Eventos padrão do Facebook
  const trackPageView = (pageUrl?: string) => {
    trackEvent('PageView', pageUrl ? { page_url: pageUrl } : undefined);
  };

  const trackViewContent = (data: ProductData) => {
    trackEvent('ViewContent', {
      content_ids: data.content_ids,
      content_name: data.content_name || 'COLORIAÊ - Livro Infantil',
      content_category: data.content_category || 'Livros Infantis',
      content_type: data.content_type || 'product',
      value: data.value || 43.00,
      currency: data.currency || 'BRL',
      num_items: data.num_items || 1
    });
  };

  const trackAddToCart = (data: ProductData) => {
    trackEvent('AddToCart', {
      content_ids: data.content_ids,
      content_name: data.content_name || 'COLORIAÊ - Livro Infantil',
      content_category: data.content_category || 'Livros Infantis',
      content_type: data.content_type || 'product',
      value: data.value || 43.00,
      currency: data.currency || 'BRL',
      num_items: data.num_items || 1
    });
  };

  const trackInitiateCheckout = (data: ProductData) => {
    trackEvent('InitiateCheckout', {
      content_ids: data.content_ids,
      content_name: data.content_name || 'COLORIAÊ - Livro Infantil',
      content_category: data.content_category || 'Livros Infantis',
      content_type: data.content_type || 'product',
      value: data.value || 43.00,
      currency: data.currency || 'BRL',
      num_items: data.num_items || 1
    });
  };

  const trackAddPaymentInfo = (data: ProductData) => {
    trackEvent('AddPaymentInfo', {
      content_ids: data.content_ids,
      content_name: data.content_name || 'COLORIAÊ - Livro Infantil',
      content_category: data.content_category || 'Livros Infantis',
      content_type: data.content_type || 'product',
      value: data.value || 43.00,
      currency: data.currency || 'BRL',
      num_items: data.num_items || 1
    });
  };

  const trackPurchase = (data: PurchaseData) => {
    trackEvent('Purchase', {
      value: data.value,
      currency: data.currency || 'BRL',
      content_ids: data.content_ids,
      content_name: data.content_name || 'COLORIAÊ - Livro Infantil',
      content_type: data.content_type || 'product',
      num_items: data.num_items || 1,
      order_id: data.order_id,
      delivery_category: data.delivery_category || 'home_delivery'
    });
  };

  // Eventos customizados específicos do negócio
  const trackLeadGeneration = (data?: Record<string, any>) => {
    trackEvent('Lead', {
      content_name: 'COLORIAÊ - Lead Generation',
      value: 43.00,
      currency: 'BRL',
      ...data
    });
  };

  const trackCompleteRegistration = (method: string = 'email') => {
    trackEvent('CompleteRegistration', {
      registration_method: method,
      content_name: 'COLORIAÊ - Registration'
    });
  };

  const trackContact = (method: string = 'form') => {
    trackEvent('Contact', {
      contact_method: method,
      content_name: 'COLORIAÊ - Contact'
    });
  };

  const trackSchedule = (content?: string) => {
    trackEvent('Schedule', {
      content_name: content || 'COLORIAÊ - Schedule',
      value: 43.00,
      currency: 'BRL'
    });
  };

  const trackSearch = (searchTerm: string) => {
    trackEvent('Search', {
      search_string: searchTerm,
      content_category: 'Livros Infantis'
    });
  };

  const trackSubscribe = (value?: number) => {
    trackEvent('Subscribe', {
      value: value || 43.00,
      currency: 'BRL',
      predicted_ltv: (value || 43.00) * 2
    });
  };

  const trackStartTrial = () => {
    trackEvent('StartTrial', {
      content_name: 'COLORIAÊ - Trial',
      value: 43.00,
      currency: 'BRL'
    });
  };

  // Eventos de engajamento
  const trackEngagement = (action: string, details?: Record<string, any>) => {
    trackEvent('CustomizeProduct', {
      action,
      content_name: 'COLORIAÊ - Engagement',
      ...details
    });
  };

  const trackVideoView = (videoName: string, progress: number) => {
    if (progress >= 25) {
      trackEvent('ViewContent', {
        content_type: 'video',
        content_name: videoName,
        video_progress: progress
      });
    }
  };

  const trackDownload = (fileName: string) => {
    trackEvent('ViewContent', {
      content_type: 'download',
      content_name: fileName
    });
  };

  // Eventos de remarketing
  const trackRemarketingAudience = (audienceType: string, data?: Record<string, any>) => {
    trackEvent('ViewContent', {
      content_type: 'remarketing',
      content_name: `COLORIAÊ - ${audienceType}`,
      custom_audience: audienceType,
      ...data
    });
  };

  // UTM e parâmetros de campanha
  const trackCampaignInteraction = (source: string, medium: string, campaign: string) => {
    trackEvent('ViewContent', {
      content_type: 'campaign',
      utm_source: source,
      utm_medium: medium,
      utm_campaign: campaign,
      content_name: 'COLORIAÊ - Campaign Interaction'
    }, {
      utm_source: source,
      utm_medium: medium,
      utm_campaign: campaign
    });
  };

  return {
    trackPageView,
    trackViewContent,
    trackAddToCart,
    trackInitiateCheckout,
    trackAddPaymentInfo,
    trackPurchase,
    trackLeadGeneration,
    trackCompleteRegistration,
    trackContact,
    trackSchedule,
    trackSearch,
    trackSubscribe,
    trackStartTrial,
    trackEngagement,
    trackVideoView,
    trackDownload,
    trackRemarketingAudience,
    trackCampaignInteraction,
    trackEvent
  };
};

export default useFacebookPixel;