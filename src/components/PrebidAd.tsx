import { useEffect, useRef } from 'react';

// Define types for Prebid.js and Google Publisher Tag
interface PbjsNamespace {
  que: Array<() => void>;
  addAdUnits: (adUnits: Array<unknown>) => void;
  setConfig: (config: Record<string, unknown>) => void;
  requestBids: (options: { bidsBackHandler: () => void }) => void;
  setTargetingForGPTAsync: () => void;
  adserverRequestSent?: boolean;
  version?: string;
}

interface GoogTagNamespace {
  cmd: Array<() => void>;
  pubads: () => {
    disableInitialLoad: () => void;
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
    pbjs: PbjsNamespace;
    googletag: GoogTagNamespace;
  }
}

interface PrebidAdProps {
  adUnitCode: string;
}

const PrebidAd = ({ adUnitCode }: PrebidAdProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    
    console.log('Initializing Prebid.js...');
    initialized.current = true;

    // Initialize Prebid
    window.pbjs = window.pbjs || {};
    window.pbjs.que = window.pbjs.que || [];

    // Initialize Google Publisher Tag
    window.googletag = window.googletag || { cmd: [] };

    // Define ad unit path and sizes
    const adUnitPath = '/19968336/header-bid-tag-0';
    const adSizes = [[300, 250]];

    // Configure GPT first
    window.googletag.cmd.push(() => {
      console.log('Configuring GPT...');
      window.googletag.pubads().disableInitialLoad();

      // Define the ad slot
      window.googletag
        .defineSlot(adUnitPath, adSizes, adUnitCode)
        .addService(window.googletag.pubads());

      window.googletag.pubads().enableSingleRequest();
      window.googletag.enableServices();
    });

    // Configure Prebid
    window.pbjs.que.push(() => {
      console.log('Configuring Prebid.js...');
      console.log('Prebid.js version:', window.pbjs.version);
      
      // Set minimal config with increased timeout
      window.pbjs.setConfig({
        debug: true,
        bidderTimeout: 3000,  // Increased timeout for adkernel
        userSync: {
          syncEnabled: true,
          syncDelay: 3000
        }
      });

      // Define the ad unit with adkernel bidder
      const adUnit = {
        code: adUnitCode,
        mediaTypes: {
          banner: {
            sizes: adSizes
          }
        },
        bids: [{
          bidder: 'adkernel',
          params: {
            zoneId: 261853,
            host: 'cpm.pressize.com'
          }
        }]
      };

      // Add the ad unit
      window.pbjs.addAdUnits([adUnit]);
      
      // Request bids with a simple callback
      window.pbjs.requestBids({
        bidsBackHandler: () => {
          console.log('Bids received, setting targeting');
          window.googletag.cmd.push(() => {
            window.pbjs.setTargetingForGPTAsync();
            console.log('Displaying ad');
            window.googletag.display(adUnitCode);
            console.log('Refreshing ads');
            window.googletag.pubads().refresh();
          });
        }
      });
    });

    // Failsafe timeout - if no bids received, still show the ad
    setTimeout(() => {
      console.log('Failsafe timeout triggered');
      window.googletag.cmd.push(() => {
        if (!document.getElementById(adUnitCode)?.innerHTML) {
          console.log('No ad content detected, forcing display');
          window.googletag.display(adUnitCode);
          window.googletag.pubads().refresh();
        }
      });
    }, 3000);
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

export default PrebidAd;
