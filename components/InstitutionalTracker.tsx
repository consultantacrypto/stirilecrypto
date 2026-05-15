'use client';

import React from 'react';
import { 
  BrainCircuit, 
  Wallet, 
  TrendingUp, 
  Shield, 
  Globe, 
  Building2, 
  Rocket, 
  Bitcoin, 
  Landmark 
} from 'lucide-react';

// --- DATA SOURCE: "RAPORT STRATEGIC GLOBAL 2015-2025" ---
const institutions = [
  // I. LEVIATANII (Asset Managers)
  {
    rank: 1,
    name: "BlackRock",
    icon: <Building2 className="w-4 h-4 text-blue-400" />,
    type: "Asset Manager",
    aum: "$11.55 T",
    alpha: "IBIT ETF Launch",
    topHolding: "Nvidia / Apple",
    stance: "ARCHITECT",
    stanceColor: "bg-green-500/20 text-green-400 border-green-500/50",
    bet2026: "AI Infra & Tokenization"
  },
  {
    rank: 2,
    name: "Vanguard",
    icon: <Building2 className="w-4 h-4 text-gray-400" />,
    type: "Mutual Structure",
    aum: "$10.10 T",
    alpha: "Anti-Crypto Stance",
    topHolding: "Apple / Microsoft",
    stance: "SKEPTIC",
    stanceColor: "bg-red-500/10 text-red-400 border-red-500/30",
    bet2026: "Income & Bonds"
  },
  {
    rank: 3,
    name: "Fidelity",
    icon: <Building2 className="w-4 h-4 text-green-400" />,
    type: "Private Manager",
    aum: "$5.52 T",
    alpha: "Crypto in 401(k)",
    topHolding: "Microsoft / FBTC",
    stance: "INTEGRATOR",
    stanceColor: "bg-green-500/20 text-green-400 border-green-500/50",
    bet2026: "Institutional DeFi"
  },
  {
    rank: 4,
    name: "State Street",
    icon: <Building2 className="w-4 h-4 text-blue-300" />,
    type: "Custodian Bank",
    aum: "$4.71 T",
    alpha: "SPY Dominance",
    topHolding: "Microsoft / Apple",
    stance: "PRAGMATIC",
    stanceColor: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    bet2026: "Uncomfortably Bullish"
  },
  {
    rank: 5,
    name: "J.P. Morgan",
    icon: <Landmark className="w-4 h-4 text-blue-500" />,
    type: "Bank Asset Mgmt",
    aum: "$4.04 T",
    alpha: "Onyx Blockchain",
    topHolding: "Microsoft / Amazon",
    stance: "BLOCKCHAIN",
    stanceColor: "bg-gray-500/20 text-gray-300 border-gray-500/50",
    bet2026: "AI Supercycle"
  },
  {
    rank: 6,
    name: "Capital Group",
    icon: <Building2 className="w-4 h-4 text-gray-400" />,
    type: "Active Manager",
    aum: "$2.84 T",
    alpha: "Multi-Manager System",
    topHolding: "Broadcom / Meta",
    stance: "SKEPTIC",
    stanceColor: "bg-red-500/10 text-red-400 border-red-500/30",
    bet2026: "Pharma & Industrials"
  },

  // II. ALPHA FACTORIES (Hedge Funds / PE)
  {
    rank: 7,
    name: "Blackstone",
    icon: <Landmark className="w-4 h-4 text-purple-400" />,
    type: "Private Equity",
    aum: "$1.21 T",
    alpha: "Data Center Landlord",
    topHolding: "QTS Realty / Energy",
    stance: "INFRA",
    stanceColor: "bg-purple-500/20 text-purple-400 border-purple-500/50",
    bet2026: "Energy Transition"
  },
  {
    rank: 8,
    name: "Citadel",
    icon: <TrendingUp className="w-4 h-4 text-green-400" />,
    type: "Hedge Fund / MM",
    aum: "$65 B (Net)",
    alpha: "Basis Trade King",
    topHolding: "Options / NVDA",
    stance: "OPPORTUNIST",
    stanceColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    bet2026: "Debasement Trade"
  },
  {
    rank: 9,
    name: "Bridgewater",
    icon: <Globe className="w-4 h-4 text-yellow-600" />,
    type: "Macro Hedge Fund",
    aum: "$92 B",
    alpha: "Debt Cycle Analysis",
    topHolding: "Gold / Emerging Mkts",
    stance: "GOLD PROXY",
    stanceColor: "bg-yellow-600/20 text-yellow-500 border-yellow-600/50",
    bet2026: "Sovereign Debt Crisis"
  },
  {
    rank: 10,
    name: "Millennium",
    icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
    type: "Pod Shop",
    aum: "$67.9 B",
    alpha: "Bitcoin ETF Arbitrage",
    topHolding: "IBIT ($1.3B) / IVV",
    stance: "TRADER",
    stanceColor: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    bet2026: "Yield Dispersion"
  },
  {
    rank: 11,
    name: "RenTech",
    icon: <BrainCircuit className="w-4 h-4 text-purple-500" />,
    type: "Quant Fund",
    aum: "$75 B",
    alpha: "Medallion Black Box",
    topHolding: "Palantir / NVDA",
    stance: "QUANT",
    stanceColor: "bg-purple-500/20 text-purple-400 border-purple-500/50",
    bet2026: "LLM Signals"
  },
  {
    rank: 12,
    name: "Tiger Global",
    icon: <Rocket className="w-4 h-4 text-orange-400" />,
    type: "Crossover VC",
    aum: "$56 B",
    alpha: "VC Velocity",
    topHolding: "Meta / Microsoft",
    stance: "INFRA",
    stanceColor: "bg-orange-500/20 text-orange-400 border-orange-500/50",
    bet2026: "India & AI SaaS"
  },

  // III. VENTURE VISIONARIES
  {
    rank: 13,
    name: "a16z",
    icon: <Rocket className="w-4 h-4 text-blue-500" />,
    type: "Venture Capital",
    aum: "$52 B",
    alpha: "Crypto Lobbying",
    topHolding: "Coinbase / Solana",
    stance: "ALL-IN",
    stanceColor: "bg-blue-600/20 text-blue-400 border-blue-600/50",
    bet2026: "Agentic AI & Defense"
  },
  {
    rank: 14,
    name: "Sequoia",
    icon: <Rocket className="w-4 h-4 text-green-500" />,
    type: "Venture Capital",
    aum: "$56 B",
    alpha: "Evergreen Structure",
    topHolding: "SpaceX / Stripe",
    stance: "SELECTIVE",
    stanceColor: "bg-gray-500/20 text-gray-300 border-gray-500/50",
    bet2026: "AI Supercycle"
  },
  {
    rank: 15,
    name: "Founders Fund",
    icon: <Rocket className="w-4 h-4 text-purple-400" />,
    type: "Venture Capital",
    aum: "$17 B",
    alpha: "Contrarian Bets",
    topHolding: "SpaceX / Bitcoin",
    stance: "MAXIMALIST",
    stanceColor: "bg-orange-500/20 text-orange-400 border-orange-500/50",
    bet2026: "Hard Tech & Space"
  },
  {
    rank: 16,
    name: "Paradigm",
    icon: <BrainCircuit className="w-4 h-4 text-yellow-400" />,
    type: "Crypto VC",
    aum: "$13 B",
    alpha: "Technical VC",
    topHolding: "Monad / Uniswap",
    stance: "NATIVE",
    stanceColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    bet2026: "Parallel EVM"
  },
  {
    rank: 17,
    name: "Pantera",
    icon: <Bitcoin className="w-4 h-4 text-pink-500" />,
    type: "Crypto Fund",
    aum: "$5 B",
    alpha: "Social Crypto (TON)",
    topHolding: "Bitcoin / TON",
    stance: "FUNDAMENTAL",
    stanceColor: "bg-pink-500/20 text-pink-400 border-pink-500/50",
    bet2026: "Regulatory Clarity"
  },
  {
    rank: 18,
    name: "SoftBank",
    icon: <Globe className="w-4 h-4 text-gray-400" />,
    type: "Mega VC",
    aum: "$150 B",
    alpha: "ARM IPO",
    topHolding: "ARM / ByteDance",
    stance: "TANGENTIAL",
    stanceColor: "bg-gray-500/20 text-gray-300 border-gray-500/50",
    bet2026: "Artificial Superintel."
  },

  // IV. DISRUPTORI CORPORATIVI
  {
    rank: 19,
    name: "MicroStrategy",
    icon: <Bitcoin className="w-4 h-4 text-orange-500" />,
    type: "Bitcoin Treasury",
    aum: "671k BTC",
    alpha: "Fiat Attack",
    topHolding: "Bitcoin (95%)",
    stance: "MAXI",
    stanceColor: "bg-orange-600/20 text-orange-500 border-orange-600/50",
    bet2026: "Global BTC Standard"
  },
  {
    rank: 20,
    name: "Tesla",
    icon: <BrainCircuit className="w-4 h-4 text-red-500" />,
    type: "AI Robotics",
    aum: "11.5k BTC",
    alpha: "Autonomy Network",
    topHolding: "Robotics / BTC",
    stance: "SUPPORTIVE",
    stanceColor: "bg-green-500/20 text-green-400 border-green-500/50",
    bet2026: "FSD & Optimus"
  }
];

