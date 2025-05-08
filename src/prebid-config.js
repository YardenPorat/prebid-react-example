// Prebid.js configuration
var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

// Define the ad unit
var adUnits = [{
  code: 'div-gpt-ad-1460505748561-0',
  mediaTypes: {
    banner: {
      sizes: [[300, 250], [300, 600]]
    }
  },
  bids: [
    {
      bidder: "adkernel",
      params: {
        zoneId: 261853,
        host: "cpm.pressize.com",
      },
    },
  ],
}];

// Initialize Google Publisher Tag
window.googletag = window.googletag || { cmd: [] };
googletag.cmd.push(function() {
  googletag.pubads().disableInitialLoad();
  
  // Define the ad slot
  googletag.defineSlot('/19968336/header-bid-tag-0', [[300, 250], [300, 600]], 'div-gpt-ad-1460505748561-0')
    .addService(googletag.pubads());
  
  googletag.pubads().enableSingleRequest();
  googletag.enableServices();
});

// Initialize Prebid
pbjs.que.push(function() {
  // Set config for currency, user syncing, etc.
  pbjs.setConfig({
    debug: true,
    bidderTimeout: 1000,
  });
  
  // Add the ad units
  pbjs.addAdUnits(adUnits);
  
  // Request bids and set targeting
  pbjs.requestBids({
    bidsBackHandler: sendAdserverRequest
  });
});

// Send request to ad server
function sendAdserverRequest() {
  if (pbjs.adserverRequestSent) return;
  pbjs.adserverRequestSent = true;
  
  googletag.cmd.push(function() {
    pbjs.que.push(function() {
      pbjs.setTargetingForGPTAsync();
      googletag.pubads().refresh();
    });
  });
}

// Failsafe timeout
setTimeout(function() {
  sendAdserverRequest();
}, 1500);
