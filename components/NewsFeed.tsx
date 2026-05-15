'use client';

import { TrendingUp, TrendingDown, Minus, BrainCircuit, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { articles } from '@/lib/articles';

export default function NewsFeed() {
  const latestNews = articles.slice(0, 6);

  return (
    <section id="news" className="py-24 container mx-auto px-6 relative border-t border-white/5 bg-[#020617]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-900/10 blur-[100px] pointer-events-none"></div>

        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Ultimele <span className="text-blue-500">Știri</span></h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Nu doar headlines. <span className="text-white font-bold">Context și analiză editorială.</span>
            </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.map((item) => (
                <Link href={`/stiri/${item.slug}`} key={item.slug} className="group relative bg-[#0a0f1e] border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all hover:-translate-y-1 flex flex-col">
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
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{item.category} • {item.date}</span>
                        <h3 className="text-xl font-bold text-white mb-2 mt-3 group-hover:text-blue-400 transition-colors line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{item.summary}</p>
                    </div>
                    {item.mihaiTake && (
                      <div className="p-6 bg-blue-900/5 mt-auto">
                          <div className="flex items-center gap-2 mb-2 text-blue-400 text-xs font-bold uppercase tracking-widest"><BrainCircuit size={14}/> Take Editorial</div>
                          <p className="text-sm text-gray-300 italic border-l-2 border-blue-500/50 pl-3 line-clamp-3">&quot;{item.mihaiTake}&quot;</p>
                      </div>
                    )}
                </Link>
            ))}
        </div>

        <div className="mt-16 text-center">
            <Link href="/stiri" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg hover:scale-105 transform">
                Toate Știrile <ArrowRight size={18}/>
            </Link>
        </div>
    </section>
  );
}