export default function InstitutionalTracker() {
  return (
    <div className="w-full h-full flex flex-col">
      
      {/* 1. Header Vizual - Stil "War Room" */}
      <div className="relative mb-6 p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 to-black border border-blue-500/20 overflow-hidden shadow-2xl group hover:border-blue-500/40 transition-all">
        {/* Background Animation */}
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Globe className="w-32 h-32 text-blue-400 animate-[spin_20s_linear_infinite]" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-xl md:text-3xl font-black text-white flex items-center gap-3 font-[var(--font-space)]">
                TOP 20 ARHITECȚII CAPITALULUI
            </h2>
            <span className="hidden md:flex text-[10px] bg-blue-600 px-2 py-0.5 rounded text-white font-mono font-bold animate-pulse">
                DATA 2026
            </span>
          </div>
          <p className="text-gray-400 text-xs md:text-sm max-w-2xl leading-relaxed">
            Monitorizăm <span className="text-white font-bold">Elita Financiară Globală</span>. 
            De la giganții pasivi la vizionarii AI și trezoreriile Bitcoin. 
            Date extrase din "Raportul Strategic Global 2015-2025".
          </p>
        </div>
      </div>

      {/* 2. Tabelul Inteligent - Responsive (Mobile Scroll + Sticky Col) */}
      <div className="bg-[#0a0f1e] border border-gray-800 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] flex-grow">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/80 text-gray-500 text-[10px] md:text-xs uppercase tracking-wider backdrop-blur-md">
                {/* Coloana Sticky Header */}
                <th className="p-4 font-medium border-b border-gray-800 sticky left-0 bg-[#0b1021] z-20 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">Arhitect</th>
                <th className="p-4 font-medium border-b border-gray-800 whitespace-nowrap">Tip & Putere (AUM)</th>
                <th className="p-4 font-medium border-b border-gray-800 whitespace-nowrap">The Alpha (Semnătura)</th>
                <th className="p-4 font-medium border-b border-gray-800 whitespace-nowrap">Top Dețineri Acum</th>
                <th className="p-4 font-medium border-b border-gray-800 whitespace-nowrap text-center">Crypto Stance</th>
                <th className="p-4 font-medium border-b border-gray-800 whitespace-nowrap text-blue-300">Pariul 2026</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {institutions.map((item, index) => (
                <tr key={index} className="group hover:bg-gray-800/40 transition-all duration-300">
                  
                  {/* Coloana Sticky (Numele Companiei) */}
                  <td className="p-4 border-r border-gray-800/50 sticky left-0 bg-[#0a0f1e] group-hover:bg-[#111827] transition-colors z-10 shadow-[4px_0_10px_rgba(0,0,0,0.3)]">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-gray-600 text-[10px]">#{item.rank}</span>
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <div className="font-bold text-white text-sm md:text-base group-hover:text-blue-400 transition-colors">
                          {item.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Restul Coloanelor */}
                  <td className="p-4 whitespace-nowrap">
                    <div className="text-gray-300 font-medium text-xs md:text-sm">{item.type}</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-1 flex items-center gap-1">
                      <Wallet className="w-3 h-3" /> {item.aum}
                    </div>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span className="text-gray-400 text-xs md:text-sm border-b border-dashed border-gray-600 pb-0.5 group-hover:text-white transition-colors cursor-help" title="Semnătura Strategică">
                      {item.alpha}
                    </span>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <div className="font-bold text-white text-xs md:text-sm flex items-center gap-2">
                       {item.topHolding}
                    </div>
                  </td>

                  <td className="p-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${item.stanceColor} shadow-[0_0_10px_rgba(0,0,0,0.1)] uppercase tracking-wider`}>
                      {item.stance}
                    </span>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-blue-300 text-xs md:text-sm font-bold">
                      <BrainCircuit className="w-4 h-4" />
                      {item.bet2026}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Footer Disclaimer */}
      <div className="mt-3 flex flex-col md:flex-row items-center justify-between text-[10px] text-gray-600 px-2 gap-2">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3 h-3" />
          <span>Analiză independentă MihaiDaniel.ro. Datele pot varia.</span>
        </div>
        <div className="font-mono">Sursa: 13F Filings / Rapoarte Anuale 2025</div>
      </div>
    </div>
  );
}