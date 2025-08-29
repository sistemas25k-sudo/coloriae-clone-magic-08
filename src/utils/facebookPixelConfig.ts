// Configurações centralizadas do Facebook Pixel
export const FACEBOOK_PIXEL_CONFIG = {
  PIXEL_ID: '1165399562134853',
  
  // Content IDs para diferentes produtos
  CONTENT_IDS: {
    PIJAMA_12ANOS: 'coloriae_pijama_12anos',
    LIVRO_INFANTIL: 'coloriae_livro_infantil',
    COMBO_PIJAMA_CANETINHAS: 'coloriae_combo_pijama_canetinhas'
  },
  
  // Categorias de produtos
  CATEGORIES: {
    PIJAMAS: 'Pijamas Infantis',
    LIVROS: 'Livros Infantis',
    COMBOS: 'Combos Educativos'
  },
  
  // Valores padrão
  DEFAULT_VALUES: {
    CURRENCY: 'BRL',
    PIJAMA_PRICE: 167.00,
    COMBO_PRICE: 43.00
  },
  
  // Eventos customizados específicos do negócio
  CUSTOM_EVENTS: {
    // Engajamento na página
    PAGE_ENGAGEMENT: 'page_engagement',
    VIDEO_VIEW: 'video_view',
    SCROLL_DEPTH: 'scroll_depth',
    TIME_ON_PAGE: 'time_on_page',
    
    // Interações com produto
    SIZE_SELECTED: 'size_selected',
    QUANTITY_CHANGED: 'quantity_changed',
    PRODUCT_ZOOM: 'product_zoom',
    GALLERY_VIEW: 'gallery_view',
    
    // Navegação e UI
    MENU_INTERACTION: 'menu_interaction',
    MOBILE_BUY_CLICKED: 'mobile_buy_clicked',
    BUY_BUTTON_CLICKED: 'buy_button_clicked',
    
    // Formulários e checkout
    STEP_COMPLETED: 'step_completed',
    FORM_FIELD_FOCUSED: 'form_field_focused',
    EMAIL_SUGGESTION_USED: 'email_suggestion_used',
    CEP_CALCULATED: 'cep_calculated',
    
    // Pagamento
    PIX_GENERATED: 'pix_generated',
    PIX_CODE_COPIED: 'pix_code_copied',
    QR_CODE_SCANNED: 'qr_code_scanned',
    PAYMENT_METHOD_SELECTED: 'payment_method_selected',
    
    // Conversão e remarketing
    PURCHASE_COMPLETED: 'purchase_completed',
    ORDER_CONFIRMED: 'order_confirmed',
    REMARKETING_AUDIENCE: 'remarketing_audience',
    
    // UTM e campanhas
    CAMPAIGN_INTERACTION: 'campaign_interaction',
    AD_CLICK: 'ad_click',
    REFERRAL_VISIT: 'referral_visit'
  },
  
  // Audiências para remarketing
  REMARKETING_AUDIENCES: {
    CART_ABANDONERS: 'cart_abandoners',
    CHECKOUT_ABANDONERS: 'checkout_abandoners',
    PRODUCT_VIEWERS: 'product_viewers',
    ENGAGED_VISITORS: 'engaged_visitors',
    PAST_PURCHASERS: 'past_purchasers'
  },
  
  // Configurações de timing
  TIMERS: {
    ENGAGEMENT_THRESHOLD: 10000, // 10 segundos
    SCROLL_THRESHOLD: 50, // 50% da página
    VIDEO_VIEW_THRESHOLD: 3000 // 3 segundos
  }
};

// Função helper para criar dados padrão de produto
export const createProductData = (overrides: any = {}) => ({
  content_ids: [FACEBOOK_PIXEL_CONFIG.CONTENT_IDS.COMBO_PIJAMA_CANETINHAS],
  content_name: 'COLORIAÊ - Livro Infantil para Melhor Sono',
  content_category: FACEBOOK_PIXEL_CONFIG.CATEGORIES.LIVROS,
  content_type: 'product',
  value: FACEBOOK_PIXEL_CONFIG.DEFAULT_VALUES.COMBO_PRICE,
  currency: FACEBOOK_PIXEL_CONFIG.DEFAULT_VALUES.CURRENCY,
  num_items: 1,
  ...overrides
});

// Função helper para criar dados de compra
export const createPurchaseData = (overrides: any = {}) => ({
  value: FACEBOOK_PIXEL_CONFIG.DEFAULT_VALUES.COMBO_PRICE,
  currency: FACEBOOK_PIXEL_CONFIG.DEFAULT_VALUES.CURRENCY,
  content_ids: [FACEBOOK_PIXEL_CONFIG.CONTENT_IDS.COMBO_PIJAMA_CANETINHAS],
  content_name: 'COLORIAÊ - Livro Infantil para Melhor Sono',
  content_type: 'product',
  num_items: 1,
  order_id: `order_${Date.now()}`,
  delivery_category: 'home_delivery',
  ...overrides
});

// Função para extrair UTM parameters
export const getUTMParameters = () => {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
    utm_term: urlParams.get('utm_term'),
    utm_content: urlParams.get('utm_content'),
    fbclid: urlParams.get('fbclid'),
    gclid: urlParams.get('gclid')
  };
};

// Função para detectar dispositivo
export const getDeviceInfo = () => {
  if (typeof window === 'undefined') return {};
  
  return {
    device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
    screen_width: window.innerWidth,
    screen_height: window.innerHeight,
    user_agent: navigator.userAgent
  };
};