"use client";

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';

interface CoinData {
  id: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export default function CryptoTicker() {
  const [data, setData] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrices = async () => {
    try {
      // Fetch simplu de la CoinGecko (Free API)
      const res = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,elrond-erd-2&order=market_cap_desc&per_page=5&page=1&sparkline=false'
      );
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (error) {
      console.error("Eroare la preluarea prețurilor:", error);
    }
  };

  useEffect(() => {
    fetchPrices();
    // Actualizăm la fiecare 60 de secunde
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return null; // Nu arătăm nimic până nu avem date

  return (
    <div className="w-full bg-[#050b1f] border-b border-white/5 h-10 flex items-center overflow-hidden relative z-[40]">
      <div className="flex animate-marquee whitespace-nowrap items-center gap-12 px-4">
        {/* Dublăm lista pentru efectul de infinit scroll */}
        {[...data, ...data, ...data].map((coin, idx) => (
          <div key={`${coin.id}-${idx}`} className="flex items-center gap-2 text-xs font-mono font-bold">
            <span className="uppercase text-gray-400">{coin.symbol}</span>
            <span className="text-white">${coin.current_price.toLocaleString()}</span>
            <span className={`flex items-center ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
              {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      
      {/* Stil pentru animație */}
      <style jsx>{`
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}