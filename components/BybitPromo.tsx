import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function BybitPromo() {
  const AFFILIATE_LINK = "https://partner.bybit.eu/b/STIRICRYPTO"; 

  return (
    <div className="w-full my-16 relative group">
      
      {/* 1. Glow Effect din spate (Lumina difuză galbenă) */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#F7A600] to-yellow-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      
      {/* 2. Containerul Principal (Glassmorphism) */}
      <div className="relative w-full bg-[#0F1115] ring-1 ring-white/10 rounded-xl overflow-hidden shadow-2xl">
        
        {/* Background Pattern subtil */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#F7A600]/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Partea Stângă: Branding & Text */}
          <div className="flex-1 text-center md:text-left space-y-4">
            
            {/* Header: Logo & Badge */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
               {/* Logo Text Stilizat */}
               <h3 className="text-3xl font-black text-white tracking-tighter flex items-center gap-1 font-[var(--font-space)]">
                  BYBIT <span className="text-[#F7A600] text-4xl leading-none">.</span>
               </h3>
               
               {/* Badge MiCA */}
               <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                  <ShieldCheck size={12} /> Reglementat MiCA
               </div>
            </div>

            <h4 className="text-xl text-gray-200 font-bold leading-tight">
              Platforma Institutională #1 din Europa
            </h4>
            
            <p className="text-gray-400 text-sm max-w-md mx-auto md:mx-0 leading-relaxed">
              Execuție ultra-rapidă, lichiditate adâncă și siguranță reglementată.
              <span className="text-gray-300 block mt-1">Nu îți risca capitalul pe exchange-uri obscure.</span>
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/5 flex items-center gap-1"><Zap size={10} className="text-yellow-500"/> 0.01ms Latency</span>
                <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/5 flex items-center gap-1"><Globe size={10} className="text-blue-500"/> Global Liquidity</span>
            </div>
          </div>

          {/* Partea Dreaptă: Buton Masiv */}
          <div className="shrink-0 w-full md:w-auto">
            <Link 
              href={AFFILIATE_LINK} 
              target="_blank"
              className="group/btn relative flex items-center justify-center gap-3 bg-[#F7A600] hover:bg-[#ffb300] text-black font-black text-lg px-10 py-5 rounded-xl transition-all transform hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(247,166,0,0.4)] w-full md:w-auto"
            >
              Deschide Cont
              <ArrowRight size={22} className="group-hover/btn:translate-x-1 transition-transform"/>
            </Link>
            <p className="text-[10px] text-center mt-3 text-gray-500 font-mono">
              🎁 Bonus de bun venit activat
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}