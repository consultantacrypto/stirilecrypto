'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, BrainCircuit, ArrowRight, Calendar, Crown } from 'lucide-react';
import Link from 'next/link';
import { articles } from '@/lib/articles';
import CryptoPaymentModal from './CryptoPaymentModal';

export default function NewsFeed() {
  const latestNews = articles.slice(0, 3);
  const [isConsultancyOpen, setConsultancyOpen] = useState(false);

  return (
    <section id="news" className="py-24 container mx-auto px-6 relative border-t border-white/5 bg-[#020617]">
        <CryptoPaymentModal isOpen={isConsultancyOpen} onClose={() => setConsultancyOpen(false)} title="Consultanță VIP (Urgent)" price={250} type="consultancy" />

        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-900/10 blur-[100px] pointer-events-none"></div>

        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Market <span className="text-blue-500">Intelligence</span></h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Nu doar știri. <span className="text-white font-bold">Interpretarea lor.</span>
            </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.map((item, idx) => (
                <Link href={`/stiri/${item.slug}`} key={idx} className="group relative bg-[#0a0f1e] border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all hover:-translate-y-1 flex flex-col">
                    <div className="h-48 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] to-transparent z-10"></div>
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                        <div className="absolute top-4 left-4 z-20 flex gap-2">
                             {item.impact === 'bullish' && <span className="text-[10px] font-bold bg-green-500/90 text-black px-2 py-1 rounded flex items-center gap-1"><TrendingUp size={12}/> BULLISH</span>}
                             {item.impact === 'bearish' && <span className="text-[10px] font-bold bg-red-500/90 text-white px-2 py-1 rounded flex items-center gap-1"><TrendingDown size={12}/> BEARISH</span>}
                             {item.impact === 'neutral' && <span className="text-[10px] font-bold bg-gray-500/90 text-white px-2 py-1 rounded flex items-center gap-1"><Minus size={12}/> NEUTRAL</span>}
                        </div>
                    </div>
                    <div className="p-6 border-b border-white/5 flex-1">
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1 uppercase tracking-wider">{item.category} • {item.date}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{item.summary}</p>
                    </div>
                    <div className="p-6 bg-blue-900/5 mt-auto">
                        <div className="flex items-center gap-2 mb-2 text-blue-400 text-xs font-bold uppercase tracking-widest"><BrainCircuit size={14}/> Mihai's Take</div>
                        <p className="text-sm text-gray-300 italic border-l-2 border-blue-500/50 pl-3 line-clamp-3">"{item.mihaiTake}"</p>
                    </div>
                </Link>
            ))}
        </div>

        <div className="mt-16 text-center bg-yellow-900/10 border border-yellow-500/20 p-8 rounded-3xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-2">Te îngrijorează știrile de azi?</h3>
            <p className="text-gray-400 mb-6">Nu lua decizii pe bază de panică. Hai să facem un plan clar.</p>
            <button onClick={() => setConsultancyOpen(true)} className="px-8 py-4 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mx-auto hover:scale-105 transform">
                <Crown size={18}/> Rezervă o Ședință de Strategie
            </button>
        </div>
    </section>
  );
}