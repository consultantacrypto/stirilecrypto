'use client';

import { ArrowRight, Newspaper, TrendingUp, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative pt-20 pb-20 overflow-hidden min-h-[85vh] flex items-center">
        {/* Background Lights */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[100px] -z-10" />
        
        <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* TEXT */}
            <div className="flex-1 text-center lg:text-left z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium mb-8 backdrop-blur-md"
                >
                    <Activity size={16} className="text-green-400"/>
                    <span className="text-white font-bold">Live</span> Market Intelligence &amp; Știri Crypto
                </motion.div>

                <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-8 tracking-tight">
                    Portalul tău de <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-white">
                        Web3 &amp; Finanțe.
                    </span>
                </h1>

                <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 pl-6 border-l-2 border-blue-500/30">
                    <b>Știrile Crypto</b> aduce context, nu zgomot: analize on-chain, știri filtrate și date de piață pentru decizii informate — nu reacții la panică.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                    <Link href="/stiri" className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.15)] transform hover:-translate-y-1">
                        Citește Știrile <ArrowRight size={18}/>
                    </Link>
                    <Link href="/market" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-md group">
                        <Newspaper size={20} className="text-green-400 group-hover:scale-110 transition-transform"/> Market Data
                    </Link>
                </div>

                {/* ✅ FIX CONTRAST: Schimbat text-gray-500 -> text-gray-400 */}
                <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-400 font-medium">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={18} className="text-green-500"/> Analize On-Chain
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-blue-500"/> Context Editorial
                    </div>
                </div>
            </div>

            {/* IMAGINE HERO */}
            <div className="flex-1 relative w-full max-w-[480px]">
                <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-900/20 bg-[#0a0f1e] aspect-[4/5] group">
                    {/* ✅ FIX LCP: fetchPriority="high" adăugat */}
                    <Image 
                        src="/mihai-daniel-icon.jpg" 
                        alt="Știrile Crypto — Portal Web3"
                        fill
                        priority={true}
                        fetchPriority="high"
                        className="object-cover w-full h-full opacity-100 group-hover:scale-105 transition-transform duration-1000"
                        sizes="(max-width: 768px) 100vw, 500px"
                    />
                    
                    <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl z-20">
                        <div className="text-white font-bold text-lg">Știrile Crypto</div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Web3 &amp; Finanțe</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}