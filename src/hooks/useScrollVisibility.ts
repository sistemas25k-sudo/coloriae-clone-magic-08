import { useState, useEffect } from 'react';

export const useScrollVisibility = (elementId: string) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById(elementId);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const isElementVisible = rect.bottom > 0 && rect.top < window.innerHeight;
      
      setIsVisible(!isElementVisible);
    };

    const throttledHandleScroll = () => {
      let ticking = false;
      
      return () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      };
    };

    const throttledScroll = throttledHandleScroll();
    
    window.addEventListener('scroll', throttledScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', throttledScroll);
  }, [elementId]);

  return isVisible;
};