import "./App.css";
import PrebidAd from "./components/PrebidAd";
import SimpleAd from "./components/SimpleAd";

function App() {
  return (
    <>
      <h1>Ad Examples</h1>
      
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "20px" }}>
        {/* Prebid.js Ad */}
        <div className="ad-container" style={{ margin: "20px", width: "300px" }}>
          <h2>Prebid.js Ad</h2>
          <p>Header bidding with adkernel bidder</p>
          <PrebidAd adUnitCode="div-gpt-ad-1460505748561-0" />
        </div>
        
        {/* Simple Google Ad Manager Ad */}
        <div className="ad-container" style={{ margin: "20px", width: "300px" }}>
          <h2>Simple Ad</h2>
          <p>Direct Google Ad Manager without header bidding</p>
          <SimpleAd adUnitCode="div-gpt-ad-simple-example" />
        </div>
      </div>
    </>
  );
}

export default App;
