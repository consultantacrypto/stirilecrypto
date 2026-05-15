"use client";

import { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, Activity, Zap, Layers } from 'lucide-react';

interface Liquidation {
  id: string;
  exchange: 'Binance' | 'Bybit' | 'OKX';
  symbol: string;
  side: 'Long' | 'Short';
  price: number;
  amount: number; 
  time: number;
}

export default function LiquidationFeed() {
  const [liquidations, setLiquidations] = useState<Liquidation[]>([]);
  const [activeFeeds, setActiveFeeds] = useState<string[]>([]);

  const addLiquidation = (liq: Liquidation) => {
    setLiquidations((prev) => [liq, ...prev].slice(0, 12)); // Păstrăm ultimele 12
  };

  useEffect(() => {
    // 1. BINANCE
    const binanceWs = new WebSocket('wss://fstream.binance.com/ws/!forceOrder@arr');
    binanceWs.onopen = () => setActiveFeeds(prev => [...prev, 'Binance']);
    binanceWs.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const data = msg.o;
        addLiquidation({
          id: `binance-${Date.now()}-${Math.random()}`,
          exchange: 'Binance',
          symbol: data.s.replace('USDT', ''),
          side: data.S === 'SELL' ? 'Long' : 'Short',
          price: parseFloat(data.p),
          amount: parseFloat(data.p) * parseFloat(data.q),
          time: Date.now(),
        });
      } catch (e) { console.error(e); }
    };

    // 2. BYBIT
    const bybitWs = new WebSocket('wss://stream.bybit.com/v5/public/linear');
    bybitWs.onopen = () => {
      setActiveFeeds(prev => [...prev, 'Bybit']);
      bybitWs.send(JSON.stringify({ "op": "subscribe", "args": ["liquidation.BTCUSDT", "liquidation.ETHUSDT", "liquidation.SOLUSDT", "liquidation.XRPUSDT"] }));
    };
    bybitWs.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.topic && msg.topic.includes('liquidation') && msg.data) {
          const data = msg.data;
          addLiquidation({
            id: `bybit-${Date.now()}-${Math.random()}`,
            exchange: 'Bybit',
            symbol: data.symbol.replace('USDT', ''),
            side: data.side === 'Buy' ? 'Short' : 'Long', 
            price: parseFloat(data.price),
            amount: parseFloat(data.price) * parseFloat(data.size),
            time: Date.now(),
          });
        }
      } catch (e) { console.error(e); }
    };

    // 3. OKX
    const okxWs = new WebSocket('wss://ws.okx.com:8443/ws/v5/public');
    okxWs.onopen = () => {
      setActiveFeeds(prev => [...prev, 'OKX']);
      okxWs.send(JSON.stringify({
        "op": "subscribe",
        "args": [{"channel": "liquidation-orders", "instType": "SWAP"}]
      }));
    };
    okxWs.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.arg && msg.arg.channel === 'liquidation-orders' && msg.data) {
          const data = msg.data[0];
          // Estimare valoare contract OKX (aprox)
          const estimatedVal = parseFloat(data.bkPx) * parseFloat(data.sz) * 0.01; 
          
          addLiquidation({
            id: `okx-${Date.now()}-${Math.random()}`,
            exchange: 'OKX',
            symbol: data.instId.split('-')[0],
            side: data.posSide === 'long' ? 'Long' : 'Short',
            price: parseFloat(data.bkPx),
            amount: estimatedVal, 
            time: Date.now(),
          });
        }
      } catch (e) { console.error(e); }
    };

    return () => {
      binanceWs.close();
      bybitWs.close();
      okxWs.close();
    };
  }, []);

  return (
    <div className="w-full bg-[#0b1221] border border-blue-900/30 rounded-2xl p-6 shadow-2xl overflow-hidden relative min-h-[600px]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-800 pb-4 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="text-red-500 animate-pulse" size={24}/> 
            Global Liquidation Stream
          </h3>
          <div className="flex gap-2 mt-2">
            {['Binance', 'Bybit', 'OKX'].map(ex => (
              <span key={ex} className={`text-[10px] px-2 py-0.5 rounded border ${activeFeeds.includes(ex) ? 'bg-green-900/20 border-green-500/30 text-green-400' : 'bg-gray-800 border-gray-700 text-gray-500'}`}>
                {ex}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex gap-4 text-xs font-mono bg-black/30 p-2 rounded-lg">
            <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_green]"></span>
                <span className="text-gray-300">Shorts (Urși)</span>
            </div>
            <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_red]"></span>
                <span className="text-gray-300">Longs (Tauri)</span>
            </div>
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-2">
        <div className="grid grid-cols-4 text-xs text-gray-500 uppercase font-bold px-4 mb-2 tracking-wider">
            <span>Exchange / Pereche</span>
            <span className="text-center">Tip</span>
            <span className="text-right">Preț</span>
            <span className="text-right">Valoare</span>
        </div>

        {liquidations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 animate-pulse">
            <Layers size={48} className="mb-4 opacity-20"/>
            <p>Conectare la serverele globale...</p>
            <p className="text-xs text-gray-600 mt-2">Se scanează Binance, Bybit, OKX.</p>
          </div>
        ) : (
          liquidations.map((liq) => (
            <div 
              key={liq.id} 
              className={`grid grid-cols-4 items-center p-3 rounded-lg border transition-all duration-300 animate-in slide-in-from-top fade-in hover:scale-[1.01] ${
                liq.side === 'Long' 
                  ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10' 
                  : 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10'
              }`}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-1.5 rounded font-bold ${
                        liq.exchange === 'Binance' ? 'bg-yellow-500/20 text-yellow-500' :
                        liq.exchange === 'Bybit' ? 'bg-orange-500/20 text-orange-500' :
                        'bg-blue-500/20 text-blue-500'
                    }`}>
                        {liq.exchange}
                    </span>
                    <span className="font-bold text-white text-sm">{liq.symbol}</span>
                </div>
              </div>

              <div className="text-center">
                <span className={`text-xs font-black px-2 py-1 rounded uppercase flex items-center justify-center gap-1 mx-auto w-fit ${
                    liq.side === 'Long' ? 'text-red-400 bg-red-900/20' : 'text-green-400 bg-green-900/20'
                }`}>
                    {liq.side === 'Long' ? <TrendingDown size={12}/> : <TrendingUp size={12}/>}
                    {liq.side}
                </span>
              </div>

              <div className="text-right font-mono text-gray-300 text-sm">
                ${liq.price.toLocaleString()}
              </div>

              <div className="text-right">
                <span className={`font-mono font-bold text-sm ${liq.amount > 50000 ? 'text-yellow-400 animate-pulse' : 'text-white'}`}>
                    ${Math.floor(liq.amount).toLocaleString()}
                </span>
                {liq.amount > 50000 && (
                    <Zap size={10} className="inline ml-1 text-yellow-500" fill="currentColor"/>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center text-[10px] text-gray-500">
        <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
            Live WebSocket Connection
        </p>
        <p>Aggregation Engine v1.0</p>
      </div>
    </div>
  );
}