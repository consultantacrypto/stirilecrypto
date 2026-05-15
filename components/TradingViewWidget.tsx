'use client';

import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current && !container.current.querySelector("script")) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "autosize": true,
          "symbol": "BINANCE:BTCUSDT",
          "interval": "D",
          "timezone": "Europe/Bucharest",
          "theme": "dark",
          "style": "1",
          "locale": "ro",
          "enable_publishing": false,
          "allow_symbol_change": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com",
          "studies": [
            "RSI@tv-basicstudies",
            "MASimple@tv-basicstudies",
            "MACD@tv-basicstudies"
          ]
        }`;
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "500px", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright" style={{ textAlign: 'center', marginTop: '8px' }}>
        <a href="https://www.tradingview.com/?aff_id=114542" rel="noopener nofollow" target="_blank">
          <span className="text-blue-400 font-bold hover:text-blue-300 transition-colors text-xs uppercase tracking-wider flex justify-center items-center gap-2">
             ⚡ Deschide cont pe TradingView (Oferta Mea)
          </span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);