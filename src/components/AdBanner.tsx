import { useEffect, useRef } from 'react';

const AdBanner = () => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    // Set atOptions
    (window as any).atOptions = {
      key: 'e81b0ebc453acfb5ba756f9c31386674',
      format: 'iframe',
      height: 250,
      width: 300,
      params: {}
    };
    
    const script = document.createElement('script');
    script.src = 'https://www.highperformanceformat.com/e81b0ebc453acfb5ba756f9c31386674/invoke.js';
    script.async = true;
    ref.current.appendChild(script);
    
    return () => {
      if (ref.current) ref.current.innerHTML = '';
    };
  }, []);
  
  return (
    <div 
      ref={ref}
      style={{
        width: '300px',
        minHeight: '250px',
        margin: '24px auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    />
  );
};

export default AdBanner;
