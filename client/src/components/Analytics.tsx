import { useEffect } from 'react';
import { useLocation } from 'wouter';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function Analytics() {
  const [location] = useLocation();

  // Google Analytics tracking
  useEffect(() => {
    const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
    
    if (!GA_MEASUREMENT_ID) {
      console.log('Google Analytics: ID não configurado. Adicione VITE_GA_MEASUREMENT_ID nas variáveis de ambiente.');
      return;
    }

    // Load Google Analytics script
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(gaScript);

    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer?.push(args);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      page_path: location,
    });

    return () => {
      document.head.removeChild(gaScript);
    };
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_path: location,
      });
    }

    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location]);

  // Meta Pixel tracking
  useEffect(() => {
    const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

    if (!META_PIXEL_ID) {
      console.log('Meta Pixel: ID não configurado. Adicione VITE_META_PIXEL_ID nas variáveis de ambiente.');
      return;
    }

    // Load Meta Pixel
    !(function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js'
    );

    window.fbq?.('init', META_PIXEL_ID);
    window.fbq?.('track', 'PageView');

    // Track custom events
    const trackEvent = (eventName: string, data?: any) => {
      if (window.fbq) {
        window.fbq('track', eventName, data);
      }
    };

    // Make trackEvent available globally for custom events
    (window as any).trackMetaEvent = trackEvent;

  }, []);

  return null; // This component doesn't render anything
}

// Helper functions for tracking custom events
export const trackGoogleEvent = (eventName: string, eventParams?: any) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

export const trackMetaEvent = (eventName: string, eventParams?: any) => {
  if (window.fbq) {
    window.fbq('track', eventName, eventParams);
  }
};

// Track form submission
export const trackFormSubmit = (formName: string, data?: any) => {
  trackGoogleEvent('form_submit', {
    form_name: formName,
    ...data
  });
  
  trackMetaEvent('Lead', {
    content_name: formName,
    ...data
  });
};

// Track button clicks
export const trackButtonClick = (buttonName: string, data?: any) => {
  trackGoogleEvent('click', {
    button_name: buttonName,
    ...data
  });
  
  trackMetaEvent('ClickButton', {
    content_name: buttonName,
    ...data
  });
};

// Track conversions
export const trackConversion = (conversionType: string, value?: number, currency: string = 'BRL') => {
  trackGoogleEvent('conversion', {
    conversion_type: conversionType,
    value: value,
    currency: currency
  });
  
  trackMetaEvent('Purchase', {
    value: value,
    currency: currency,
    content_name: conversionType
  });
};
