'use client';

import React, { useEffect, useRef, memo } from 'react';

function TickerTape() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current && !container.current.querySelector("script")) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "symbols": [
            {
              "proName": "FOREXCOM:SPXUSD",
              "title": "S&P 500"
            },
            {
              "proName": "TVC:DXY",
              "title": "DXY"
            },
            {
              "proName": "BINANCE:BTCUSDT",
              "title": "Bitcoin"
            },
            {
              "proName": "BINANCE:ETHUSDT",
              "title": "Ethereum"
            },
            {
              "proName": "BINANCE:BNBUSDT",
              "title": "BNB"
            },
            {
              "proName": "BINANCE:SOLUSDT",
              "title": "Solana"
            },
            {
              "proName": "NASDAQ:MSTR",
              "title": "MicroStrategy"
            },
            {
              "proName": "NASDAQ:COIN",
              "title": "Coinbase"
            }
          ],
          "showSymbolLogo": true,
          "colorTheme": "dark",
          "isTransparent": false,
          "displayMode": "adaptive",
          "locale": "ro"
        }`;
      container.current.appendChild(script);
    }
  }, []);

  return (
    // ✅ FIX: Am adăugat 'h-[50px]' și 'overflow-hidden' pentru mobil
    <div className="w-full h-[50px] bg-[#020617] border-b border-white/5 relative z-40 overflow-hidden">
        <div className="tradingview-widget-container" ref={container}>
           <div className="tradingview-widget-container__widget"></div>
        </div>
    </div>
  );
}

export default memo(TickerTape);