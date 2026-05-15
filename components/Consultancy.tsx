'use client';

import { useState } from 'react';
import { Crown, ArrowRight, FileText, Zap, BookOpen, Star } from 'lucide-react';
import CryptoPaymentModal from './CryptoPaymentModal';
import Image from 'next/image';

export default function Consultancy() {
  const [isPaymentOpen, setPaymentOpen] = useState(false);

  // ✅ TRACKING INTRARE: Numărăm click-urile pe "Rezervă"
  const handleOpenBooking = () => {
    // Anunțăm Google că cineva a început procesul
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: 250,
        items: [{ item_name: 'Consultanta VIP 1 la 1', item_id: 'consultancy_vip' }]
      });
    }
    setPaymentOpen(true);
  };

  return (
    <section id="consultanta" className="py-24 bg-[#050b1d] border-t border-white/5 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-yellow-600/5 rounded-full blur-[150px] pointer-events-none"></div>
        
        <CryptoPaymentModal 
            isOpen={isPaymentOpen} 
            onClose={() => setPaymentOpen(false)} 
            title="Consultanță VIP 1 la 1" 
            price={250} 
            type="consultancy"
        />

        <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                
                <div className="flex-1 space-y-8">
                    <div className="inline-flex items-center gap-2 text-yellow-500 border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 rounded-lg uppercase tracking-widest text-xs font-bold shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                        <Crown size={14}/> Inner Circle
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold leading-tight text-white">
                        Consultanță <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">VIP 1 la 1</span>
                    </h2>
                    
                    <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-yellow-500/50 pl-6">
                        O oră intensivă. Audităm portofoliul, corectăm greșelile și setăm strategia de Exit.
                        <span className="block mt-2 text-white font-bold">Nu discutăm teorie. Discutăm banii tăi.</span>
                    </p>
                    
                    <div className="bg-gradient-to-br from-[#1a1500] to-black border border-yellow-500/30 p-6 rounded-2xl relative group hover:border-yellow-500/60 transition-colors">
                        <div className="absolute top-0 right-0 bg-yellow-600 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl">BONUS GRATUIT ($200)</div>
                        <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                            <Zap size={18} className="text-yellow-500"/> PACHET AI INVESTOR
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <FileText size={18} className="text-yellow-600 mt-0.5"/>
                                <div className="text-sm">
                                    <span className="text-white font-bold">PDF: Audit ca un VC</span> - Prompt-uri secrete de analiză.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <BookOpen size={18} className="text-yellow-600 mt-0.5"/>
                                <div className="text-sm">
                                    <span className="text-white font-bold">PDF: AI în Investiții</span> - Ghid 20 pagini.
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="pt-4">
                        <button 
                            onClick={handleOpenBooking} // ✅ AICI S-A FĂCUT MODIFICAREA CHEIE
                            aria-label="Rezervă sesiunea de consultanță"
                            className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-black text-lg rounded-xl shadow-[0_0_40px_rgba(234,179,8,0.3)] hover:scale-105 transition-transform flex items-center justify-center gap-3 cursor-pointer"
                        >
                            Rezervă Sesiunea - $250 <ArrowRight size={20}/>
                        </button>
                        <p className="text-sm text-gray-400 mt-3 pl-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Maxim 2 locuri pe zi.
                        </p>
                    </div>
                </div>

                <div className="flex-1 relative w-full lg:max-w-[480px]">
                    <div className="relative rounded-2xl overflow-hidden border border-yellow-500/30 shadow-2xl group aspect-[3/4]">
                        <Image 
                            src="/mihai-daniel-consultanta.jpg" 
                            alt="Consultanță Mihai Daniel" 
                            fill
                            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-1000"
                            sizes="(max-width: 768px) 100vw, 500px"
                        />
                        <div className="absolute bottom-6 right-6 left-6 bg-[#0a0f1e]/90 backdrop-blur-md p-4 rounded-xl border border-yellow-500/20">
                            <div className="flex text-yellow-500 mb-1">
                                <Star size={14} fill="currentColor"/>
                                <Star size={14} fill="currentColor"/>
                                <Star size={14} fill="currentColor"/>
                                <Star size={14} fill="currentColor"/>
                                <Star size={14} fill="currentColor"/>
                            </div>
                            <p className="text-xs text-gray-300 italic">
                                "Cea mai bună oră de consultanță. Mi-a salvat portofoliul de o greșeală majoră."
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
  );
}