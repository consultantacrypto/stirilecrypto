import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AffiliateSection from '@/components/AffiliateSection';
import { Building2, Wallet, TrendingUp, Shield, Globe, Rocket, Bitcoin, BrainCircuit, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// --- BAZA DE DATE EXTINSĂ (DOSARELE COMPLETE) ---
const dossiers = [
  // I. LEVIATANII
  {
    category: "LEVIATANII (Asset Managers)",
    color: "blue",
    companies: [
      {
        name: "BlackRock",
        role: "Arhitectul Sistemului",
        aum: "$11.55 Trilioane",
        ceo: "Larry Fink",
        analysis: "A definit deceniul prin sistemul Aladdin și legitimarea Bitcoin. Pivotul de la ESG la 'Infrastructură de Tranziție' și Crypto a schimbat regulile jocului.",
        bet2026: "Tokenizarea Activelor (RWA) & Infrastructura AI.",
        icon: <Building2 className="w-8 h-8 text-blue-400" />
      },
      {
        name: "Vanguard",
        role: "Fortăreața Conservatoare",
        aum: "$10.10 Trilioane",
        ceo: "Mortimer J. Buckley",
        analysis: "A refuzat explicit ETF-urile Bitcoin, pariind pe reputație și stabilitate. Rămâne regele costurilor mici și al investițiilor pasive pe termen lung.",
        bet2026: "Income Investing (Obligațiuni & Dividende).",
        icon: <Shield className="w-8 h-8 text-gray-400" />
      },
      {
        name: "Fidelity",
        role: "Supermarketul Agil",
        aum: "$5.52 Trilioane",
        ceo: "Abigail Johnson",
        analysis: "Singurul gigant tradițional care a minat Bitcoin din 2014. A integrat Crypto în planurile de pensii 401(k), normalizând activele digitale.",
        bet2026: "DeFi Instituțional & Servicii de Custodie.",
        icon: <Wallet className="w-8 h-8 text-green-400" />
      }
    ]
  },
  // II. ALPHA FACTORIES
  {
    category: "FABRICILE DE ALPHA (Hedge Funds)",
    color: "purple",
    companies: [
      {
        name: "Citadel",
        role: "Stăpânii Volatilității",
        aum: "$65 Miliarde (Net)",
        ceo: "Ken Griffin",
        analysis: "Domină prin Market Making și strategii de arbitraj ('Basis Trade'). Au trecut de la scepticism la deschiderea unui desk crypto dedicat.",
        bet2026: "The Debasement Trade (Pariu pe inflație).",
        icon: <TrendingUp className="w-8 h-8 text-purple-400" />
      },
      {
        name: "Blackstone",
        role: "Împăratul Piețelor Private",
        aum: "$1.21 Trilioane",
        ceo: "Stephen Schwarzman",
        analysis: "Cel mai mare proprietar de centre de date din lume. Au înțeles că AI-ul are nevoie de imobiliare și energie masivă.",
        bet2026: "Infrastructură Energetică & Credit Privat.",
        icon: <Building2 className="w-8 h-8 text-indigo-400" />
      },
      {
        name: "Millennium",
        role: "Uzina de Alpha",
        aum: "$67.9 Miliarde",
        ceo: "Israel Englander",
        analysis: "Unul dintre cei mai mari cumpărători de ETF-uri Bitcoin pentru arbitraj. Nu au atașament emoțional, doar matematic.",
        bet2026: "Dispersia Randamentelor (Volatility Arbitrage).",
        icon: <BrainCircuit className="w-8 h-8 text-purple-300" />
      }
    ]
  },
  // III. VIZIONARII
  {
    category: "VIZIONARII (Venture Capital)",
    color: "green",
    companies: [
      {
        name: "a16z (Andreessen Horowitz)",
        role: "Software & Politică",
        aum: "~$52 Miliarde",
        ceo: "Marc Andreessen",
        analysis: "Au devenit vocea industriei crypto la Washington (Lobby). Investesc masiv în 'American Dynamism' (Apărare, Spațiu).",
        bet2026: "Agentic AI & Defense Tech.",
        icon: <Rocket className="w-8 h-8 text-blue-500" />
      },
      {
        name: "MicroStrategy",
        role: "Banca Bitcoin",
        aum: "671k+ BTC",
        ceo: "Michael Saylor",
        analysis: "Au transformat bilanțul companiei într-o armă speculativă împotriva dolarului. Se împrumută fiat pentru a cumpăra 'hard money'.",
        bet2026: "Standardul Bitcoin Global.",
        icon: <Bitcoin className="w-8 h-8 text-orange-500" />
      }
    ]
  }
];

export default function RaportStrategicPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white font-sans">
      <Navbar />

      <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
        
        {/* HEADER */}
        <div className="mb-12">
            <Link href="/market" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm font-bold">
                <ArrowLeft size={16} /> Înapoi la Market Data
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 font-[var(--font-space)]">
                DOSARUL <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">STRATEGIC 2026</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">
                Analiza detaliată a celor care controlează fluxurile globale de capital. 
                De la "Leviatanii" de 10 Trilioane $ la "Vizionarii" care construiesc viitorul banilor.
            </p>
        </div>

        {/* CONTENT GRID */}
        <div className="space-y-16">
            {dossiers.map((section, idx) => (
                <div key={idx} className="relative">
                    
                    {/* Section Title */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className={`h-px flex-1 bg-gradient-to-r from-${section.color}-500/50 to-transparent`}></div>
                        <h2 className={`text-2xl font-bold text-${section.color}-400 uppercase tracking-widest border border-${section.color}-500/30 px-4 py-1 rounded-full bg-${section.color}-500/10`}>
                            {section.category}
                        </h2>
                        <div className={`h-px flex-1 bg-gradient-to-l from-${section.color}-500/50 to-transparent`}></div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {section.companies.map((company, cIdx) => (
                            <div key={cIdx} className="group bg-[#0a0f1e] border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden">
                                
                                {/* Background Gradient on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br from-${section.color}-900/0 to-${section.color}-900/20 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                                
                                {/* Header Card */}
                                <div className="relative z-10 flex justify-between items-start mb-4">
                                    <div className="p-3 bg-gray-900 rounded-xl border border-gray-700 group-hover:border-gray-500 transition-colors">
                                        {company.icon}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 uppercase font-bold">AUM / Putere</div>
                                        <div className="text-sm font-mono text-white font-bold">{company.aum}</div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">{company.name}</h3>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">{company.role}</p>
                                    
                                    <div className="space-y-4">
                                        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                "{company.analysis}"
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-1">
                                                <TargetIcon /> PARIUL PENTRU 2026
                                            </div>
                                            <p className={`text-sm font-bold text-${section.color}-400`}>
                                                {company.bet2026}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* CEO Badge */}
                                <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-100 transition-opacity text-[10px] text-gray-400 font-mono">
                                    CEO: {company.ceo}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        {/* CTA FINAL */}
        <div className="mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
             <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Vrei să citești raportul integral?</h3>
                <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                    Analiza completă (3.000+ cuvinte) despre cum acești giganți se poziționează pentru Superciclul AI și De-dolarizare.
                </p>
                <Link href="/stiri/raport-strategic-global-arhitectii-capitalului-2026" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/20 transition-all hover:scale-105">
                    <Globe size={20} /> Citește Articolul Complet
                </Link>
             </div>
        </div>

      </div>
      <Footer />
    </main>
  );
}

// Icon Helper
const TargetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
)