import { useEffect, useRef } from 'react';

// Define types for Google Publisher Tag
interface GoogTagNamespace {
  cmd: Array<() => void>;
  pubads: () => {
    enableSingleRequest: () => void;
    refresh: () => void;
  };
  defineSlot: (
    slotPath: string,
    sizes: number[][],
    adUnitCode: string
  ) => {
    addService: (service: unknown) => unknown;
  };
  enableServices: () => void;
  display: (adUnitCode: string) => void;
}

declare global {
  interface Window {
    googletag: GoogTagNamespace;
  }
}

interface SimpleAdProps {
  adUnitCode: string;
}

const SimpleAd = ({ adUnitCode }: SimpleAdProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    
    console.log('Initializing simple ad...');
    initialized.current = true;

    // Initialize Google Publisher Tag
    window.googletag = window.googletag || { cmd: [] };

    // Configure GPT
    window.googletag.cmd.push(() => {
      console.log('Configuring GPT...');

      // Define the ad slot with a test ad unit
      window.googletag
        .defineSlot('/6355419/Travel/Europe/France/Paris', [[300, 250]], adUnitCode)
        .addService(window.googletag.pubads());

      window.googletag.pubads().enableSingleRequest();
      window.googletag.enableServices();
      
      // Display the ad
      console.log('Displaying ad:', adUnitCode);
      window.googletag.display(adUnitCode);
    });
  }, [adUnitCode]);

  return (
    <div style={{ position: 'relative', width: '300px', height: '250px', margin: '0 auto' }}>
      <div 
        id={adUnitCode} 
        ref={divRef} 
        style={{ 
          width: '300px', 
          height: '250px', 
          border: '1px solid #ccc',
          backgroundColor: '#f8f8f8'
        }}
      ></div>
    </div>
  );
};

export default SimpleAd;
