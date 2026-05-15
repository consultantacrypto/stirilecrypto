'use client';

import { useState } from 'react';
import { Play, Lock, CheckCircle2, MonitorPlay, Smartphone, Infinity, Star, ChevronRight, BarChart2, ShieldCheck, BrainCircuit, TrendingUp, AlertTriangle } from 'lucide-react';
import CryptoPaymentModal from './CryptoPaymentModal';

export default function Course() {
  const [isPaymentOpen, setPaymentOpen] = useState(false);

  return (
    <section id="curs" className="py-24 container mx-auto px-6 relative overflow-hidden">
        {/* MODALUL DE PLATĂ - ACUM ESTE CORECT */}
        <CryptoPaymentModal 
            isOpen={isPaymentOpen} 
            onClose={() => setPaymentOpen(false)} 
            title="Curs Complet Trading" 
            price={300} 
            type="course" // <--- AICI ERA EROAREA, AM ADĂUGAT TIPUL
        />

        {/* Background Atmosphere */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/10 blur-[150px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/10 blur-[150px] -z-10 pointer-events-none"></div>

        {/* --- HEADER --- */}
        <div className="text-center mb-20 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold mb-6 uppercase tracking-widest">
                 <AlertTriangle size={14}/> Stop Pierderilor
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                De ce 90% din traderi <span className="text-red-500">pierd bani?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                Pentru că tratează piața ca pe un cazinou. <br className="hidden md:block"/>
                Dacă vrei să faci din asta o profesie, ai nevoie de un <b>Sistem</b>. Nu de noroc.
            </p>
        </div>

        {/* --- CONTENT --- */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-24">
            
            {/* Left: The Promise */}
            <div className="lg:col-span-5 space-y-8">
                <h3 className="text-3xl font-bold text-white">Ce primești în <span className="text-blue-500">Sistemul Meu?</span></h3>
                <p className="text-gray-400 leading-relaxed">
                    Am condensat 5 ani de experiență și greșeli costisitoare într-un program intensiv de 4 ore. 
                    Este "scurtătura" ta către profitabilitate consistentă.
                </p>
                
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/20"><BarChart2 size={24}/></div>
                        <div>
                            <h4 className="text-white font-bold">Analiză Tehnică Reală</h4>
                            <p className="text-sm text-gray-500">Nu desene pe grafic. Înțelegi structura pieței și lichiditatea.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 shrink-0 border border-green-500/20"><TrendingUp size={24}/></div>
                        <div>
                            <h4 className="text-white font-bold">20+ Strategii Validate</h4>
                            <p className="text-sm text-gray-500">Setup-uri clare de intrare și ieșire. Scalp, Day Trading, Swing.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Video Mockup */}
            <div className="lg:col-span-7 relative group cursor-pointer" onClick={() => setPaymentOpen(true)}>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                
                <div className="relative bg-[#0a0f1e] rounded-xl overflow-hidden border border-white/10 shadow-2xl aspect-video flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all"></div>
                    
                    {/* Big Play Button */}
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform z-10 shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                        <Play size={40} className="text-white fill-white ml-2"/>
                    </div>

                    {/* Bottom Bar Info */}
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                        <div>
                            <div className="flex gap-2 mb-2">
                                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Masterclass</span>
                                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1"><MonitorPlay size={10}/> 4K VIDEO</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white">Arta Tranzacționării</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- CTA --- */}
        <div className="mt-12 text-center pt-8 border-t border-white/10">
            <div className="flex flex-col items-center justify-center mb-6">
                <span className="text-sm text-gray-400 line-through mb-1">Valoare Reală: $600</span>
                <div className="flex items-center gap-3">
                    <span className="text-5xl font-bold text-white">$300</span>
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded border border-green-500/50">PREȚ UNIC</span>
                </div>
            </div>
            
            <button 
                onClick={() => setPaymentOpen(true)}
                className="group relative inline-flex items-center justify-center gap-3 px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl rounded-xl transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] hover:-translate-y-1 w-full md:w-auto"
            >
                <Lock size={20} className="text-blue-200"/> Vreau Acces Instant
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform"/>
            </button>
            
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-gray-500 font-medium uppercase tracking-wider">
                <span className="flex items-center gap-1"><Infinity size={14} className="text-blue-500"/> Acces pe viață</span>
                <span className="flex items-center gap-1"><Smartphone size={14} className="text-blue-500"/> Disponibil pe Mobil</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-green-500"/> Plată Crypto Securizată</span>
            </div>
        </div>
    </section>
  );
}